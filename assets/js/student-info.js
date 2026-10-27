(function () {
  "use strict";

  var page = document.body.getAttribute("data-info-page");

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element && typeof value === "string") element.textContent = value;
  }

  function showLink(selector, url, label) {
    var element = document.querySelector(selector);
    if (!element || !url || /^(?:javascript|data):/i.test(url)) return false;
    element.href = url;
    element.textContent = label;
    element.hidden = false;
    if (/^https?:\/\//i.test(url)) {
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
    return true;
  }

  function addParagraph(container, value) {
    if (typeof value !== "string" || !value.trim()) return;
    var paragraph = document.createElement("p");
    paragraph.textContent = value.trim();
    container.appendChild(paragraph);
  }

  function renderAbout(profile, about) {
    setText("[data-about-page-title]", about.page_title || "About Me");
    setText("[data-about-skills-heading]", about.skills_heading || "Skills & tools");
    setText("[data-about-skills-intro]", about.skills_intro || "");
    setText("[data-about-journey-heading]", about.journey_heading || "My journey");
    setText("[data-about-journey-intro]", about.journey_intro || "");

    var portrait = document.querySelector("[data-info-portrait]");
    if (portrait) {
      if (!profile.headshot || /^(?:javascript|data):/i.test(profile.headshot)) {
        portrait.hidden = true;
      } else {
        portrait.src = /^https?:\/\//i.test(profile.headshot)
          ? profile.headshot
          : "../" + profile.headshot.replace(/^\.\//, "");
        portrait.alt = profile.headshot_alt || "Portrait of " + (profile.name || "student");
      }
    }

    var bio = document.querySelector("[data-about-bio]");
    if (bio) {
      bio.replaceChildren();
      var paragraphs = Array.isArray(about.bio_paragraphs)
        ? about.bio_paragraphs.filter(function (item) {
            return typeof item === "string" && item.trim();
          })
        : [];
      if (!paragraphs.length && about.summary) paragraphs = [about.summary];
      paragraphs.forEach(function (item) { addParagraph(bio, item); });
    }

    var groups = Array.isArray(about.skill_groups)
      ? about.skill_groups.filter(function (item) { return item && item.title; })
      : [];
    var skillsSection = document.querySelector("[data-about-skills-section]");
    var skillsGrid = document.querySelector("[data-about-skill-groups]");
    if (skillsSection && skillsGrid && groups.length) {
      skillsSection.hidden = false;
      skillsGrid.replaceChildren();
      groups.forEach(function (group) {
        var card = document.createElement("section");
        var heading = document.createElement("h3");
        var list = document.createElement("ul");
        card.className = "student-skill-card";
        heading.textContent = group.title;
        (Array.isArray(group.skills) ? group.skills : []).forEach(function (skill) {
          if (typeof skill !== "string" || !skill.trim()) return;
          var item = document.createElement("li");
          item.textContent = skill.trim();
          list.appendChild(item);
        });
        card.append(heading, list);
        skillsGrid.appendChild(card);
      });
    }

    var entries = Array.isArray(about.journey)
      ? about.journey.filter(function (item) { return item && item.title; })
      : [];
    var journeySection = document.querySelector("[data-about-journey-section]");
    var timeline = document.querySelector("[data-about-journey-items]");
    if (journeySection && timeline && entries.length) {
      journeySection.hidden = false;
      timeline.replaceChildren();
      entries.forEach(function (entry) {
        var item = document.createElement("li");
        if (entry.period) {
          var period = document.createElement("span");
          period.className = "student-journey-period";
          period.textContent = entry.period;
          item.appendChild(period);
        }
        var heading = document.createElement("h3");
        heading.textContent = entry.title;
        item.appendChild(heading);
        if (entry.place) {
          var place = document.createElement("p");
          place.className = "student-journey-place";
          place.textContent = entry.place;
          item.appendChild(place);
        }
        var details = document.createElement("ul");
        (Array.isArray(entry.highlights) ? entry.highlights : []).forEach(function (value) {
          if (typeof value !== "string" || !value.trim()) return;
          var detail = document.createElement("li");
          detail.textContent = value.trim();
          details.appendChild(detail);
        });
        if (details.childElementCount) item.appendChild(details);
        timeline.appendChild(item);
      });
    }

    var grid = document.querySelector("[data-about-grid]");
    if (grid && (!groups.length || !entries.length)) grid.classList.add("single");
  }

  (window.studentContentPromise || Promise.reject(new Error("Content loader is missing")))
    .then(function (content) {
      var profile = content.profile || {};
      var about = content.about || {};
      var contact = content.contact || {};

      if (page === "about") renderAbout(profile, about);

      if (page === "contact") {
        var has = false;
        has = showLink("[data-info-email]", contact.email ? "mailto:" + contact.email : "", contact.email) || has;
        has = showLink("[data-info-github]", contact.github_url, "GitHub") || has;
        has = showLink("[data-info-linkedin]", profile.linkedin_url, "LinkedIn") || has;
        if (has) document.querySelector("[data-info-contact-empty]").hidden = true;
      }
    })
    .catch(function (error) {
      console.warn(error.message);
    });
}());
