/* ══════════════════════════════════════════════════════════
   COMPONENT LOADER
   Fetches the shared nav + footer partials, marks the active
   link, and wires up the full-screen menu overlay.
   ══════════════════════════════════════════════════════════ */

function initMenu() {
  const btn = document.getElementById("menu-btn");
  const overlay = document.getElementById("menu-overlay");
  if (!btn || !overlay) return;

  const toggle = (open) => {
    const willOpen = open ?? !overlay.classList.contains("open");
    btn.classList.toggle("open", willOpen);
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    overlay.classList.toggle("open", willOpen);
    document.body.style.overflow = willOpen ? "hidden" : "";
  };

  btn.addEventListener("click", () => toggle());
  overlay.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggle(false)),
  );
}

function markActiveLinks() {
  const path = window.location.pathname;
  document.querySelectorAll(".nav-link, .menu-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && path.endsWith(href.replace(/^\//, ""))) {
      link.classList.add("active");
    }
  });
}

async function loadComponents() {
  try {
    const [navRes, footerRes] = await Promise.all([
      fetch("/components/nav.html"),
      fetch("/components/footer.html"),
    ]);
    const [navHTML, footerHTML] = await Promise.all([navRes.text(), footerRes.text()]);

    const navEl = document.getElementById("global-nav");
    const footerEl = document.getElementById("global-footer");
    if (navEl) navEl.innerHTML = navHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;

    markActiveLinks();
    initMenu();

    // Register any reveal targets that arrived with the partials
    if (window.SK && window.SK.observeReveals) window.SK.observeReveals();

    // The page just grew — tell ScrollTrigger once the browser has painted
    requestAnimationFrame(() => {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    });

    document.dispatchEvent(new CustomEvent("sk:components-ready"));
  } catch (err) {
    console.error("Component load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadComponents);
