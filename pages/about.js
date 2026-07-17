import { about } from "../content/about.js";
import { escapeHtml, renderLayout } from "../templates/layout.js";

function renderSections() {
  return about.sections
    .map(
      (section) => `<section class="narrative-section">
        <h2>${escapeHtml(section.title)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ")}
      </section>`,
    )
    .join("\n");
}

export const aboutPage = {
  page: "about",
  output: "about.html",
  title: about.title,
  description: about.description,
  render({ assetVersion } = {}) {
    const main = `<div class="page-shell reading-shell">
      <header class="page-heading">
        <h1>${escapeHtml(about.title)}</h1>
        <p class="page-introduction">${escapeHtml(about.introduction)}</p>
      </header>
      <article class="narrative">${renderSections()}</article>
    </div>`;

    return renderLayout({
      page: this.page,
      output: this.output,
      title: this.title,
      description: this.description,
      main,
      assetVersion,
    });
  },
};
