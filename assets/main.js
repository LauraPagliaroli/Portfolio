/* Small, dependency-free behaviours: language switch (EN default / FR), theme switch, mobile menu, copy email. */
(function () {
  "use strict";

  /* ---------- Language switch (EN default, FR) ---------- */
  var nodes = document.querySelectorAll("[data-i18n]");
  var original = {};
  nodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in original)) original[k] = el.innerHTML; // English, from the HTML
  });
  var ariaNodes = document.querySelectorAll("[data-i18n-aria]");
  ariaNodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n-aria");
    if (!(k in original)) original[k] = el.getAttribute("aria-label");
  });
  var meta = {
    en: { title: document.title, desc: (document.querySelector('meta[name="description"]') || {}).content },
    fr: { title: "Laura Pagliaroli · UX Researcher & Product Discovery · Paris", desc: "Laura Pagliaroli, UX Researcher et Product Discovery à Paris. Recherche utilisateur de bout en bout, tests utilisateurs et co-design en français, italien, anglais et espagnol, transformés en décisions produit." }
  };

  function t(lang, key) {
    if (lang === "en" || !window.I18N || !window.I18N[lang]) return original[key];
    return window.I18N[lang][key] != null ? window.I18N[lang][key] : original[key];
  }

  function setLang(lang) {
    if (!/^(en|fr)$/.test(lang)) lang = "en";
    document.documentElement.lang = lang;
    nodes.forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      var v = t(lang, k);
      if (v != null) el.innerHTML = v;
    });
    ariaNodes.forEach(function (el) {
      var k = el.getAttribute("data-i18n-aria");
      var v = t(lang, k);
      if (v != null) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    // case study links follow the language: slug.html <-> slug-fr.html
    document.querySelectorAll('a[href^="case-studies/"]').forEach(function (a) {
      var href = a.getAttribute("href").replace(/-fr\.html$/, ".html");
      a.setAttribute("href", lang === "fr" ? href.replace(/\.html$/, "-fr.html") : href);
    });
    if (meta[lang]) {
      document.title = meta[lang].title;
      var d = document.querySelector('meta[name="description"]');
      if (d && meta[lang].desc) d.content = meta[lang].desc;
    }
    try { localStorage.setItem("lp-lang", lang); } catch (e) { /* storage unavailable: fine */ }
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  if (document.querySelector(".lang-switch button[data-lang]")) {
    var saved = null;
    try { saved = localStorage.getItem("lp-lang"); } catch (e) {}
    if (saved && saved !== "en") setLang(saved);
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var close = function () { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { close(); toggle.focus(); }
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copy-email");
  var status = document.getElementById("copy-status");
  if (copyBtn && status) {
    copyBtn.addEventListener("click", function () {
      var lang = document.documentElement.lang;
      var ok = t(lang, "ct.copied") || "Email copied";
      var fail = t(lang, "ct.copyfail") || "Copy failed: select the address instead";
      var email = document.getElementById("email-link").textContent.trim();
      var p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(email) : Promise.reject();
      p.then(function () { status.textContent = ok; }, function () { status.textContent = fail; });
    });
  }
  // English strings for the copy feedback (not in the HTML)
  original["ct.copied"] = "Email copied";
  original["ct.copyfail"] = "Copy failed: select the address instead";

  /* ---------- Light / dark switch ---------- */
  var themeBtn = document.getElementById("theme-toggle");
  var themeLabel = document.getElementById("theme-toggle-label");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var THEME_TXT = {
    en: ["Switch to dark mode", "Switch to light mode"],
    fr: ["Passer en mode sombre", "Passer en mode clair"]
  };
  function isDark() {
    var t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : !!(mq && mq.matches);
  }
  function syncThemeBtn() {
    if (!themeBtn) return;
    var dark = isDark();
    var txt = THEME_TXT[document.documentElement.lang] || THEME_TXT.en;
    themeBtn.setAttribute("aria-pressed", String(dark));
    if (themeLabel) themeLabel.textContent = dark ? txt[1] : txt[0];
    themeBtn.title = dark ? txt[1] : txt[0];
  }
  // Light by default. The visitor's click is the only thing that changes it:
  // if an embedding page (e.g. a preview frame) rewrites data-theme, we put the chosen theme back.
  var chosenTheme = "light";
  document.documentElement.setAttribute("data-theme", chosenTheme);
  new MutationObserver(function () {
    if (document.documentElement.getAttribute("data-theme") !== chosenTheme) {
      document.documentElement.setAttribute("data-theme", chosenTheme);
    }
    syncThemeBtn();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      chosenTheme = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", chosenTheme);
      syncThemeBtn();
    });
    if (mq && mq.addEventListener) mq.addEventListener("change", syncThemeBtn);
    syncThemeBtn();
    new MutationObserver(syncThemeBtn).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("to-top");
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle("is-visible", window.scrollY > 600); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function (e) {
      e.preventDefault();
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var brand = document.querySelector(".brand");
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Preview only: remember the page and scroll position ----------
     When the site is shown inside a frame (the Claude artifact preview), a new version reloads the
     entry page. We remember where the reader was so index.html can send them back. Not active on
     GitHub Pages, where the site is never framed. */
  try {
    if (window.self !== window.top) {
      var KEY = "lp-last-view";
      var save = function () {
        var m = location.pathname.match(/case-studies\/[^\/]+\.html$/);
        // Store the page relative to the site root: the preview serves each version under its own path.
        sessionStorage.setItem(KEY, JSON.stringify({ page: m ? m[0] : "", hash: location.hash, y: Math.round(window.scrollY), t: Date.now() }));
      };
      var pending = null;
      window.addEventListener("scroll", function () { if (!pending) pending = setTimeout(function () { pending = null; save(); }, 250); }, { passive: true });
      window.addEventListener("pagehide", save);
      save();
      var restoreY = sessionStorage.getItem("lp-restore-y");
      if (restoreY !== null) {
        sessionStorage.removeItem("lp-restore-y");
        var y = parseInt(restoreY, 10) || 0;
        window.addEventListener("load", function () { window.scrollTo(0, y); });
        setTimeout(function () { window.scrollTo(0, y); }, 50);
      }
    }
  } catch (e) { /* storage unavailable: nothing to restore */ }

  /* ---------- CV download inside the Claude artifact viewer ----------
     The viewer blocks plain download links, so there we hand the PDF over through the
     platform's downloads capability. Elsewhere (GitHub Pages) the normal link is used. */
  try {
    if (window.claude && typeof window.claude.use === "function") {
      window.claude.use("downloads").then(function (dl) {
        if (!dl) return;
        var links = document.querySelectorAll('a[download][href$=".pdf"]');
        if (!links.length) return;
        var href = links[0].getAttribute("href");
        var cached = fetch(href).then(function (r) { return r.ok ? r.blob() : null; }).catch(function () { return null; });
        links.forEach(function (a) {
          a.addEventListener("click", function (e) {
            e.preventDefault();
            cached.then(function (blob) {
              if (!blob) { window.open(a.href, "_blank", "noopener"); return; }
              return dl.save({ filename: a.getAttribute("download") || "CV.pdf", data: blob });
            }).catch(function (err) {
              var code = err && err.code;
              if (code !== "declined" && code !== "rate_limited") window.open(a.href, "_blank", "noopener");
            });
          });
        });
      });
    }
  } catch (e) { /* plain link stays */ }
})();
