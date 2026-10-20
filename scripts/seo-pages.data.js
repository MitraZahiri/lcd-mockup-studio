// Content for the static SEO landing pages generated into /tools/<slug>/.
// Each page targets one search intent and embeds a working mini tool.
// Body sections are trusted HTML authored here.

export const SITE_URL = 'https://mitrazahiri.github.io/lcd-mockup-studio/'

const ADAFRUIT_SNIPPET = `#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

// Paste the array generated above:
static const uint8_t PROGMEM bitmap[] = { 0xff, 0x80, /* ... */ };

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.drawBitmap(0, 0, bitmap, 128, 64, SSD1306_WHITE);
  display.display();
}

void loop() {}`

const U8G2_SNIPPET = `#include <U8g2lib.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);

// XBM output (LSB-first, horizontal):
static const unsigned char bitmap[] U8X8_PROGMEM = { 0xff, 0x01, /* ... */ };

void setup() {
  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.drawXBMP(0, 0, 128, 64, bitmap);
  u8g2.sendBuffer();
}

void loop() {}`

const FORMAT_TABLE = `
<table>
  <thead><tr><th>Format</th><th>Byte layout</th><th>Bit order</th><th>Used by</th></tr></thead>
  <tbody>
    <tr><td>Adafruit_GFX</td><td>Horizontal rows, <code>ceil(w/8)</code> bytes per row</td><td>MSB = leftmost pixel</td><td><code>drawBitmap()</code>, MicroPython <code>MONO_HLSB</code></td></tr>
    <tr><td>XBM</td><td>Horizontal rows</td><td>LSB = leftmost pixel</td><td>U8g2 <code>drawXBM()</code> / <code>drawXBMP()</code>, X11, GIMP export</td></tr>
    <tr><td>Vertical pages</td><td>8-pixel tall pages, one byte per column</td><td>LSB = top pixel</td><td>SSD1306 / SH1106 GDDRAM, PCD8544, U8x8</td></tr>
    <tr><td>RGB565</td><td>2 bytes per pixel</td><td>5 bits R, 6 G, 5 B (BE or LE)</td><td>ST7735, ST7789, ILI9341 TFT</td></tr>
  </tbody>
</table>`

const SIZE_TABLE = `
<table>
  <thead><tr><th>Display</th><th>Resolution</th><th>1-bit array size</th></tr></thead>
  <tbody>
    <tr><td>SSD1306 0.96"</td><td>128 × 64</td><td>1024 bytes</td></tr>
    <tr><td>SSD1306 0.91"</td><td>128 × 32</td><td>512 bytes</td></tr>
    <tr><td>SH1106 1.3"</td><td>128 × 64 (132 RAM)</td><td>1024 / 1056 bytes</td></tr>
    <tr><td>Nokia 5110 (PCD8544)</td><td>84 × 48</td><td>504 bytes</td></tr>
    <tr><td>ST7920 12864</td><td>128 × 64</td><td>1024 bytes</td></tr>
    <tr><td>64 × 64 icon</td><td>64 × 64</td><td>512 bytes</td></tr>
    <tr><td>16 × 16 icon</td><td>16 × 16</td><td>32 bytes</td></tr>
  </tbody>
</table>`

export const PAGES = [
  {
    slug: 'hex-to-image',
    lang: 'en',
    tool: 'hex',
    alternate: { tr: 'hex-kodu-resme-cevirme' },
    title: 'Hex to Image Converter Online — Decode Hex Bytes & C Arrays to PNG',
    description: 'Free online hex to image converter. Paste hex bytes or a C bitmap array and instantly see the picture. Supports Adafruit GFX, XBM, U8g2/SSD1306 vertical pages, RGB565 and grayscale. Download as PNG.',
    h1: 'Hex to Image Converter',
    navLabel: 'Hex to Image',
    lead: 'Paste raw hex bytes, a <code>0x..</code> list or a full C array below and the bitmap is decoded instantly in your browser. Nothing is uploaded.',
    sections: [
      {
        h2: 'How to convert hex to an image',
        html: `<ol>
  <li>Paste your hex data into the box. All common notations work: <code>0xFF, 0x81</code>, <code>FF 81 7E</code>, <code>\\xff\\x81</code>, continuous strings like <code>FF817E</code>, and complete C/C++ headers with comments.</li>
  <li>The tool counts the bytes and guesses the resolution. A 1024-byte buffer becomes 128 × 64, 504 bytes becomes 84 × 48, and so on. <code>#define ..._width</code> / <code>_height</code> lines are read automatically.</li>
  <li>If the picture looks scrambled, switch the <strong>byte format</strong>. Horizontal (Adafruit), XBM (LSB-first) and vertical page (SSD1306) layouts produce very different images from the same bytes.</li>
  <li>Click <strong>Download PNG</strong> to save a 1:1 pixel-perfect image, or <strong>Open in full editor</strong> to edit pixels and export new C code.</li>
</ol>`,
      },
      {
        h2: 'Why does my decoded image look wrong?',
        html: `<p>Hex bytes carry no width, height or bit order, so the same data can be read many ways. The three usual symptoms:</p>
<ul>
  <li><strong>Diagonal stripes or a skewed image</strong> – the width is wrong. Try the auto-detect button or common widths such as 128, 84, 64 or 32.</li>
  <li><strong>Image is chopped into 8-pixel vertical blocks</strong> – the data uses horizontal rows but you selected vertical pages, or the other way round.</li>
  <li><strong>Each group of 8 pixels is mirrored</strong> – the bit order is reversed. Switch between Adafruit (MSB-first) and XBM (LSB-first).</li>
</ul>
${FORMAT_TABLE}`,
      },
      { h2: 'Common display sizes and byte counts', html: SIZE_TABLE },
    ],
    faq: [
      { q: 'Is this hex to image converter free?', a: 'Yes. It is free, open source (MIT) and runs entirely in your browser. Your data is never uploaded to a server.' },
      { q: 'Can I convert hex to PNG or JPG?', a: 'You can download the decoded bitmap as a lossless PNG at its exact pixel size. PNG is the right format for 1-bit bitmaps because JPG compression would blur the pixels.' },
      { q: 'Which hex formats are supported?', a: '0x-prefixed lists, space or comma separated byte pairs, \\x escapes, continuous hex strings, Intel-style address prefixes, and complete C arrays with PROGMEM, comments and #define dimensions.' },
      { q: 'Can I decode color images?', a: 'Yes. Choose RGB565 (big- or little-endian) for 16-bit TFT data or Grayscale for one byte per pixel.' },
    ],
  },
  {
    slug: 'c-array-to-image',
    lang: 'en',
    tool: 'hex',
    title: 'C Array to Image — View PROGMEM Bitmap Arrays from Arduino Code',
    description: 'Paste a C/C++ bitmap array (const unsigned char PROGMEM) from an Arduino, ESP32 or STM32 project and see the image instantly. Reverse engineer OLED logos and icons, then export PNG or edit the pixels.',
    h1: 'C Array to Image Viewer',
    navLabel: 'C Array to Image',
    lead: 'Found a <code>static const unsigned char PROGMEM logo[]</code> in someone\'s firmware and want to see what it draws? Paste the whole array here.',
    sections: [
      {
        h2: 'Reverse engineering bitmaps in firmware source',
        html: `<p>Arduino and embedded projects store splash screens, icons and fonts as C arrays in header files. Reading <code>0x3c, 0x42, 0x81...</code> by eye is impossible, so this viewer renders them for you. It understands:</p>
<ul>
  <li><code>uint8_t</code>, <code>unsigned char</code>, <code>char</code> and <code>byte</code> arrays, with or without <code>PROGMEM</code> / <code>U8X8_PROGMEM</code></li>
  <li>Array size declarations like <code>logo[1024]</code> (the 1024 is not mistaken for data)</li>
  <li><code>// line</code> and <code>/* block */</code> comments, and <code>#define LOGO_WIDTH 128</code> dimension macros</li>
  <li>Multiple formats: Adafruit_GFX, XBM, U8g2 vertical pages, RGB565 and 8-bit grayscale</li>
</ul>`,
      },
      {
        h2: 'Example input',
        html: `<pre>#define logo_width 16
#define logo_height 16
static const unsigned char logo_bits[] PROGMEM = {
  0xe0, 0x07, 0x18, 0x18, 0x04, 0x20, 0x02, 0x40,
  0x32, 0x4c, 0x31, 0x8c, 0x01, 0x80, 0x01, 0x80,
  0x01, 0x80, 0x09, 0x90, 0x12, 0x48, 0xe2, 0x47,
  0x04, 0x20, 0x18, 0x18, 0xe0, 0x07, 0x00, 0x00 };</pre>
<p>This is a 16 × 16 XBM smiley. Paste it into the tool above, pick <strong>XBM</strong> and it appears immediately.</p>`,
      },
      { h2: 'Byte layouts explained', html: FORMAT_TABLE },
    ],
    faq: [
      { q: 'How do I find the width and height of a C bitmap array?', a: 'Look for #define …_WIDTH / …_HEIGHT macros or the drawBitmap() call that uses the array. If there are none, divide the byte count: for 1-bit horizontal data, bytes = ceil(width/8) × height. The auto-detect button tries common display sizes for you.' },
      { q: 'Can I edit the image and get a new C array back?', a: 'Yes. Click "Open in full editor" to load the array into LCD Mockup Studio, draw or erase pixels, and the C code updates live in the same format.' },
      { q: 'Does it work with STM32, ESP-IDF or plain C projects?', a: 'Yes. The parser only looks for the byte values, so the platform does not matter.' },
    ],
  },
  {
    slug: 'byte-array-to-image',
    lang: 'en',
    tool: 'hex',
    title: 'Byte Array to Image Online — Convert Hex Byte Arrays to a Bitmap',
    description: 'Convert a byte array (0x00 … 0xFF) to an image online. Paste hex bytes from code, a serial monitor or a memory dump and preview them as a 1-bit, grayscale or RGB565 bitmap. Free, client-side.',
    h1: 'Byte Array to Image',
    navLabel: 'Byte Array to Image',
    lead: 'Paste a byte array from your code, a serial log or a memory dump. The tool turns it into pixels so you can see what the buffer holds.',
    sections: [
      {
        h2: 'Where byte arrays come from',
        html: `<ul>
  <li><strong>Display frame buffers</strong> dumped over UART with <code>Serial.print(buf[i], HEX)</code></li>
  <li><strong>Firmware binaries</strong> viewed in a hex editor, where bitmaps sit between code</li>
  <li><strong>Python / JavaScript</strong> <code>bytearray</code> or <code>Uint8Array</code> literals</li>
  <li><strong>I²C / SPI captures</strong> from a logic analyzer sending pixel data to a display controller</li>
</ul>
<p>Whitespace-separated pairs (<code>00 FF 18</code>) and continuous strings (<code>00FF18</code>) are both accepted, so you can paste straight from a hex editor.</p>`,
      },
      {
        h2: 'Bytes per pixel',
        html: `<p>1-bit formats pack 8 pixels into each byte, grayscale uses 1 byte per pixel and RGB565 uses 2 bytes per pixel. If you know the resolution, the byte count tells you the format: a 128 × 64 screen needs 1024 bytes in 1-bit, 8192 in grayscale and 16384 in RGB565.</p>
${SIZE_TABLE}`,
      },
    ],
    faq: [
      { q: 'Can I convert a Python bytearray to an image?', a: 'Yes. Paste bytearray([0x00, 0xff, …]) or b"\\x00\\xff…" and the bytes are extracted automatically.' },
      { q: 'What if my byte array is decimal, not hex?', a: 'The tool expects hex. Convert decimals first (255 → 0xFF) or paste the hex output of your serial monitor.' },
    ],
  },
  {
    slug: 'image-to-c-array',
    lang: 'en',
    tool: 'image',
    alternate: { tr: 'resmi-c-dizisine-cevirme' },
    title: 'Image to C Array Converter for Arduino, ESP32 & OLED (Free, Online)',
    description: 'Convert PNG, JPG or BMP images to a C array (const uint8_t PROGMEM) for Arduino, ESP32 and STM32 displays. Dithering, threshold, invert, and Adafruit GFX, U8g2, XBM or MicroPython output.',
    h1: 'Image to C Array Converter',
    navLabel: 'Image to C Array',
    lead: 'Drop an image, choose your display size and copy a ready-to-compile C array. Dithering keeps photos and gradients readable on 1-bit OLED and LCD screens.',
    sections: [
      {
        h2: 'How to convert an image to a C array',
        html: `<ol>
  <li>Upload, drag-and-drop or paste (Ctrl+V) a PNG, JPG, GIF, BMP or WebP image.</li>
  <li>Set the target <strong>width and height</strong> – for a 0.96" SSD1306 that is 128 × 64.</li>
  <li>Pick a <strong>dithering</strong> method. Use <em>Threshold</em> for logos and text, <em>Atkinson</em> or <em>Floyd–Steinberg</em> for photos.</li>
  <li>Choose the output that matches your library (Adafruit GFX, U8g2 XBM, vertical pages or MicroPython) and copy or download the <code>.h</code> file.</li>
</ol>`,
      },
      {
        h2: 'Using the array with Adafruit_GFX',
        html: `<pre>${ADAFRUIT_SNIPPET}</pre>`,
      },
      {
        h2: 'Using the array with U8g2',
        html: `<p>Select the <strong>XBM</strong> output, because <code>drawXBMP()</code> expects LSB-first horizontal bytes:</p><pre>${U8G2_SNIPPET}</pre>`,
      },
      {
        h2: 'Choosing a dithering algorithm',
        html: `<table>
  <thead><tr><th>Method</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td>Threshold</td><td>Logos, icons, text, line art – crisp edges, no noise</td></tr>
    <tr><td>Atkinson</td><td>Portraits and photos on small OLEDs – high contrast, classic Mac look</td></tr>
    <tr><td>Floyd–Steinberg</td><td>Smooth gradients and detailed photos</td></tr>
    <tr><td>Bayer 4×4 / 8×8</td><td>Retro ordered pattern, stable when animating frames</td></tr>
  </tbody>
</table>`,
      },
    ],
    faq: [
      { q: 'How big will my C array be?', a: 'For 1-bit output it is ceil(width / 8) × height bytes, e.g. 1024 bytes for 128 × 64. That fits easily in the flash of an Arduino Uno (32 KB) when stored with PROGMEM.' },
      { q: 'Why is my image inverted on the display?', a: 'Some libraries draw the 1-bits in the background color. Tick "Invert" or swap the color argument in drawBitmap().' },
      { q: 'Does the image get uploaded anywhere?', a: 'No. Conversion runs locally in your browser with the Canvas API.' },
      { q: 'Can I convert many frames for an animation?', a: 'Convert each frame here, or use the full LCD Mockup Studio editor for multi-layer screens and animated GIF export.' },
    ],
  },
  {
    slug: 'image-to-byte-array',
    lang: 'en',
    tool: 'image',
    title: 'Image to Byte Array / Hex Converter — PNG & JPG to 0x Bytes',
    description: 'Convert an image to a byte array of hex values (0x00–0xFF) online. Monochrome 1-bit output with dithering for displays, e-paper, LED matrices and thermal printers. Copy as C, Arduino or MicroPython.',
    h1: 'Image to Byte Array Converter',
    navLabel: 'Image to Byte Array',
    lead: 'Turn any picture into a compact array of hex bytes. Each byte stores 8 pixels, ready for microcontrollers, e-paper, LED matrices and thermal printers.',
    sections: [
      {
        h2: 'What the output looks like',
        html: `<pre>// 16 × 8 px, 16 bytes, horizontal MSB-first
static const uint8_t PROGMEM bitmap[] = {
  0x3c, 0x3c, 0x42, 0x42, 0x81, 0x81, 0xa5, 0xa5,
  0x81, 0x81, 0x99, 0x99, 0x42, 0x42, 0x3c, 0x3c
};</pre>
<p>Each <code>1</code> bit is a lit pixel and each <code>0</code> bit is dark. Choose a different output format above if your driver expects vertical bytes or LSB-first order.</p>`,
      },
      {
        h2: 'Typical uses',
        html: `<ul>
  <li>Splash screens and icons for SSD1306, SH1106 and ST7920 displays</li>
  <li>Images for Waveshare / GxEPD2 e-paper panels</li>
  <li>Sprites for MAX7219 LED matrices and HUB75 panels</li>
  <li>Logos for ESC/POS thermal receipt printers</li>
</ul>`,
      },
      { h2: 'Byte formats', html: FORMAT_TABLE },
    ],
    faq: [
      { q: 'Can I get the bytes without the C wrapper?', a: 'Copy just the lines between the braces, or open the full studio, which also exports raw hex, Base64 and JSON.' },
      { q: 'What image formats can I upload?', a: 'Anything your browser can display: PNG, JPG, GIF, BMP, WebP and SVG.' },
    ],
  },
  {
    slug: 'ssd1306-bitmap-converter',
    lang: 'en',
    tool: 'image',
    title: 'SSD1306 OLED Bitmap Converter — 128x64 & 128x32 Image to Code',
    description: 'Convert images to SSD1306 OLED bitmaps for Arduino and ESP32. 128x64 and 128x32 presets, dithering, Adafruit_SSD1306 drawBitmap and U8g2 output, plus a hex viewer to decode existing SSD1306 arrays.',
    h1: 'SSD1306 OLED Bitmap Converter',
    navLabel: 'SSD1306 Bitmap',
    lead: 'Make a splash screen or icon for your 0.96" or 0.91" SSD1306 OLED. Upload an image, preview it at real pixel size and paste the code into your sketch.',
    width: 128,
    height: 64,
    sections: [
      {
        h2: 'SSD1306 memory layout',
        html: `<p>The SSD1306 controller stores its GDDRAM in 8 horizontal <em>pages</em>. Each byte is a vertical strip of 8 pixels with the least significant bit at the top. Libraries hide this:</p>
<ul>
  <li><strong>Adafruit_SSD1306</strong> takes horizontal MSB-first bitmaps in <code>drawBitmap()</code> and converts them itself – choose the <em>Adafruit GFX</em> output.</li>
  <li><strong>U8g2</strong> <code>drawXBMP()</code> takes XBM (horizontal LSB-first) – choose <em>XBM</em>.</li>
  <li>Writing straight to the controller over I²C (no library) needs the <em>vertical pages</em> layout.</li>
</ul>`,
      },
      { h2: 'Arduino example (Adafruit_SSD1306)', html: `<pre>${ADAFRUIT_SNIPPET}</pre>` },
      { h2: 'Arduino example (U8g2)', html: `<pre>${U8G2_SNIPPET}</pre>` },
      {
        h2: 'Decode an existing SSD1306 bitmap',
        html: '<p>Have an array already and want to see it? Use the <a href="../hex-to-image/">hex to image converter</a> with the 128 × 64 preset.</p>',
      },
    ],
    faq: [
      { q: 'What size should an SSD1306 bitmap be?', a: '128 × 64 pixels (1024 bytes) for the 0.96" module and 128 × 32 (512 bytes) for the 0.91" module. Smaller icons can be drawn anywhere on screen.' },
      { q: 'My SSD1306 image is shifted by 2 pixels.', a: 'Your module probably has an SH1106 controller (132-column RAM). Use an SH1106 driver or the U8g2 SH1106 constructor.' },
      { q: 'Does this work with ESP32 and ESP8266?', a: 'Yes. The generated header uses PROGMEM guards that compile on AVR, ESP8266, ESP32 and ARM.' },
    ],
  },
  {
    slug: 'u8g2-xbm-converter',
    lang: 'en',
    tool: 'image',
    format: 'xbm',
    title: 'U8g2 XBM Converter — Image to drawXBMP Bitmap for OLED & LCD',
    description: 'Convert images to XBM bitmaps for U8g2 drawXBM() and drawXBMP() on Arduino and ESP32. LSB-first output with U8X8_PROGMEM, dithering and live preview. Also decodes XBM back to an image.',
    h1: 'U8g2 XBM Bitmap Converter',
    navLabel: 'U8g2 XBM',
    lead: 'U8g2 draws images in XBM format. This converter outputs exactly that – LSB-first horizontal bytes – ready for <code>drawXBMP()</code>.',
    sections: [
      {
        h2: 'drawXBM vs drawXBMP',
        html: `<p><code>drawXBM()</code> reads the bitmap from RAM; <code>drawXBMP()</code> reads it from flash (PROGMEM). On AVR boards always use <code>drawXBMP()</code> with a <code>U8X8_PROGMEM</code> array to save RAM.</p><pre>${U8G2_SNIPPET}</pre>`,
      },
      {
        h2: 'XBM vs Adafruit format',
        html: '<p>Both are horizontal, but XBM puts the leftmost pixel in the <strong>lowest</strong> bit, while Adafruit_GFX uses the highest. Feeding an Adafruit array into <code>drawXBMP()</code> mirrors every 8-pixel group. If your image looks like that, regenerate it here with the XBM output.</p>',
      },
    ],
    faq: [
      { q: 'Can I open .xbm files from GIMP?', a: 'Yes. XBM files are plain C. Paste the content into the hex to image tool to view or edit them.' },
      { q: 'Which U8g2 constructor should I use?', a: 'Use the full-buffer (_F_) constructor for your controller, e.g. U8G2_SSD1306_128X64_NONAME_F_HW_I2C, so drawXBMP() and sendBuffer() work as shown.' },
    ],
  },
  {
    slug: 'adafruit-gfx-bitmap-converter',
    lang: 'en',
    tool: 'image',
    title: 'Adafruit GFX drawBitmap Converter — Image to Bitmap Array',
    description: 'Create bitmap arrays for Adafruit_GFX drawBitmap() on SSD1306, ST7735, ILI9341 and other Adafruit display libraries. Upload an image, dither, preview and copy the PROGMEM array.',
    h1: 'Adafruit GFX Bitmap Converter',
    navLabel: 'Adafruit GFX',
    lead: 'Generate the horizontal, MSB-first byte arrays that <code>display.drawBitmap()</code> expects, for any display that uses the Adafruit_GFX library.',
    sections: [
      {
        h2: 'drawBitmap() signature',
        html: `<pre>void drawBitmap(int16_t x, int16_t y,
                const uint8_t bitmap[], int16_t w, int16_t h,
                uint16_t color);
void drawBitmap(int16_t x, int16_t y,
                const uint8_t bitmap[], int16_t w, int16_t h,
                uint16_t color, uint16_t bg);</pre>
<p>The array must be <code>ceil(w / 8) × h</code> bytes long. Each row starts on a new byte, so a 10-pixel wide icon uses 2 bytes per row.</p>`,
      },
      { h2: 'Full example', html: `<pre>${ADAFRUIT_SNIPPET}</pre>` },
      {
        h2: 'Color TFT displays',
        html: '<p>On ST7735, ST7789 and ILI9341, <code>drawBitmap()</code> paints the 1-bits in any 16-bit color you choose, which is perfect for icons. For full-color images use <code>drawRGBBitmap()</code> with RGB565 data – the <a href="../rgb565-converter/">RGB565 viewer</a> decodes that format.</p>',
      },
    ],
    faq: [
      { q: 'What is the difference between drawBitmap and drawXBitmap?', a: 'drawBitmap() expects MSB-first bytes (this tool\'s Adafruit GFX output). drawXBitmap() expects XBM, LSB-first – choose the XBM output for it.' },
      { q: 'Do I need PROGMEM?', a: 'On AVR boards yes, otherwise the array is copied into scarce RAM. On ESP32 and ARM const arrays stay in flash anyway, and PROGMEM is harmless.' },
    ],
  },
  {
    slug: 'nokia-5110-bitmap-converter',
    lang: 'en',
    tool: 'image',
    width: 84,
    height: 48,
    title: 'Nokia 5110 Bitmap Converter — 84x48 PCD8544 Image to C Array',
    description: 'Convert images to 84x48 bitmaps for the Nokia 5110 / 3310 LCD (PCD8544) with Arduino. Dithering, preview at real size, Adafruit_PCD8544 drawBitmap and vertical byte output.',
    h1: 'Nokia 5110 (PCD8544) Bitmap Converter',
    navLabel: 'Nokia 5110',
    lead: 'The Nokia 5110 LCD is 84 × 48 pixels (504 bytes). Upload an image, tune the dithering and copy the array for your Arduino sketch.',
    sections: [
      {
        h2: 'PCD8544 memory layout',
        html: '<p>Like the SSD1306, the PCD8544 controller uses 6 vertical banks of 8 pixels. With the <strong>Adafruit_PCD8544</strong> library use the <em>Adafruit GFX</em> output and <code>display.drawBitmap(0, 0, bitmap, 84, 48, BLACK)</code>. When writing directly to the controller, pick the <em>vertical pages</em> output.</p>',
      },
      {
        h2: 'Tips for an 84 × 48 screen',
        html: '<ul><li>Crop the image to a 7:4 aspect ratio first.</li><li>Use Threshold for text and logos; at this resolution dithering noise is very visible.</li><li>The display is dark-on-light: tick Invert if your logo appears as a negative.</li></ul>',
      },
    ],
    faq: [
      { q: 'How many bytes is a Nokia 5110 bitmap?', a: '84 × 48 / 8 = 504 bytes for a full screen.' },
      { q: 'Does this work for the Nokia 3310 display?', a: 'Yes, the Nokia 3310 and 5110 use the same 84 × 48 PCD8544 controller.' },
    ],
  },
  {
    slug: 'rgb565-converter',
    lang: 'en',
    tool: 'hex',
    format: 'rgb565_be',
    width: 32,
    height: 32,
    title: 'RGB565 Hex to Image Viewer — Decode 16-bit TFT Color Arrays',
    description: 'Decode RGB565 hex arrays (uint16_t or byte pairs) into a color image online. Big- and little-endian, for ST7735, ST7789, ILI9341 and TFT_eSPI images. Preview and download PNG.',
    h1: 'RGB565 Hex to Image Viewer',
    navLabel: 'RGB565 Viewer',
    lead: 'Paste RGB565 color data from a TFT_eSPI, Adafruit or LVGL project and see the image. Switch endianness if the colors look wrong.',
    sections: [
      {
        h2: 'How RGB565 works',
        html: '<p>Each pixel is 16 bits: 5 bits red, 6 bits green, 5 bits blue. <code>0xF800</code> is red, <code>0x07E0</code> green, <code>0x001F</code> blue and <code>0xFFFF</code> white. A 240 × 320 ILI9341 frame is 153,600 bytes.</p>',
      },
      {
        h2: 'Big-endian vs little-endian',
        html: '<p>If reds look blue-green or the picture is noisy, the two bytes of each pixel are swapped. Toggle between <em>RGB565 BE</em> and <em>RGB565 LE</em>. TFT_eSPI <code>pushImage()</code> data is usually stored little-endian in memory; SPI transfers are big-endian.</p>',
      },
    ],
    faq: [
      { q: 'Can I paste uint16_t arrays like 0xF800?', a: 'Paste them as byte pairs (F8 00) or split 0xF800 into 0xF8, 0x00. A uint16_t parser is on the roadmap.' },
      { q: 'Can I convert an image to RGB565 here?', a: 'This page only decodes RGB565 data back into an image. For converting images, use the 1-bit image to C array converter.' },
    ],
  },
  {
    slug: 'image2cpp-alternative',
    lang: 'en',
    tool: 'image',
    title: 'image2cpp Alternative — Modern Image to C Array & Hex Editor',
    description: 'Looking for an image2cpp or LCD Assistant alternative? LCD Mockup Studio converts images to C arrays, decodes hex back to images, and adds a pixel editor, dithering and UI mockups. Free and open source.',
    h1: 'A Modern image2cpp & LCD Assistant Alternative',
    navLabel: 'image2cpp Alternative',
    lead: 'image2cpp and LCD Assistant are classics. LCD Mockup Studio does the same job, works in both directions (image → code and code → image) and lets you edit the result.',
    sections: [
      {
        h2: 'Feature comparison',
        html: `<table>
  <thead><tr><th>Feature</th><th>LCD Mockup Studio</th><th>image2cpp</th><th>LCD Assistant</th></tr></thead>
  <tbody>
    <tr><td>Runs in the browser, no install</td><td>✅</td><td>✅</td><td>❌ Windows only</td></tr>
    <tr><td>Image → C array</td><td>✅</td><td>✅</td><td>✅</td></tr>
    <tr><td>Hex / C array → image</td><td>✅</td><td>Partial</td><td>❌</td></tr>
    <tr><td>Pixel editor with live code sync</td><td>✅</td><td>❌</td><td>❌</td></tr>
    <tr><td>Atkinson, Floyd–Steinberg, Bayer dithering</td><td>✅</td><td>Floyd–Steinberg, Atkinson</td><td>❌</td></tr>
    <tr><td>U8g2 XBM, MicroPython, RGB565 decode</td><td>✅</td><td>Partial</td><td>❌</td></tr>
    <tr><td>Multi-element LCD UI mockups &amp; SVG export</td><td>✅</td><td>❌</td><td>❌</td></tr>
    <tr><td>Open source</td><td>✅ MIT</td><td>✅</td><td>❌</td></tr>
  </tbody>
</table>`,
      },
      {
        h2: 'Moving over from image2cpp',
        html: '<p>Settings map directly: "Horizontal – 1 bit per pixel" is the <em>Adafruit GFX</em> output, "Vertical – 1 bit per pixel" is <em>vertical pages</em>, and "Arduino code" is the default header with PROGMEM. Try it with the converter at the top of this page.</p>',
      },
    ],
    faq: [
      { q: 'Is LCD Mockup Studio free?', a: 'Yes, it is free and MIT-licensed. The source is on GitHub.' },
      { q: 'Will my existing image2cpp arrays work?', a: 'Yes. Paste them into the hex to image tool to view or edit them; the byte formats are identical.' },
    ],
  },
  {
    slug: 'micropython-framebuf-converter',
    lang: 'en',
    tool: 'image',
    format: 'micropython',
    title: 'MicroPython framebuf Image Converter — Image to bytearray (MONO_HLSB)',
    description: 'Convert images to MicroPython framebuf bytearrays for SSD1306 OLEDs on ESP32 and Raspberry Pi Pico. MONO_HLSB output with ready-to-run blit() example. Free online.',
    h1: 'MicroPython framebuf Image Converter',
    navLabel: 'MicroPython framebuf',
    lead: 'Get a <code>bytearray</code> and a <code>framebuf.FrameBuffer</code> you can <code>blit()</code> straight onto an SSD1306 from MicroPython on ESP32 or Raspberry Pi Pico.',
    sections: [
      {
        h2: 'Using the output',
        html: `<pre>from machine import Pin, I2C
import framebuf, ssd1306

i2c = I2C(0, scl=Pin(22), sda=Pin(21))   # Pico: I2C(0, scl=Pin(1), sda=Pin(0))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

bitmap = bytearray([0xff, 0x80, ...])    # from the converter
fb = framebuf.FrameBuffer(bitmap, 128, 64, framebuf.MONO_HLSB)
oled.blit(fb, 0, 0)
oled.show()</pre>`,
      },
      {
        h2: 'MONO_HLSB, MONO_HMSB and MONO_VLSB',
        html: '<p>The converter emits <code>MONO_HLSB</code> (horizontal, MSB = leftmost pixel), which matches the Adafruit layout. <code>MONO_VLSB</code> corresponds to the vertical pages layout used internally by the SSD1306.</p>',
      },
    ],
    faq: [
      { q: 'Does it work with CircuitPython?', a: 'CircuitPython uses displayio and bitmap files, but the raw bytes from this tool can be loaded into a displayio.Bitmap with a small loop.' },
    ],
  },
  {
    slug: 'hex-kodu-resme-cevirme',
    lang: 'tr',
    tool: 'hex',
    alternate: { en: 'hex-to-image' },
    title: 'Hex Kodunu Resme Çevirme — Online Hex / C Dizisi Görüntüleyici',
    description: 'Hex baytlarını veya C bitmap dizisini yapıştırın, resmi anında görün. Arduino, ESP32 ve SSD1306 OLED için Adafruit GFX, XBM, U8g2 ve RGB565 desteği. Ücretsiz, tarayıcıda çalışır, PNG indirin.',
    h1: 'Hex Kodunu Resme Çevirme',
    navLabel: 'Hex → Resim',
    lead: 'Ham hex baytlarını, <code>0x..</code> listesini veya tam bir C dizisini aşağıya yapıştırın. Bitmap tarayıcınızda anında çözülür; hiçbir veri sunucuya gönderilmez.',
    sections: [
      {
        h2: 'Hex kodu nasıl resme çevrilir?',
        html: `<ol>
  <li>Hex verinizi kutuya yapıştırın. <code>0xFF, 0x81</code>, <code>FF 81 7E</code>, <code>\\xff\\x81</code>, bitişik <code>FF817E</code> ve yorum satırlı C başlık dosyaları desteklenir.</li>
  <li>Araç bayt sayısına bakarak çözünürlüğü tahmin eder: 1024 bayt → 128 × 64, 504 bayt → 84 × 48. <code>#define ..._width</code> satırları otomatik okunur.</li>
  <li>Görüntü karışık çıkarsa <strong>bayt formatını</strong> değiştirin: yatay (Adafruit), XBM (LSB önce) ve dikey sayfa (SSD1306) aynı baytlardan farklı resimler üretir.</li>
  <li><strong>PNG indir</strong> ile birebir piksel resmi kaydedin ya da <strong>Tam editörde aç</strong> ile pikselleri düzenleyip yeni C kodu alın.</li>
</ol>`,
      },
      {
        h2: 'Resim neden bozuk görünüyor?',
        html: `<ul>
  <li><strong>Çapraz çizgiler / kaymış resim:</strong> genişlik yanlış. Otomatik algılayı deneyin veya 128, 84, 64, 32 gibi genişlikler girin.</li>
  <li><strong>8 piksellik dikey bloklar:</strong> veri yatay ama dikey sayfa seçili (veya tersi).</li>
  <li><strong>Her 8 piksel ayna gibi ters:</strong> bit sırası ters. Adafruit (MSB) ile XBM (LSB) arasında geçiş yapın.</li>
</ul>
${SIZE_TABLE}`,
      },
    ],
    faq: [
      { q: 'Bu araç ücretsiz mi?', a: 'Evet. Ücretsiz ve açık kaynaklıdır (MIT). Tamamen tarayıcınızda çalışır, verileriniz yüklenmez.' },
      { q: 'Hex kodunu PNG olarak indirebilir miyim?', a: 'Evet. Çözülen bitmap, gerçek piksel boyutunda kayıpsız PNG olarak indirilir.' },
      { q: 'Renkli (RGB565) verileri çözebilir mi?', a: 'Evet. TFT ekranlar için RGB565 (BE/LE) ve 8-bit gri tonlama seçenekleri vardır.' },
    ],
  },
  {
    slug: 'resmi-c-dizisine-cevirme',
    lang: 'tr',
    tool: 'image',
    alternate: { en: 'image-to-c-array' },
    title: 'Resmi C Dizisine / Hex Koda Çevirme — Arduino OLED Bitmap Oluşturucu',
    description: 'PNG veya JPG resmi Arduino, ESP32 ve SSD1306 OLED için C dizisine (hex bayt) çevirin. Dithering, eşik, ters çevirme ve Adafruit GFX, U8g2 XBM, MicroPython çıktısı. Ücretsiz, online.',
    h1: 'Resmi C Dizisine (Hex Koda) Çevirme',
    navLabel: 'Resim → C Dizisi',
    lead: 'Bir resim bırakın, ekran boyutunu seçin ve derlenmeye hazır C dizisini kopyalayın. Dithering sayesinde fotoğraflar 1-bit OLED ekranda bile okunur kalır.',
    sections: [
      {
        h2: 'Nasıl kullanılır?',
        html: `<ol>
  <li>PNG, JPG, GIF, BMP veya WebP resmi yükleyin, sürükleyin ya da Ctrl+V ile yapıştırın.</li>
  <li><strong>Genişlik ve yüksekliği</strong> ekranınıza göre ayarlayın (0.96" SSD1306 için 128 × 64).</li>
  <li>Logo ve yazı için <em>Threshold</em>, fotoğraf için <em>Atkinson</em> veya <em>Floyd–Steinberg</em> seçin.</li>
  <li>Kütüphanenize uygun çıktıyı seçin (Adafruit GFX, U8g2 XBM, MicroPython) ve <code>.h</code> dosyasını kopyalayın.</li>
</ol>`,
      },
      { h2: 'Arduino örneği (Adafruit_SSD1306)', html: `<pre>${ADAFRUIT_SNIPPET}</pre>` },
    ],
    faq: [
      { q: 'C dizisi kaç bayt olur?', a: '1-bit çıktı için tavan(genişlik / 8) × yükseklik bayttır; 128 × 64 için 1024 bayt.' },
      { q: 'Resim ekranda ters (negatif) görünüyor.', a: '"Invert" kutusunu işaretleyin veya drawBitmap() içindeki renk parametresini değiştirin.' },
    ],
  },
]
