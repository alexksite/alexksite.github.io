/* ==========================================================================
   Alex Koziy — site interactions
   Vanilla JS, no dependencies. Safe to load on every page.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Sticky nav shadow ---------- */
  var nav = $("#nav");
  if (nav) {
    var onScrollNav = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  var burger = $("#burger");
  var drawer = $("#drawer");
  if (burger && drawer) {
    var setDrawer = function (open) {
      drawer.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    burger.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });

    // Close when a link is tapped
    $$("a", drawer).forEach(function (a) {
      a.addEventListener("click", function () { setDrawer(false); });
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        setDrawer(false);
        burger.focus();
      }
    });

    // Close if resized up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setDrawer(false);
    });
  }

  /* ---------- Back to top ---------- */
  var totop = $("#totop");
  if (totop) {
    var onScrollTop = function () {
      totop.classList.toggle("is-on", window.scrollY > 620);
    };
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    totop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".rv");
  if (reveals.length) {
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          // Stagger siblings inside the same grid for a subtle cascade
          var parent = el.parentElement;
          var delay = 0;
          if (parent && /grid|stats|logos|feature-list|tl/.test(parent.className)) {
            delay = Array.prototype.indexOf.call(parent.children, el) * 70;
          }
          setTimeout(function () { el.classList.add("is-in"); }, Math.min(delay, 420));
          io.unobserve(el);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Active section highlight (homepage) ---------- */
  var navLinks = $$(".nav__links a[href^='#']");
  if (navLinks.length && "IntersectionObserver" in window) {
    var sections = navLinks
      .map(function (a) { return $(a.getAttribute("href")); })
      .filter(Boolean);

    if (sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });

      sections.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ---------- Case study filters ---------- */
  var filters = $("#filters");
  var csGrid = $("#csGrid");
  if (filters && csGrid) {
    var cards = $$(".cs", csGrid);
    var empty = $("#csEmpty");

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;

      $$(".filter", filters).forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      var f = btn.getAttribute("data-f");
      var shown = 0;

      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var match = f === "all" || tags.indexOf(f) !== -1;
        card.hidden = !match;
        if (match) {
          shown++;
          // replay the reveal animation
          card.classList.remove("is-in");
          void card.offsetWidth;
          card.classList.add("is-in");
        }
      });

      if (empty) empty.hidden = shown !== 0;
    });
  }

  /* ---------- Contact form ---------- */
  var form = $("#contactForm");
  if (form) {
    var okBox = $("#formOk");

    var markBad = function (field, bad) {
      if (field) field.classList.toggle("is-bad", bad);
    };

    var validate = function () {
      var valid = true;

      $$("input[required], textarea[required]", form).forEach(function (input) {
        var field = input.closest(".field");
        var value = (input.value || "").trim();
        var bad = !value;

        if (!bad && input.type === "email") {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        }

        markBad(field, bad);
        if (bad && valid) input.focus();
        if (bad) valid = false;
      });

      return valid;
    };

    // Clear the error state as soon as the user corrects it
    $$("input, textarea", form).forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && field.classList.contains("is-bad")) markBad(field, false);
      });
    });

    form.addEventListener("submit", function (e) {
      if (!validate()) {
        e.preventDefault();
        return;
      }

      // The form posts into a hidden iframe (Google Forms), so the page never
      // navigates. Swap in the thank-you panel once the POST has been fired.
      var btn = $("button[type='submit']", form);
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.6";
        btn.textContent = "Sending…";
      }

      setTimeout(function () {
        if (okBox) {
          form.style.display = "none";
          okBox.classList.add("is-on");
        }
      }, 700);
    });
  }
})();
