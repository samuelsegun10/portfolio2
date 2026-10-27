(function () {
  "use strict";
  var root = document.body.getAttribute("data-root") || "";
  window.studentContentPromise = fetch(root + "content/portfolio.json?cb=" + Date.now(), { cache: "no-store" })
    .then(function (response) { if (!response.ok) throw new Error("Portfolio content could not be loaded."); return response.json(); })
    .then(function (content) {
      var name = content.profile && content.profile.name || "Your Name";
      var brand = document.querySelector("[data-brand]");
      if (brand) brand.textContent = name.trim().split(/\s+/).map(function (part) { return part.charAt(0); }).slice(0, 2).join("").toUpperCase();
      var footer = document.querySelector("[data-footer-name]");
      if (footer) footer.textContent = name;
      var favicon = document.querySelector('link[rel="icon"]');
      var iconPath = content.site && content.site.favicon;
      if (favicon && iconPath && !/^(?:javascript|data):/i.test(iconPath)) favicon.href = /^https?:\/\//i.test(iconPath) ? iconPath : root + iconPath.replace(/^\.\//, "");
      var samples = document.querySelector("[data-nav-samples]");
      var insights = document.querySelector("[data-nav-insights]");
      if (samples && Array.isArray(content.samples) && content.samples.length) samples.hidden = false;
      if (insights && Array.isArray(content.insights) && content.insights.length) insights.hidden = false;
      return content;
    });
}());
