(function () {
  "use strict";
  var kind = document.body.getAttribute("data-collection");
  var nouns = { projects: "project", samples: "sample", insights: "insight" };
  if (!nouns[kind]) return;
  var search = document.querySelector("[data-search]");
  var filter = document.querySelector("[data-filter]");
  var industry = document.querySelector("[data-industry-filter]");
  var results = document.querySelector("[data-results]");
  var grid = document.querySelector("[data-grid]");
  var pagination = document.querySelector("[data-pagination]");
  var items = [], page = 1, pageSize = 6;

  function siteUrl(value) {
    if (!value || /^(?:javascript|data):/i.test(value) || /^\/\//.test(value)) return "";
    if (/^(?:https?:\/\/|#|\/)/i.test(value)) return value;
    return "../" + value.replace(/^(?:\.\/|\.\.\/)+/, "");
  }
  function text(tag, value, className) {
    var el = document.createElement(tag);
    el.textContent = value || "";
    if (className) el.className = className;
    return el;
  }
  function card(item) {
    var article = document.createElement("article");
    article.className = "project-card";
    var media;
    if (kind === "samples" && !item.cover_image) {
      media = document.createElement("div");
      media.className = "sample-cover";
      media.append(text("span", item.content_type || "Work sample"), text("strong", item.title || "Sample"));
    } else {
      media = document.createElement("img");
      media.src = siteUrl(kind === "samples" ? item.cover_image : item.image) || "../images/project-placeholder.svg";
      media.alt = (kind === "samples" && item.cover_alt) || (item.title || "Portfolio item") + " preview";
      media.loading = "lazy";
    }
    var body = document.createElement("div");
    body.className = "project-card-body";
    var category = kind === "samples" ? (item.content_type || "Work sample") : (item.eyebrow || nouns[kind]);
    body.appendChild(text("span", category, "eyebrow"));
    body.appendChild(text("h3", item.title || "Untitled"));
    body.appendChild(text("p", item.summary || ""));
    var destination = siteUrl(item.url);
    if (destination) {
      var link = text("a", item.button_label || (kind === "insights" ? "Read more" : kind === "samples" ? "View sample" : "View project"));
      link.href = destination;
      if (/^https?:\/\//i.test(destination)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      body.appendChild(link);
    }
    article.append(media, body);
    return article;
  }
  function filtered() {
    var term = search.value.trim().toLowerCase();
    var category = filter.value;
    var field = kind === "samples" ? "content_type" : "eyebrow";
    return items.filter(function (item) {
      var words = [item.title, item.summary, item.eyebrow, item.content_type, item.industry].join(" ").toLowerCase();
      return (!term || words.indexOf(term) !== -1) && (!category || item[field] === category) && (!industry || !industry.value || item.industry === industry.value);
    });
  }
  function pageButton(label, number, disabled, current) {
    var button = text("button", label);
    button.type = "button";
    button.disabled = disabled;
    if (current) button.setAttribute("aria-current", "page");
    button.addEventListener("click", function () { page = number; render(); document.querySelector(".library-header").scrollIntoView({ behavior: "smooth" }); });
    return button;
  }
  function render() {
    var matches = filtered(), totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, totalPages);
    grid.replaceChildren();
    matches.slice((page - 1) * pageSize, page * pageSize).forEach(function (item) { grid.appendChild(card(item)); });
    if (!matches.length) {
      var empty = items.length ? "No " + nouns[kind] + "s match your search." : "No " + nouns[kind] + "s have been added yet.";
      grid.appendChild(text("p", empty, "empty-state"));
    }
    results.textContent = matches.length + " " + nouns[kind] + (matches.length === 1 ? "" : "s") + " shown";
    pagination.replaceChildren();
    if (totalPages > 1) {
      pagination.appendChild(pageButton("Previous", Math.max(1, page - 1), page === 1, false));
      for (var number = 1; number <= totalPages; number++) pagination.appendChild(pageButton(String(number), number, number === page, number === page));
      pagination.appendChild(pageButton("Next", Math.min(totalPages, page + 1), page === totalPages, false));
    }
  }
  (window.studentContentPromise || Promise.reject(new Error("Content loader is missing"))).then(function (content) {
    items = (Array.isArray(content[kind]) ? content[kind] : []).filter(function (item) { return item && item.title; });
    items = items.map(function (item, index) { return { item: item, index: index }; }).sort(function (a, b) {
      var first = Date.parse(a.item.published_at || ""), second = Date.parse(b.item.published_at || "");
      if (!isNaN(first) && !isNaN(second)) return second - first;
      if (!isNaN(first)) return -1;
      if (!isNaN(second)) return 1;
      return b.index - a.index;
    }).map(function (entry) { return entry.item; });
    var field = kind === "samples" ? "content_type" : "eyebrow";
    Array.from(new Set(items.map(function (item) { return item[field]; }).filter(Boolean))).sort().forEach(function (value) {
      var option = document.createElement("option"); option.value = value; option.textContent = value; filter.appendChild(option);
    });
    if (industry) Array.from(new Set(items.map(function (item) { return item.industry; }).filter(Boolean))).sort().forEach(function (value) {
      var option = document.createElement("option"); option.value = value; option.textContent = value; industry.appendChild(option);
    });
    search.addEventListener("input", function () { page = 1; render(); });
    filter.addEventListener("change", function () { page = 1; render(); });
    if (industry) industry.addEventListener("change", function () { page = 1; render(); });
    render();
  }).catch(function () { results.textContent = "This collection could not be loaded. Check the content file and refresh."; });
}());
