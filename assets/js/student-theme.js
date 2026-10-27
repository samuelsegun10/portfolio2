(function () {
  "use strict";

  var key = "student-portfolio-theme";
  var script = document.currentScript;
  var siteRoot = script ? new URL("../../", script.src) : new URL("./", location.href);

  function readTheme() {
    var fromUrl = new URL(location.href).searchParams.get("theme");
    if (fromUrl === "light" || fromUrl === "dark") return fromUrl;
    try {
      var saved = localStorage.getItem(key);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    return "dark";
  }

  function carryTheme(theme) {
    var current = new URL(location.href);
    current.searchParams.set("theme", theme);
    try { history.replaceState(history.state, "", current.href); } catch (_) {}
    document.querySelectorAll("a[href]").forEach(function (link) {
      var url = new URL(link.href, location.href);
      if (url.origin !== siteRoot.origin || !url.pathname.startsWith(siteRoot.pathname)) return;
      url.searchParams.set("theme", theme);
      link.href = url.href;
    });
  }

  function updateButton() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    var light = document.documentElement.getAttribute("data-theme") === "light";
    button.textContent = light ? "Dark mode" : "Light mode";
    button.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    button.setAttribute("aria-pressed", String(light));
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(key, theme); } catch (_) {}
    carryTheme(theme);
    updateButton();
  }

  document.documentElement.setAttribute("data-theme", readTheme());

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      carryTheme(readTheme());
      updateButton();
    });
  } else {
    carryTheme(readTheme());
    updateButton();
  }

  window.addEventListener("pageshow", function () {
    var theme = readTheme();
    document.documentElement.setAttribute("data-theme", theme);
    carryTheme(theme);
    updateButton();
  });
}());
