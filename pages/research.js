import { research } from "../content/research.js";
import { assetUrl, escapeHtml, renderLayout } from "../templates/layout.js";

function renderDirections() {
  return research.directions
    .map(
      (direction) => `<article class="direction-item">
        <h3>${escapeHtml(direction.title)}</h3>
        <p>${escapeHtml(direction.text)}</p>
      </article>`,
    )
    .join("\n");
}

function renderProjects(assetVersion) {
  return research.projects
    .map(
      (project) => `<a class="project-row" href="${escapeHtml(project.href)}" rel="noopener noreferrer" target="_blank">
        <img class="project-image" src="${escapeHtml(assetUrl(project.image.src, assetVersion))}" alt="${escapeHtml(project.image.alt)}" width="${project.image.width}" height="${project.image.height}" loading="lazy" decoding="async">
        <div class="project-copy">
          <p class="project-category">${escapeHtml(project.category)}</p>
          <h3>${escapeHtml(project.title)}</h3>
          <p class="project-summary">${escapeHtml(project.summary)}</p>
          <p class="project-venue">${escapeHtml(project.venue)}</p>
        </div>
      </a>`,
    )
    .join("\n");
}

function renderAcademicLinks(assetVersion) {
  return research.links
    .map((item) => {
      const external = /^https?:\/\//.test(item.href);
      const attributes = external ? ' rel="noopener noreferrer" target="_blank"' : "";
      const href = external ? item.href : assetUrl(item.href, assetVersion);
      return `<a class="academic-link" href="${escapeHtml(href)}"${attributes}>
        ${escapeHtml(item.label)}
        <p>${escapeHtml(item.description)}</p>
      </a>`;
    })
    .join("\n");
}

export const researchPage = {
  page: "research",
  output: "research.html",
  title: research.title,
  description: research.description,
  render({ assetVersion } = {}) {
    const main = `<div class="page-shell">
      <header class="page-heading">
        <h1>${escapeHtml(research.title)}</h1>
        <p class="page-introduction">${escapeHtml(research.introduction)}</p>
      </header>
      <section class="research-section" aria-labelledby="research-directions">
        <h2 id="research-directions">Research directions</h2>
        <div class="direction-list">${renderDirections()}</div>
      </section>
      <section class="research-section" aria-labelledby="featured-papers">
        <h2 id="featured-papers">Featured papers</h2>
        <div class="project-list">${renderProjects(assetVersion)}</div>
      </section>
      <section class="research-section academic-links-section" aria-labelledby="academic-links">
        <h2 id="academic-links">Academic links</h2>
        <div class="academic-links">${renderAcademicLinks(assetVersion)}</div>
      </section>
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
