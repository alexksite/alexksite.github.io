/* Lazy launcher for the site agent.
   This is the only agent code on the critical path (~1 KB). The engine, its UI
   and the knowledge base are fetched on first intent, or during browser idle
   time — whichever comes first — so the widget costs the initial page load
   essentially nothing but still opens instantly when clicked. */
(function () {
  "use strict";
  if (document.getElementById("ak-launch")) return;

  var loaded = false, loading = false, queue = [];

  function boot(cb) {
    if (loaded) { cb && cb(); return; }
    if (cb) queue.push(cb);
    if (loading) return;
    loading = true;

    var s = document.createElement("script");
    s.src = "js/agent.js";
    s.async = true;
    s.onload = function () {
      loaded = true;
      queue.splice(0).forEach(function (f) { f(); });
    };
    s.onerror = function () {
      loading = false;
      queue.splice(0);
      btn.title = "Chat unavailable — email info@alexkoziy.com";
    };
    document.head.appendChild(s);
  }

  var btn = document.createElement("button");
  btn.id = "ak-launch";
  btn.className = "ak-launch";
  btn.type = "button";
  btn.setAttribute("aria-label", "Ask a question about Alex Koziy");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "ak-agent");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8A8.5 8.5 0 0112.5 20a8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5a8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>' +
    '</svg><span>Ask about Alex</span>';

  btn.addEventListener("click", function () {
    boot(function () { window.AKAgent.toggle(); });
  });

  // Warm up on first hint of engagement, so the click feels instantaneous.
  function warm() {
    boot();
    window.removeEventListener("pointerdown", warm);
    window.removeEventListener("keydown", warm);
    window.removeEventListener("scroll", warm);
  }
  window.addEventListener("pointerdown", warm, { once: true, passive: true });
  window.addEventListener("keydown", warm, { once: true });
  window.addEventListener("scroll", warm, { once: true, passive: true });

  if ("requestIdleCallback" in window) {
    requestIdleCallback(warm, { timeout: 5000 });
  } else {
    setTimeout(warm, 3500);
  }

  function mount() { document.body.appendChild(btn); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
