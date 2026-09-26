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
    // Versioned so a new build is fetched instead of a stale cached copy.
    s.src = "js/agent.js?v=20260926i";
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
  btn.setAttribute("aria-label", "Запитати про чат-боти Alex Koziy");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "ak-agent");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8A8.5 8.5 0 0112.5 20a8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5a8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>' +
    '</svg><span>Запитати ШІ-асистента</span>';

  btn.addEventListener("click", function () {
    dismissNudge(true);
    boot(function () { window.AKAgent.toggle(); });
  });

  /* ---- First-visit nudge: a small bubble with an arrow pointing at the
     launcher, so visitors notice the assistant and know to click it. Shown
     once, then remembered so it never nags a returning visitor. ---- */
  var NUDGE_KEY = "ak_nudge_seen";
  var nudge = null, nudgeTimer = null;

  function seenNudge() {
    try { return localStorage.getItem(NUDGE_KEY) === "1"; } catch (e) { return false; }
  }
  function rememberNudge() {
    try { localStorage.setItem(NUDGE_KEY, "1"); } catch (e) {}
  }
  function dismissNudge(remember) {
    if (nudgeTimer) { clearTimeout(nudgeTimer); nudgeTimer = null; }
    if (nudge) {
      nudge.classList.remove("on");
      var n = nudge; nudge = null;
      setTimeout(function () { if (n && n.parentNode) n.parentNode.removeChild(n); }, 320);
    }
    if (remember) rememberNudge();
  }
  function showNudge() {
    if (seenNudge() || nudge || document.getElementById("ak-nudge")) return;
    nudge = document.createElement("div");
    nudge.id = "ak-nudge";
    nudge.className = "ak-nudge";
    nudge.setAttribute("role", "status");
    nudge.innerHTML =
      '<button class="ak-nudge__x" type="button" aria-label="Закрити">&times;</button>' +
      '<b>Маєте запитання?</b> Натисніть тут, щоб спитати мого ШІ-асистента — він усе пояснить миттєво.' +
      '<span class="ak-nudge__arrow" aria-hidden="true"></span>';
    document.body.appendChild(nudge);
    // let it paint, then transition in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (nudge) nudge.classList.add("on"); });
    });
    nudge.querySelector(".ak-nudge__x").addEventListener("click", function (ev) {
      ev.stopPropagation();
      dismissNudge(true);
    });
    // Clicking the bubble body opens the chat too
    nudge.addEventListener("click", function () {
      dismissNudge(true);
      boot(function () { window.AKAgent.open(); });
    });
    // Auto-hide after a while so it never lingers annoyingly
    nudgeTimer = setTimeout(function () { dismissNudge(true); }, 12000);
  }

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

  function mount() {
    document.body.appendChild(btn);
    // Show the first-visit nudge a moment after load, once the page has settled.
    if (!seenNudge()) setTimeout(showNudge, 2600);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
