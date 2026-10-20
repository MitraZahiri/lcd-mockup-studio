# SEO Rehberi — Google'da üst sıralara çıkmak için yapılacaklar

Kod tarafı hazır: `tools/` altında 14 araç sayfası (12 İngilizce, 2 Türkçe), bir araç merkezi sayfası,
güncel `sitemap.xml`, her sayfada FAQ / Breadcrumb / WebApplication yapılandırılmış verisi ve hreflang.
Sayfaların içeriği `scripts/seo-pages.data.js` dosyasında; yeni sayfa eklemek için oraya bir giriş ekleyip
`npm run build` çalıştırman yeterli.

Aşağıdakileri **senin** yapman gerekiyor (hesap ve paylaşım gerektiriyor).

## 1. Google Search Console (ilk gün, 10 dakika)

1. https://search.google.com/search-console → **Mülk ekle** → **URL ön eki** →
   `https://mitrazahiri.github.io/lcd-mockup-studio/`
2. Doğrulama yöntemi olarak **HTML etiketi**'ni seç. Verilen `<meta name="google-site-verification" ...>`
   satırını `index.html` içindeki `<head>` bölümüne ekle, commit + push et, sonra **Doğrula**'ya bas.
3. Sol menü → **Site haritaları** → `sitemap.xml` yaz → **Gönder**.
4. **URL denetimi** ile şu sayfaları tek tek yazıp **Dizine eklenmesini iste**:
   - `.../tools/hex-to-image/`
   - `.../tools/image-to-c-array/`
   - `.../tools/ssd1306-bitmap-converter/`
   - `.../tools/c-array-to-image/`
   - `.../tools/hex-kodu-resme-cevirme/`
5. Aynısını **Bing Webmaster Tools**'ta da yap (https://www.bing.com/webmasters → "Import from Google
   Search Console" tek tıkla aktarır). Bing aynı zamanda DuckDuckGo ve ChatGPT aramasını besler.

"200.000 gösterim" rakamını **Search Console → Performans → Toplam gösterim** ekranında takip edeceksin.

## 2. Backlink ve tanıtım (ilk 4 hafta)

Her paylaşımda ana sayfaya değil, **konuya uyan araç sayfasına** link ver.

| Hafta | Nerede | Ne paylaşılacak |
|---|---|---|
| 1 | r/arduino, r/esp32 | "I built a free hex → image / image → C array tool" + GIF, link: `/tools/hex-to-image/` |
| 1 | Hacker News "Show HN" | Ana sayfa + kısa teknik hikâye |
| 2 | r/embedded, r/electronics | Firmware'deki bitmap'leri tersine çevirme konusu, link: `/tools/c-array-to-image/` |
| 2 | Arduino Forum → "Showcase" | SSD1306 rehberi, link: `/tools/ssd1306-bitmap-converter/` |
| 3 | Stack Overflow | "convert image to c array", "ssd1306 bitmap", "u8g2 xbm" sorularına gerçekten çözüm sunan cevaplar |
| 3 | GitHub awesome listeleri | awesome-arduino, awesome-embedded, awesome-esp32'ye PR |
| 4 | Hackaday Tips | tips@hackaday.com'a kısa e-posta + GIF |
| 4 | YouTube | 2 dakikalık "Image to OLED in 60 seconds" videosu, açıklamaya araç linkleri |
| Sürekli | Türk toplulukları | Arduino Türkiye Facebook grupları, Teknopat forum, Donanım Haber → `/tools/hex-kodu-resme-cevirme/` |

Hazır metinler için `docs/PROMOTION_KIT.md` dosyasına bak.

## 3. Ölçüm ve iyileştirme (her ay)

1. Search Console → Performans → **Sorgular** sekmesinde gösterimi yüksek ama tıklaması düşük
   aramaları bul.
2. O aramaya en yakın sayfanın `title` ve `description` metnini, arama ifadesini içerecek şekilde
   `scripts/seo-pages.data.js` içinde güncelle.
3. Sitede sayfası olmayan ama gösterim alan bir arama varsa onun için yeni bir sayfa ekle.

## Gerçekçi beklenti

- 2–4 hafta: sayfalar dizine girer, ilk gösterimler başlar.
- 2–3 ay: uzun kuyruk aramalarda (ör. "u8g2 xbm converter") ilk sayfaya çıkış.
- 6–12 ay: düzenli backlink ile yıllık 200.000 gösterim hedefi.

## İsteğe bağlı: kendi alan adı

`lcdmockup.com` gibi bir alan adı alıp GitHub Pages'e bağlarsan (Settings → Pages → Custom domain)
`SITE_URL` değerini `scripts/seo-pages.data.js`, `index.html` ve `public/robots.txt` içinde güncellemen
gerekir. Eski adres otomatik olarak yeni adrese yönlenir.
