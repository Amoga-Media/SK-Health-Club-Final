# Favicon & Site Icons

Generated from your logo (`sk Png-01.png`), padded onto a square canvas so it works at tiny sizes.

## Files

| File | Size | Used for |
|---|---|---|
| `favicon.ico` | 16/32/48 (multi-size) | Classic favicon — browser tabs, bookmarks, some search engines |
| `favicon-16x16.png` | 16×16 | Browser tab (small) |
| `favicon-32x32.png` | 32×32 | Browser tab (retina) |
| `favicon-48x48.png` | 48×48 | **Google Search results** — Google requires a square icon that's a multiple of 48px |
| `favicon-96x96.png` | 96×96 | Higher-res fallback, some Android launchers |
| `apple-touch-icon.png` | 180×180 | iOS "Add to Home Screen" (white background — iOS doesn't handle transparent PNGs well) |
| `android-chrome-192x192.png` | 192×192 | Android home screen / PWA |
| `android-chrome-512x512.png` | 512×512 | Android splash screen / PWA |
| `site.webmanifest` | — | Tells Android/Chrome about the icons above (PWA metadata) |
| `og-image.jpg` | 1200×630 | Preview image when your link is shared on social media, Slack, iMessage, etc. |

## What actually shows up in Google

Google pulls the favicon from your site's `<link rel="icon">` tag — it needs to be **square** and **at least 48×48px**. `favicon-48x48.png` (or `favicon.ico`) covers that. There's no separate "Google icon" to upload; it just crawls whatever your site declares.

## How to wire it up

1. Drop all these files into your site's root/public folder (e.g. `public/`).
2. Fill in the `name`/`short_name` fields in `site.webmanifest`.
3. Add this to your `<head>` (Next.js: put it in `app/layout.tsx` metadata, or directly in `pages/_document.tsx` / `index.html`):

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#ffffff" />

<!-- Social share preview -->
<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.jpg" />
```

## Note on the og-image

Built with one of your product photos as the background, a dark gradient at the bottom for contrast, and the logo mark placed in the corner. If you'd rather use a different product photo, or add a tagline/site name on top, let me know and I'll swap it.
