/* ══════════════════════════════════════════════════════════
   SK HEALTH CLUB — CORE MOTION ENGINE
   One Lenis instance, one cursor, one reveal system, shared by
   every page. (v1 loaded this logic twice per inner page — once
   from script.js and once from pages.js — running two competing
   Lenis instances. This file is the single source of truth.)
   ══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. LENIS SMOOTH SCROLL ── */
  let lenis = null;
  if (!reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
  }

  function scrollToEl(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.3 });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (href.length < 2) return;
    a.addEventListener("click", (e) => {
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        scrollToEl(t);
      }
    });
  });

  /* ── 2. CUSTOM CURSOR (aura + dot + text morph) ── */
  const dot = document.getElementById("cursor-dot");
  const aura = document.getElementById("cursor-aura");
  const auraLabel = aura ? aura.querySelector(".aura-label") : null;

  if (dot && aura && matchMedia("(hover: hover)").matches) {
    document.body.classList.add("has-custom-cursor");
    let mx = -200, my = -200, ax = -200, ay = -200;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: "none" });
    });
    (function auraLoop() {
      ax += (mx - ax) * 0.16;
      ay += (my - ay) * 0.16;
      gsap.set(aura, { x: ax, y: ay });
      requestAnimationFrame(auraLoop);
    })();

    const bindCursorTargets = () => {
      document
        .querySelectorAll("a, button, .conv-pill, .trainer-card, .price-card, .dg-item, .sk-select-trigger, .sk-select-option, [data-cursor]")
        .forEach((el) => {
          if (el.dataset.cursorBound) return;
          el.dataset.cursorBound = "1";
          const label = el.getAttribute("data-cursor-text");
          el.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-on-link");
            if (label) {
              document.body.classList.add("cursor-on-text");
              if (auraLabel) auraLabel.textContent = label;
            }
          });
          el.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-on-link");
            document.body.classList.remove("cursor-on-text");
          });
        });
    };
    bindCursorTargets();
    document.addEventListener("sk:components-ready", bindCursorTargets);
    document.addEventListener("sk:content-updated", bindCursorTargets);
  } else if (dot && aura) {
    dot.style.display = "none";
    aura.style.display = "none";
  }

  /* ── 3. NAV SCROLL STATE ── */
  window.addEventListener(
    "scroll",
    () => {
      const shell = document.getElementById("nav-shell");
      if (shell) shell.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );

  /* ── 4. TEXT SPLIT → MASK REVEAL ──
     Wraps each line of a heading in an overflow-hidden mask so it
     can be revealed with a translateY wipe. Works on any element
     with data-reveal="mask".
  */
  function splitMaskLines(el) {
    if (el.dataset.skSplit) return;
    el.dataset.skSplit = "1";
    // Split on explicit <br> breaks, preserving inner markup (e.g. <span class="yellow-text">)
    const raw = el.innerHTML;
    const lines = raw.split(/<br[^>]*>/i);
    el.innerHTML = lines
      .map((line) => `<span class="rmask"><span class="rmask-inner">${line}</span></span>`)
      .join("");
    // Put the lines in their hidden resting position via GSAP itself, right
    // here, synchronously — before the browser ever paints this markup, so
    // there's no visible flash. This used to be done with a plain CSS rule
    // (`.rmask-inner { transform: translateY(110%) }`), which looked
    // equivalent but was the actual bug: the first time GSAP touched an
    // element that already had a CSS-authored `transform`, it preserved that
    // CSS value as a permanent baseline and animated its own yPercent value
    // *on top of* it instead of replacing it — so the tween below always ran,
    // but the text never visibly moved, because the frozen CSS baseline
    // exactly canceled it out. Setting the hidden state through GSAP (not
    // CSS) makes GSAP the sole owner of the transform from frame one.
    gsap.set(el.querySelectorAll(".rmask-inner"), { yPercent: 110 });
  }
  document.querySelectorAll('[data-reveal="mask"]').forEach(splitMaskLines);

  // Animates the split lines in. fromTo (rather than .to()) is kept here
  // defensively so this is correct even if revealMaskEl somehow runs before
  // splitMaskLines' gsap.set above.
  function revealMaskEl(el, delay = 0) {
    const inners = el.querySelectorAll(".rmask-inner");
    if (!inners.length) return;
    gsap.fromTo(
      inners,
      { yPercent: 110 },
      { yPercent: 0, duration: 1, stagger: 0.08, ease: "power4.out", delay },
    );
  }

  /* ── 5. UNIFIED REVEAL OBSERVER ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.getAttribute("data-reveal-delay")) || 0;
        if (el.getAttribute("data-reveal") === "mask") {
          revealMaskEl(el, delay);
        } else {
          setTimeout(() => el.classList.add("is-visible"), delay * 1000);
        }
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
  );

  function observeReveals(root = document) {
    root.querySelectorAll("[data-reveal]:not([data-reveal-observed])").forEach((el) => {
      // Elements marked data-reveal-manual are driven by a dedicated timeline
      // elsewhere (e.g. the page-hero entrance) — skip auto-observing them so
      // two systems never fight over the same transform.
      if (el.hasAttribute("data-reveal-manual")) return;
      el.setAttribute("data-reveal-observed", "1");
      if (el.getAttribute("data-reveal") === "mask") splitMaskLines(el);
      revealObserver.observe(el);
    });
    // legacy alias for any leftover .fade-up markup
    root.querySelectorAll(".fade-up:not([data-observed])").forEach((el) => {
      el.setAttribute("data-observed", "1");
      revealObserver.observe(el);
    });
  }
  observeReveals();

  window.SK_revealMaskEl = revealMaskEl;

  /* ── 6. MAGNETIC ELEMENTS ── data-magnetic="0.35" on the wrapper ── */
  document.querySelectorAll("[data-magnetic]").forEach((wrap) => {
    const strength = parseFloat(wrap.getAttribute("data-magnetic")) || 0.3;
    const target = wrap.querySelector("[data-magnetic-target]") || wrap.firstElementChild;
    if (!target) return;
    wrap.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(target, { x: x * strength, y: y * strength, duration: 0.5, ease: "power2.out" });
    });
    wrap.addEventListener("mouseleave", () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });

  /* ── 7. 3D TILT ── applies to .tilt cards (trainer + pricing) ── */
  mm.add("(hover: hover)", () => {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const cx = r.width / 2, cy = r.height / 2;
        gsap.to(card, {
          rotateX: ((y - cy) / cy) * -5,
          rotateY: ((x - cx) / cx) * 5,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power2.out",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      });
    });
  });

  window.SK = { lenis, mm, observeReveals, scrollToEl };
  document.addEventListener("sk:components-ready", () => observeReveals());
})();
