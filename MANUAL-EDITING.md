# Edit your portfolio content manually

The site reads content/portfolio.json. GitHub's file editor or any text editor can change it. Keep quotation marks and commas valid JSON.

Replace the placeholder fields in profile and about. In contact, enter only links or an email address you want public. Leave cv_url empty to hide the CV button. Clear headshot to hide the portrait.

Add a real project inside the projects array. Example shape:

```json
{
  "eyebrow": "Tool or topic",
  "title": "Your actual project title",
  "summary": "The question, what you did, and a finding you can support.",
  "image": "images/project-placeholder.svg",
  "url": "https://github.com/YOUR-USERNAME/YOUR-PROJECT",
  "button_label": "View project"
}
```

The text above is a shape to replace, not a completed project. You can add more projects later. Samples and Insights are optional arrays. A sample can be any permitted dashboard, notebook, report, design, presentation, code or writing artifact; set its title, content_type, summary, optional cover_image and public url. A sample card opens its public URL directly.

After editing, commit the file and refresh the live site. If the page does not show changes, check JSON punctuation and the GitHub Pages deployment status.

