import { home } from "../content/home.js";
import { assetUrl, escapeHtml, renderLayout } from "../templates/layout.js";

export const homePage = {
  page: "home",
  output: "index.html",
  title: home.title,
  description: home.description,
  render({ assetVersion } = {}) {
    const main = `<section class="home-intro" aria-labelledby="home-title">
      <div class="home-copy">
        <p class="eyebrow">${escapeHtml(home.eyebrow)}</p>
        <h1 id="home-title">${escapeHtml(home.title)} (<span lang="zh">钱 振</span>)</h1>
        <p class="home-summary">${escapeHtml(home.intro)}</p>
        <p class="affiliation">${escapeHtml(home.affiliation)}</p>
      </div>
      <img class="home-portrait" src="${escapeHtml(assetUrl(home.portrait.src, assetVersion))}" alt="${escapeHtml(home.portrait.alt)}" width="${home.portrait.width}" height="${home.portrait.height}" fetchpriority="high">
    </section>`;

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
