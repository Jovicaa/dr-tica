/* Dr. Tica — stomatologija | interakcije */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Godina u footeru */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Senka na headeru pri skrolanju */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobilni meni */
  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zatvori meni" : "Otvori meni");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* Pojavljivanje elemenata pri skrolanju */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("revealed"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("revealed");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* Brojači u sekciji „O doktoru" */
  const counters = document.querySelectorAll("[data-count]");
  const fmt = (v, suffix) => v.toLocaleString("bs-BA") + suffix;
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      el.textContent = fmt(Math.round(target * eased), suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reduce || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      el.textContent = fmt(Number(el.dataset.count), el.dataset.suffix || "");
    });
  } else {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            runCounter(en.target);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* Lightbox za galeriju */
  const lightbox = document.getElementById("lightbox");
  const art = document.getElementById("lightboxArt");
  const title = document.getElementById("lightboxTitle");
  const closeBtn = document.getElementById("lightboxClose");

  const openBox = (tile) => {
    const svg = tile.querySelector("svg");
    if (svg) art.innerHTML = svg.outerHTML;
    title.textContent = tile.dataset.title || "";
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  };
  const closeBox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
  };

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("role", "button");
    tile.addEventListener("click", () => openBox(tile));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openBox(tile);
      }
    });
  });
  closeBtn.addEventListener("click", closeBox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeBox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeBox();
  });

  /* Kontakt forma — na Netlifyju radi kao prava forma,
     van mreže samo prikazuje demo poruku */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Slanje…";
    const body = new URLSearchParams(new FormData(form)).toString();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then(() => {
        note.textContent = "✓ Hvala! Javit ćemo se istoga radnog dana.";
        form.reset();
      })
      .catch(() => {
        note.textContent =
          "✓ Zahtjev primljen (lokalni prikaz). Na serveru forma se šalje stvarno.";
        form.reset();
      });
  });
})();
