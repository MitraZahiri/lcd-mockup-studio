import {
  createWorker,
  PSM,
} from 'tesseract.js'

import {
  chooseOcrScale,
  chooseOcrPadding,
  createOcrVariants,
} from './ocrPreprocessor.js'

import {
  cleanOcrText,
  extractWordsFromBlocks,
} from './ocrExtractor.js'

import {
  fuseOcrCandidates,
} from './ocrFusion.js'

import {
  mergeWordsIntoTextRegions,
  buildOcrText,
} from './ocrRegions.js'

// ======================================================
// LCD OCR ENGINE
// ======================================================
//
// Main OCR pipeline.
//
// Responsibilities:
// - Choose OCR scale and padding
// - Generate preprocessing variants
// - Create and manage one Tesseract worker
// - Run SPARSE_TEXT + SINGLE_BLOCK on every variant
// - Extract word candidates
// - Fuse multi-pass OCR results
// - Convert winners into editable text regions
//
// Image thresholding belongs in imageProcessing.js.
// OCR preprocessing belongs in ocrPreprocessor.js.
// Candidate fusion belongs in ocrFusion.js.
// Region construction belongs in ocrRegions.js.
// ======================================================

const OCR_LANGUAGE = 'eng'

// ======================================================
// PUBLIC API
// ======================================================

export async function recognizeLcdText({
  image,
  width,
  height,
  threshold,
  polarity,
}) {
  validateInput({
    image,
    width,
    height,
    threshold,
    polarity,
  })

  const scale =
    chooseOcrScale(
      width,
      height,
    )

  const padding =
    chooseOcrPadding(
      width,
      height,
    )

  const variants =
    createOcrVariants({
      image,
      width,
      height,
      scale,
      padding,
      threshold,
      polarity,
    })

  const worker =
    await createWorker(
      OCR_LANGUAGE,
    )

  const allCandidates = []

  const passResults = []

  try {
    for (const variant of variants) {
      // ------------------------------------------------
      // SPARSE TEXT
      // ------------------------------------------------

      const sparseResult =
        await runOcrPass({
          worker,

          canvas:
            variant.canvas,

          pageSegmentationMode:
            PSM.SPARSE_TEXT,
        })

      const sparseText =
        cleanOcrText(
          sparseResult?.data?.text ??
            '',
        )

      const sparseCandidates =
        extractWordsFromBlocks(
          sparseResult?.data?.blocks ??
            [],
          {
            scale,
            padding,

            originalWidth:
              width,

            originalHeight:
              height,

            variant:
              variant.name,

            pass:
              'sparse',
          },
        )

      allCandidates.push(
        ...sparseCandidates,
      )

      passResults.push({
        variant:
          variant.name,

        pass:
          'sparse',

        text:
          sparseText,

        candidateCount:
          sparseCandidates.length,
      })

      console.log(
        `[LCD OCR ${variant.name.toUpperCase()} SPARSE TEXT]`,
        sparseText,
      )

      // ------------------------------------------------
      // SINGLE BLOCK
      // ------------------------------------------------

      const blockResult =
        await runOcrPass({
          worker,

          canvas:
            variant.canvas,

          pageSegmentationMode:
            PSM.SINGLE_BLOCK,
        })

      const blockText =
        cleanOcrText(
          blockResult?.data?.text ??
            '',
        )

      const blockCandidates =
        extractWordsFromBlocks(
          blockResult?.data?.blocks ??
            [],
          {
            scale,
            padding,

            originalWidth:
              width,

            originalHeight:
              height,

            variant:
              variant.name,

            pass:
              'block',
          },
        )

      allCandidates.push(
        ...blockCandidates,
      )

      passResults.push({
        variant:
          variant.name,

        pass:
          'block',

        text:
          blockText,

        candidateCount:
          blockCandidates.length,
      })

      console.log(
        `[LCD OCR ${variant.name.toUpperCase()} BLOCK TEXT]`,
        blockText,
      )
    }
  } finally {
    /*
     * Always terminate the worker.
     *
     * If one OCR pass throws, leaving the worker alive
     * can leak Web Workers and memory during repeated
     * Analyze operations.
     */

    await safelyTerminateWorker(
      worker,
    )
  }

  // ====================================================
  // CANDIDATE FUSION
  // ====================================================

  console.log(
    '[LCD OCR ALL CANDIDATES]',
    allCandidates,
  )

  const {
    clusters,
    words,
  } = fuseOcrCandidates(
    allCandidates,
  )

  console.log(
    '[LCD OCR CLUSTERS]',
    clusters,
  )

  console.log(
    '[LCD OCR WINNERS]',
    words,
  )

  // ====================================================
  // EDITABLE TEXT REGIONS
  // ====================================================

  const regions =
    mergeWordsIntoTextRegions(
      words,
    )

  const text =
    buildOcrText(
      regions,
    )

  console.log(
    '[LCD OCR TEXT]',
    text,
  )

  return {
    text,

    regions,

    words,

    clusters,

    candidates:
      allCandidates,

    passes:
      passResults,

    scale,

    padding,
  }
}

// ======================================================
// OCR PASS
// ======================================================

async function runOcrPass({
  worker,
  canvas,
  pageSegmentationMode,
}) {
  await worker.setParameters({
    tessedit_pageseg_mode:
      pageSegmentationMode,

    preserve_interword_spaces:
      '1',

    user_defined_dpi:
      '300',
  })

  return worker.recognize(
    canvas,
    {},
    {
      text: true,
      blocks: true,
    },
  )
}

// ======================================================
// WORKER CLEANUP
// ======================================================

async function safelyTerminateWorker(
  worker,
) {
  if (
    !worker ||
    typeof worker.terminate !==
      'function'
  ) {
    return
  }

  try {
    await worker.terminate()
  } catch (error) {
    /*
     * Worker termination failure should not destroy
     * an otherwise successful OCR result.
     */

    console.warn(
      '[LCD OCR WORKER TERMINATION]',
      error,
    )
  }
}

// ======================================================
// VALIDATION
// ======================================================

function validateInput({
  image,
  width,
  height,
  threshold,
  polarity,
}) {
  if (!image) {
    throw new Error(
      'OCR requires a reference image.',
    )
  }

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new Error(
      'OCR requires valid image dimensions.',
    )
  }

  if (
    !Number.isFinite(threshold)
  ) {
    throw new Error(
      'OCR requires a valid image threshold.',
    )
  }

  if (
    polarity !==
      'dark-on-light' &&
    polarity !==
      'light-on-dark'
  ) {
    throw new Error(
      'OCR requires a valid image polarity.',
    )
  }
}