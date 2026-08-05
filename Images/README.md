# Website Assets — Everything

- **`images/`** — product photos sorted by device, plus the logo
  - `mobile/` (640px), `tablet/` (1200px), `desktop/` (1920px) — JPEG + WebP for every photo, renamed `photo-01-mobile.jpg` etc.
  - `logo/` — logo at 256/512/1024px
  - see `images/README.md` for the responsive `<picture>` snippet
- **`favicon/`** — everything for the browser tab, phone home screen, and social sharing
  - `favicon.ico`, `favicon-16x16.png` / `-32x32` / `-48x48` / `-96x96`
  - `apple-touch-icon.png`, `android-chrome-192x192.png` / `-512x512`, `site.webmanifest`
  - `og-image.jpg` — the social/link-share preview image
  - see `favicon/README.md` for the `<head>` snippet

Drop both folders into your site's public/static directory and wire up the two snippets.
