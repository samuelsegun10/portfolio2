(function () {
  "use strict";
  var page = document.body.getAttribute("data-info-page");
  function setText(selector, value) { var element = document.querySelector(selector); if (element && value) element.textContent = value; }
  function showLink(selector, url, label) {
    var element = document.querySelector(selector);
    if (!element || !url || /^(?:javascript|data):/i.test(url)) return false;
    element.href = url; element.textContent = label; element.hidden = false;
    if (/^https?:\/\//i.test(url)) { element.target = "_blank"; element.rel = "noopener noreferrer"; }
    return true;
  }
  (window.studentContentPromise || Promise.reject(new Error("Content loader is missing"))).then(function (content) {
    var profile = content.profile || {}, about = content.about || {}, contact = content.contact || {};
    if (page === "about") {
      setText("[data-about-heading]", about.heading);
      setText("[data-about-summary]", about.summary);
      var portrait = document.querySelector("[data-info-portrait]");
      if (!profile.headshot) document.querySelector("[data-info-portrait-wrap]").hidden = true;
      else if (portrait) { portrait.src = /^https?:\/\//i.test(profile.headshot) ? profile.headshot : "../" + profile.headshot.replace(/^\.\//, ""); portrait.alt = profile.headshot_alt || "Portrait of " + (profile.name || "student"); }
    }
    if (page === "contact") {
      var has = false;
      has = showLink("[data-info-email]", contact.email ? "mailto:" + contact.email : "", contact.email) || has;
      has = showLink("[data-info-github]", contact.github_url, "GitHub") || has;
      has = showLink("[data-info-linkedin]", profile.linkedin_url, "LinkedIn") || has;
      if (has) document.querySelector("[data-info-contact-empty]").hidden = true;
    }
  }).catch(function () { setText("[data-about-summary]", "Profile details could not be loaded."); });
}());
