(function(){"use strict";
function text(selector,value){var el=document.querySelector(selector);if(el&&value)el.textContent=value}
function link(selector,url,label){var el=document.querySelector(selector);if(!el||!url)return false;el.href=url;if(label)el.textContent=label;if(/^https?:\/\//i.test(url)){el.target="_blank";el.rel="noopener noreferrer"}el.hidden=false;return true}
(window.studentContentPromise || fetch("content/portfolio.json?cb="+Date.now(),{cache:"no-store"}).then(function(r){if(!r.ok)throw Error("Portfolio content could not be loaded");return r.json()})).then(function(content){
var p=content.profile||{},a=content.about||{},c=content.contact||{};
text("[data-name]",p.name);text("[data-footer-name]",p.name);
if(p.name){text("[data-brand]",p.name.trim().split(/\s+/).map(function(w){return w[0]}).slice(0,2).join("").toUpperCase());document.title=p.name+" | Portfolio"}
text("[data-title]",p.primary_title||p.headline);text("[data-summary]",p.summary);text("[data-about-heading]",a.heading);text("[data-about-summary]",a.summary);
if(!p.headshot)document.querySelector(".hero-visual").hidden=true;
if(p.headshot&&p.headshot!=="images/project-placeholder.svg"){var portrait=document.querySelector("[data-portrait]");portrait.src=p.headshot;portrait.alt=p.headshot_alt||"Portrait of "+(p.name||"student")}
link("[data-cv]",p.cv_url,p.cv_label||"Download CV");
link("[data-hero-email]",c.email?"mailto:"+c.email:"");
link("[data-hero-linkedin]",p.linkedin_url);
link("[data-hero-github]",c.github_url);
var has=false;has=link("[data-email]",c.email?"mailto:"+c.email:"",c.email)||has;has=link("[data-github]",c.github_url,"GitHub")||has;has=link("[data-linkedin]",p.linkedin_url,"LinkedIn")||has;
if(has)document.querySelector("[data-contact-empty]").hidden=true;
var grid=document.querySelector("[data-project-grid]"),projects=Array.isArray(content.projects)?content.projects.filter(function(x){return x&&x.title}):[];
projects.slice(0,3).forEach(function(x){var card=document.createElement("article");card.className="project-card";var img=document.createElement("img");img.src=x.image||"images/project-placeholder.svg";img.alt=x.title+" preview";img.loading="lazy";var body=document.createElement("div");body.className="project-card-body";var eyebrow=document.createElement("span");eyebrow.className="eyebrow";eyebrow.textContent=x.eyebrow||"Project";var h=document.createElement("h3");h.textContent=x.title;var summary=document.createElement("p");summary.textContent=x.summary||"";body.append(eyebrow,h,summary);if(x.url&&!/^(?:javascript|data):/i.test(x.url)){var btn=document.createElement("a");btn.href=x.url;btn.textContent=x.button_label||"View project";if(/^https?:\/\//i.test(x.url)){btn.target="_blank";btn.rel="noopener noreferrer"}body.appendChild(btn)}card.append(img,body);grid.appendChild(card)});
if(projects.length){document.querySelector("[data-project-empty]").hidden=true;document.querySelector("[data-all-projects]").hidden=false}
}).catch(function(error){console.warn(error.message)})
})();



