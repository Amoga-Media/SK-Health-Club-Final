/* ══════════════════════════════════════════════════════════
   SK HEALTH CLUB — PAGE INTERACTIONS
   Feature-specific bindings. Every block checks for its target
   element first, so this single file is safe to include on the
   homepage, inner pages, and detail pages alike.
   ══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", run);

  function run() {
    const mm = (window.SK && window.SK.mm) || gsap.matchMedia();

    /* ── HOME HERO ENTRANCE ── */
    const heroContent = document.getElementById("hero-content");
    if (heroContent) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const eyebrow = document.getElementById("hero-eyebrow");
      const lines = heroContent.querySelectorAll(".hero-headline .line-inner");
      const subline = heroContent.querySelector(".hero-subline");
      const actions = document.getElementById("hero-actions");
      const pills = document.getElementById("hero-pills");
      const badge = document.getElementById("hero-badge");

      if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 18, duration: 0.7 }, 0.25);
      if (lines.length) tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1, ease: "power4.out" }, 0.4);
      if (subline) tl.from(subline, { opacity: 0, y: 22, duration: 0.8 }, 0.85);
      if (actions) tl.from(actions, { opacity: 0, y: 18, duration: 0.7 }, 1.05);
      if (pills) tl.from(pills.querySelectorAll(".h-pill"), { opacity: 0, y: 14, stagger: 0.08, duration: 0.6 }, 1.2);
      if (badge) tl.from(badge, { opacity: 0, x: 24, duration: 0.7 }, 0.95);
    }
    const heroBg = document.getElementById("hero-bg-img");
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 16, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
    }

    /* ── INNER PAGE HERO ── */
    const phl = document.getElementById("phl"), pht = document.getElementById("pht"), phs = document.getElementById("phs");
    if (pht) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (phl) tl.from(phl, { opacity: 0, y: 16, duration: 0.6 }, 0.25);
      tl.fromTo(
        pht.querySelectorAll(".rmask-inner"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.08, ease: "power4.out" },
        0.4,
      );
      if (phs) tl.from(phs, { opacity: 0, y: 20, duration: 0.75 }, 0.85);
    }
    const phBg = document.getElementById("page-hero-bg");
    if (phBg) {
      gsap.to(phBg, {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: ".page-hero", start: "top top", end: "bottom top", scrub: true },
      });
    }

    /* ── FACILITIES STICKY SCROLL ── */
    mm.add("(min-width: 1025px)", () => {
      const outer = document.getElementById("fac-outer");
      const items = document.querySelectorAll(".fac-item");
      const panels = document.querySelectorAll(".fac-img-panel");
      if (!outer || !items.length) return;

      const setActive = (idx) => {
        items.forEach((el, i) => el.classList.toggle("active", i === idx));
        panels.forEach((el, i) => el.classList.toggle("active", i === idx));
      };
      items.forEach((el, idx) => el.addEventListener("click", () => setActive(idx)));

      ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
          setActive(idx);
        },
      });
    });

    /* ── HORIZONTAL PINNED GALLERY ── */
    const galSection = document.getElementById("gallery");
    const galTrack = document.querySelector(".horizontal-scroll-container");
    if (galSection && galTrack) {
      const getAmt = () => -(galTrack.scrollWidth - window.innerWidth);
      mm.add("all", () => {
        const tween = gsap.to(galTrack, { x: getAmt, ease: "none" });
        ScrollTrigger.create({
          trigger: galSection,
          start: "top top",
          end: () => `+=${-getAmt()}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      });
    }

    /* ── REVIEWS PARALLAX (desktop) ── */
    mm.add("(min-width: 1025px)", () => {
      const section = document.getElementById("reviews");
      if (!section) return;
      gsap.to(".col-up", { y: -160, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".col-down", { y: 160, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } });
    });
    mm.add("(max-width: 1024px)", () => {
      const grid = document.getElementById("mobile-review-grid");
      if (!grid) return;
      gsap.to(".col-up-mobile", { y: -50, ease: "none", scrollTrigger: { trigger: grid, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".col-down-mobile", { y: 50, ease: "none", scrollTrigger: { trigger: grid, start: "top bottom", end: "bottom top", scrub: 1 } });
    });

    /* ── PILL CURSOR (image preview on hover) ── */
    const pillCursor = document.getElementById("pill-cursor");
    if (pillCursor) {
      // Set the center offset once so GSAP remembers it
      gsap.set(pillCursor, { xPercent: -50, yPercent: -50 });
      
      document.querySelectorAll(".hover-pill").forEach((el) => {
        const img = el.getAttribute("data-img");
        if (!img) return;
        el.addEventListener("mouseenter", (e) => {
          pillCursor.style.backgroundImage = `url(${img})`;
          gsap.set(pillCursor, { x: e.clientX, y: e.clientY });
          gsap.to(pillCursor, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(pillCursor, { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
        });
        el.addEventListener("mousemove", (e) => {
          gsap.to(pillCursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power1.out" });
        });
      });
    }

    /* ── GALLERY LIGHTBOX ──
       Enabled on every breakpoint, including mobile/tablet: the grid
       thumbnails are smallest there, so tap-to-enlarge helps more on a
       phone than it does on desktop, not less. */
    const galleryItems = document.querySelectorAll(".dg-item");
    if (galleryItems.length) {
      let lightbox = document.querySelector(".sk-lightbox");
      if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.className = "sk-lightbox";
        lightbox.innerHTML = `
          <button type="button" class="sk-lightbox-close" aria-label="Close" data-cursor>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <img class="sk-lightbox-img" src="" alt="" />`;
        document.body.appendChild(lightbox);
      }
      const lbImg = lightbox.querySelector(".sk-lightbox-img");
      const closeBtn = lightbox.querySelector(".sk-lightbox-close");

      const openLightbox = (src, alt) => {
        lbImg.src = src;
        lbImg.alt = alt || "";
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      };
      const closeLightbox = () => {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
      };

      galleryItems.forEach((item) => {
        if (!item.querySelector(".dg-item-expand")) {
          const expand = document.createElement("span");
          expand.className = "dg-item-expand";
          expand.innerHTML =
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>';
          item.appendChild(expand);
        }
        const img = item.querySelector("img");
        item.addEventListener("click", () => img && openLightbox(img.src, img.alt));
      });

      closeBtn.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
      });
    }

    /* ── CTA BAND MAGNETIC BUTTON MARQUEE DRIFT ── */
    const ctaBandBg = document.querySelector(".cta-band-bg-text");
    if (ctaBandBg) {
      ScrollTrigger.create({
        trigger: ".cta-band",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate(self) { gsap.set(ctaBandBg, { xPercent: -10 + self.progress * 6 }); },
      });
    }

    /* ── PRICING TOGGLE ── */
    const pricingToggle = document.getElementById("pricing-toggle");
    if (pricingToggle) {
      const slider = document.getElementById("toggle-slider");
      const labelMonthly = document.getElementById("label-monthly");
      const labelYearly = document.getElementById("label-yearly");
      const amounts = document.querySelectorAll(".pricing-num");
      const periods = document.querySelectorAll(".pricing-period");
      let yearly = false;

      pricingToggle.addEventListener("click", () => {
        yearly = !yearly;
        gsap.to(slider, { x: yearly ? "100%" : "0%", duration: 0.5, ease: "power3.inOut" });
        gsap.to(labelMonthly, { color: yearly ? "#ffffff" : "#000000", duration: 0.3 });
        gsap.to(labelYearly, { color: yearly ? "#000000" : "#ffffff", duration: 0.3 });
        gsap.to([amounts, periods], {
          y: -14, opacity: 0, duration: 0.2, stagger: 0.02, ease: "power2.in",
          onComplete: () => {
            amounts.forEach((el) => (el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly));
            periods.forEach((el) => (el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly));
            gsap.fromTo([amounts, periods], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" });
          },
        });
      });
    }

    /* ── SQUAD CAROUSEL (Swiper) ── */
    const squadEl = document.querySelector(".squad-swiper");
    if (squadEl && window.Swiper) {
      new Swiper(squadEl, {
        slidesPerView: 1.35,
        spaceBetween: 16,
        breakpoints: {
          640: { slidesPerView: 2.3 },
          900: { slidesPerView: 3.3 },
          1200: { slidesPerView: 4 },
        },
      });
    }

    /* ── COUNT-UP STAT NUMBERS ── */
    const statEls = document.querySelectorAll(".stat-num");
    if (statEls.length) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const match = raw.match(/[\d.]+/);
            if (!match) return;
            const target = parseFloat(match[0]);
            const suffixEl = el.querySelector(".yellow-text");
            const suffix = suffixEl ? suffixEl.outerHTML : raw.replace(match[0], "");
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.innerHTML = Math.floor(counter.val) + suffix;
              },
            });
            countObserver.unobserve(el);
          });
        },
        { threshold: 0.5 },
      );
      statEls.forEach((el) => countObserver.observe(el));
    }

    /* ── CUSTOM DROPDOWNS (replaces native <select>) ── */
    document.querySelectorAll(".sk-select").forEach((wrap) => {
      if (wrap.dataset.skSelectBound) return;
      wrap.dataset.skSelectBound = "1";
      const trigger = wrap.querySelector(".sk-select-trigger");
      const valueEl = wrap.querySelector(".sk-select-value");
      const hiddenInput = wrap.querySelector("input[type=hidden]");
      const options = wrap.querySelectorAll(".sk-select-option");

      const close = () => wrap.classList.remove("open");
      const closeOthers = () =>
        document.querySelectorAll(".sk-select.open").forEach((w) => w !== wrap && w.classList.remove("open"));

      trigger.addEventListener("click", () => {
        closeOthers();
        wrap.classList.toggle("open");
      });

      options.forEach((opt) => {
        opt.addEventListener("click", () => {
          const val = opt.getAttribute("data-value");
          valueEl.textContent = val;
          trigger.classList.add("has-value");
          if (hiddenInput) hiddenInput.value = val;
          options.forEach((o) => o.classList.remove("active"));
          opt.classList.add("active");
          close();
        });
      });
    });
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".sk-select.open").forEach((wrap) => {
        if (!wrap.contains(e.target)) wrap.classList.remove("open");
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") document.querySelectorAll(".sk-select.open").forEach((w) => w.classList.remove("open"));
    });

    /* ── FAQ ACCORDION ── */
    document.querySelectorAll(".faq-question").forEach((q) => {
      q.addEventListener("click", () => {
        const item = q.closest(".faq-item");
        const answer = item.querySelector(".faq-answer");
        const isOpen = q.classList.contains("open");
        document.querySelectorAll(".faq-question.open").forEach((oq) => {
          oq.classList.remove("open");
          oq.closest(".faq-item").querySelector(".faq-answer").style.maxHeight = "0px";
        });
        if (!isOpen) {
          q.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });

    /* ── FORM SUBMIT (static demo handler) ── */
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const original = this.innerHTML;
        this.innerHTML = "✓ Sent — we'll be in touch soon";
        this.style.background = "#fff";
        setTimeout(() => {
          this.innerHTML = original;
          this.style.background = "";
        }, 4000);
      });
    }

    ScrollTrigger.sort();
  }
})();
