# 🚀 LCD Mockup Studio — Private Analytics & Growth Promotion Kit

This kit is designed exclusively for **Mitra Zahiri** (Project Owner) to:
1. **Privately track visitors & usage** (Only you have access to the dashboard).
2. **Promote the project** across embedded systems, Arduino, ESP32, and maker communities so developers actively adopt and use it.

---

## 🔒 1. Private Visitor Analytics Setup (Owner-Only)

Your analytics setup is built as a privacy-first hybrid supporting **Google Analytics 4** and/or **GoatCounter**. 
Visitors cannot view any metrics or dashboards. Only you can log in to view traffic.

### Option A: Google Analytics 4 (Recommended)
1. Go to [analytics.google.com](https://analytics.google.com) and sign in with your Google account.
2. Click **Admin** (gear icon at bottom left) ➔ **Create Property** ➔ Enter `LCD Mockup Studio`.
3. Choose **Web** as the platform ➔ Enter URL: `https://mitrazahiri.github.io/lcd-mockup-studio/`.
4. Copy your **Measurement ID** (it starts with `G-`, e.g. `G-ABC123XYZ`).
5. Open `index.html` and paste your ID into `gaMeasurementId`:
   ```html
   <script>
     window.LCD_ANALYTICS_CONFIG = {
       gaMeasurementId: 'G-XXXXXXXXXX', // 👈 Paste your ID here
       goatCounterCode: '',
       debug: false
     };
   </script>
   ```
6. **Where to see your users:**
   - Log into [analytics.google.com](https://analytics.google.com).
   - **Realtime:** See users live right now on a world map.
   - **Acquisition:** See which websites, Reddit posts, or GitHub links sent you visitors.
   - **Events:** See how many times users triggered:
     - `hex_decoder_open` — Opened the hex bytecode decoder.
     - `hex_decode_execute` — Decoded C hex arrays back to images.
     - `hex_insert_layer` — Edited pixels and added as canvas layers.
     - `export_code_copy` & `export_code_download` — Exported C code for Arduino/ESP32.
     - `dither_apply` — Applied 1-bit Floyd-Steinberg or Atkinson dithering.
     - `coffee_click` — Clicked your Buy Me a Coffee button.

---

### Option B: GoatCounter (Lightweight, No Cookies, 100% Free)
1. Go to [goatcounter.com/signup](https://www.goatcounter.com/signup).
2. Enter your site code (e.g. `mitrazahiri`).
3. In **Settings ➔ Dashboard**, check **"Private: Only logged in users can view the dashboard"**.
4. Open `index.html` and paste your code:
   ```html
   <script>
     window.LCD_ANALYTICS_CONFIG = {
       gaMeasurementId: '',
       goatCounterCode: 'mitrazahiri', // 👈 Your GoatCounter username
       debug: false
     };
   </script>
   ```
5. **Where to see your users:**
   - Visit `https://mitrazahiri.goatcounter.com` and log in with your password.

---

## 📢 2. Community Promotion Playbook

Here are pre-written, tested marketing posts tailored for maker and firmware developer communities. Copy and paste these directly.

---

### 🔴 Post 1: Reddit `r/arduino` and `r/esp32`
**Target Subreddits:** [r/arduino](https://reddit.com/r/arduino), [r/esp32](https://reddit.com/r/esp32), [r/diyelectronics](https://reddit.com/r/diyelectronics), [r/microcontrollers](https://reddit.com/r/microcontrollers)  
**Title:**  
> I built a free web tool to design OLED/LCD screens, convert logos to 1-bit C arrays, and reverse-engineer hex bitmaps (with a live pixel editor)

**Body:**  
```markdown
Hey everyone! 👋

Whenever I work on SSD1306 OLEDs or Nokia 5110 displays on Arduino and ESP32, two things always annoyed me:
1. Converting logos and photos into 1-bit bitmaps with old tools like image2cpp or desktop GIMP scripts felt slow and clunky.
2. If I found an existing C array with hex bytes (`0x00, 0x3C, 0x42...`) in an open-source repo, there was no easy way to see what the image looked like without flashing it to a real board.

So I built **LCD Mockup Studio** — a 100% free, zero-install, browser-based studio for embedded display graphics.

🔗 **Live Tool:** https://mitrazahiri.github.io/lcd-mockup-studio/
⭐ **GitHub (Open Source):** https://github.com/MitraZahiri/lcd-mockup-studio

### What you can do with it:
- 🎨 **Image to C Code Converter:** Upload any photo or logo, tweak brightness/contrast, and apply high-contrast 1-bit dithering (Floyd-Steinberg, Atkinson, Bayer, or Telegraphic scanlines).
- 🔄 **Hex to Image Decoder:** Paste raw C hex arrays, XBM bitmaps, or hexdumps, and it immediately renders the image at your display resolution (128x64, 128x32, 96x64, etc.).
- ✏️ **Interactive Pixel Editor (KasperCalc style):** Click or draw on individual pixels, and the C code updates in real-time. Or edit the hex code and watch the screen update live!
- 💾 **1-Click Export:** Produces clean, production-ready code for **Adafruit_GFX**, **U8g2** (page mode vertical bytes), **XBM**, and **MicroPython framebuf**.
- 📐 **Vector Display Mockups:** Build complete menus, gauges, battery indicators, and status icons with font OCR.
- 🔗 **Lossless Permalinks:** Share your exact screen layout with 1-click URL sharing.

Runs entirely client-side in your browser — zero tracking of your graphics, no account needed.

Would love to hear your feedback and feature requests for your microcontroller projects!
```

---

### 🟠 Post 2: Hacker News (Show HN)
**Target:** [news.ycombinator.com](https://news.ycombinator.com/submit)  
**Title:**  
> Show HN: LCD Mockup Studio – In-browser LCD/OLED designer & C bitmap hex editor

**Body:**  
```markdown
Hi HN! I built LCD Mockup Studio, an open-source web application for firmware engineers, retro computing enthusiasts, and embedded makers.

URL: https://mitrazahiri.github.io/lcd-mockup-studio/
GitHub: https://github.com/MitraZahiri/lcd-mockup-studio

The problem:
Converting graphics for monochrome screens (SSD1306, SH1106, PCD8544, ST7565) usually involves running old abandoned desktop tools or manual GIMP workflows. Conversely, reverse-engineering or tweaking byte arrays (`const unsigned char bitmap[] PROGMEM = { ... }`) embedded in firmware requires flashing a physical microcontroller.

What it does:
1. Hex-to-Image Decoding: Accepts C byte arrays, XBM, and hexdumps, reverses bit orientations (MSB horizontal for Adafruit GFX, vertical page-mode for U8g2, LSB for XBM), and visualizes the bitmap.
2. Two-Way Pixel Editing: You can draw, erase, flood fill, rotate, and flip pixels on canvas, and the C byte array synchronizes in real time.
3. 1-Bit Dithering: High-fidelity image conversion with Floyd-Steinberg, Atkinson, and Bayer matrices.
4. Computer Vision Vectorization: Extracts frames, geometry, and OCR text directly from photos of real hardware screens.
5. Export: Produces ready-to-compile headers for Arduino, ESP-IDF, and MicroPython.

Everything runs 100% locally in WebAssembly / HTML5 Canvas without server uploads.

Looking forward to your comments and feedback!
```

---

### 🔵 Post 3: Arduino Official Forum & EEVblog
**Target:** 
- [Arduino Forum ➔ Exhibition / Gallery](https://forum.arduino.cc/c/project-hub/exhibition-gallery/13)
- [EEVblog ➔ Microcontrollers & FPGA](https://www.eevblog.com/forum/microcontrollers/)

**Title:**  
> [Web Tool] LCD Mockup Studio — Free in-browser OLED/LCD UI designer and C bitmap editor

**Content:**  
```markdown
Hello everyone,

I'd like to share an open-source browser application I developed for embedded developers working with small displays:

**LCD Mockup Studio:** https://mitrazahiri.github.io/lcd-mockup-studio/
**Source Code:** https://github.com/MitraZahiri/lcd-mockup-studio

Features:
- Live two-way synchronization between C hex byte arrays and pixel preview.
- Support for Adafruit_GFX (horizontal MSB), U8g2 (vertical page mode LSB), and XBM formats.
- Dithering algorithms (Atkinson, Floyd-Steinberg, Bayer) with instant preview.
- Built-in hardware presets for popular displays (0.96" SSD1306, 1.3" SH1106, Nokia 5110, 2.42" OLED).
- Export to C headers (`.h`), complete Arduino sketches (`.ino`), MicroPython scripts (`.py`), or lossless URL permalinks.
- 100% client-side, zero installations required.

Feedback, bug reports, and suggestions are very welcome!
```

---

### 🐦 Post 4: Twitter / X & LinkedIn
**Platform:** Twitter/X, Threads, LinkedIn  
*(Attach the animated GIF demo from `docs/assets/hex_demo.gif` to this post)*  

```text
🚀 Just shipped LCD Mockup Studio — a free browser tool for Arduino, ESP32, & embedded devs!

✨ Convert images to 1-bit monochrome bitmaps (Atkinson/Floyd-Steinberg)
🔍 Reverse-engineer C hex arrays back to images
✏️ Live 2-way pixel editor (KasperCalc-style)
📦 1-click export for Adafruit_GFX & U8g2

Try it live: https://mitrazahiri.github.io/lcd-mockup-studio/
GitHub: https://github.com/MitraZahiri/lcd-mockup-studio

#embedded #arduino #esp32 #iot #microcontrollers #electronics #opensource #u8g2
```

---

### 💡 Post 5: Submit to Hackaday Tip Line
**Target:** [hackaday.com/submit-a-tip/](https://hackaday.com/submit-a-tip/)  
**Email / Message:**  
```text
Subject: LCD Mockup Studio: In-browser 1-bit OLED designer and C hex bitmap editor

Hi Hackaday crew,

I built LCD Mockup Studio, an open-source browser-based CAD and bitmap tool for microcontrollers and monochrome screens (SSD1306, Nokia 5110, etc.):
https://mitrazahiri.github.io/lcd-mockup-studio/
https://github.com/MitraZahiri/lcd-mockup-studio

Beyond standard 1-bit dithering (Floyd-Steinberg, Atkinson), it features a two-way hex bytecode decoder: you can paste any mysterious C array from an old GitHub repository, and it decodes the image and lets you paint pixels directly to update the hex array in real time. It also exports directly to Adafruit_GFX and U8g2 formats.

Thought the Hackaday community might find it useful for their hardware builds!
Cheers,
Mitra Zahiri
```

---

### 📚 Post 6: Add to GitHub "Awesome" Lists
Submit a pull request to popular curated lists on GitHub:
1. **[sindresorhus/awesome-embedded](https://github.com/sindresorhus/awesome-embedded)**
   - Entry: `* [LCD Mockup Studio](https://mitrazahiri.github.io/lcd-mockup-studio/) - Web-based LCD/OLED mockup designer, C bitmap generator, and hex bytecode editor.`
2. **[awesome-arduino](https://github.com/search?q=awesome-arduino)**
   - Entry: `* [LCD Mockup Studio](https://mitrazahiri.github.io/lcd-mockup-studio/) - In-browser SSD1306/U8g2 bitmap generator, pixel editor, and display mockup tool.`
3. **[awesome-esp32](https://github.com/search?q=awesome-esp32)**
   - Entry: `* [LCD Mockup Studio](https://mitrazahiri.github.io/lcd-mockup-studio/) - Display designer and bitmap converter for ESP32 displays.`

---

## 🏆 Checklist for Launch Day:
- [ ] Paste your Google Analytics Measurement ID or GoatCounter code into `index.html`.
- [ ] Push to `main` branch on GitHub.
- [ ] Post to Reddit (`r/arduino`, `r/esp32`).
- [ ] Post to Hacker News (`Show HN`).
- [ ] Share on Twitter / LinkedIn with `docs/assets/hex_demo.gif`.
- [ ] Watch your real-time analytics dashboard to see who is using LCD Mockup Studio!
