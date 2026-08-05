/**
 * Copies the pre-built browser files this static site needs straight
 * out of node_modules into /js/vendor, so index.html etc. can load
 * them with a plain local <script> tag instead of a CDN link.
 *
 * Runs automatically via the "postinstall" script — just `npm install`
 * and js/vendor is (re)populated from whatever versions are installed.
 */
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "js", "vendor");

const files = [
  ["gsap/dist/gsap.min.js", "gsap.min.js"],
  ["gsap/dist/ScrollTrigger.min.js", "ScrollTrigger.min.js"],
  ["lenis/dist/lenis.min.js", "lenis.min.js"],
  ["swiper/swiper-bundle.min.js", "swiper-bundle.min.js"],
  ["swiper/swiper-bundle.min.css", "swiper-bundle.min.css"],
];

mkdirSync(outDir, { recursive: true });

let ok = 0;
for (const [src, dest] of files) {
  const from = join(root, "node_modules", src);
  const to = join(outDir, dest);
  if (!existsSync(from)) {
    console.warn(`[copy-vendor] missing ${src} — did npm install run?`);
    continue;
  }
  copyFileSync(from, to);
  ok++;
}
console.log(`[copy-vendor] copied ${ok}/${files.length} vendor files into js/vendor/`);
