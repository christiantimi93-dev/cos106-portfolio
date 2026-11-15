/* =========================================================
   main.js - shared behaviour for every page
   (navigation, scroll effects, animations, footer year)
   ========================================================= */

document.documentElement.classList.add("js");

/* ---------- Mobile navigation toggle ---------- */
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the menu after a link is chosen or Escape is pressed
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
}

/* ---------- Header border on scroll ---------- */
function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  function update() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Reveal elements as they scroll into view ---------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { observer.observe(el); });
}

/* ---------- Animated number counters (home page stats) ---------- */
function animateCounter(el) {
  const target = Number(el.dataset.target) || 0;
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function setupCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;
  if (!("IntersectionObserver" in window)) {
    counters.forEach(function (c) { c.textContent = c.dataset.target; });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { observer.observe(c); });
}

/* ---------- Typing effect (home page) ---------- */
function setupTyping() {
  const target = document.getElementById("typed");
  if (!target) return;
  const phrases = ["building web apps", "solving problems", "learning JavaScript", "space & football"];
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function step() {
    const phrase = phrases[phraseIndex];
    target.textContent = phrase.slice(0, charIndex);

    if (deleting) {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
      }
      setTimeout(step, 45);
    } else {
      charIndex++;
      if (charIndex > phrases[phraseIndex].length) {
        deleting = true;
        charIndex = phrases[phraseIndex].length;
        setTimeout(step, 1800);
        return;
      }
      setTimeout(step, 85);
    }
  }
  setTimeout(step, 2200);
}

/* ---------- Scroll progress bar ---------- */
function setupScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = "scaleX(" + ratio + ")";
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ---------- Cursor spotlight on cards ---------- */
function setupGlowCards() {
  const cards = document.querySelectorAll(".glow-card, .project-card, .info-card, .panel");
  cards.forEach(function (card) {
    card.classList.add("glow-card");
    card.addEventListener("pointermove", function (event) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
      card.style.setProperty("--my", (event.clientY - rect.top) + "px");
    });
  });
}

/* ---------- Footer year ---------- */
function setYear() {
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}

setupNavigation();
setupHeaderScroll();
setupReveal();
setupCounters();
setupTyping();
setupScrollProgress();
setupGlowCards();
setYear();
