import { activities } from "../content/activities.js";
import { escapeHtml, renderLayout } from "../templates/layout.js";

function groupByYear(items) {
  const groups = new Map();
  for (const item of [...items].sort((left, right) => right.date.localeCompare(left.date))) {
    const year = item.date.slice(0, 4);
    const group = groups.get(year) ?? [];
    group.push(item);
    groups.set(year, group);
  }
  return groups;
}

function renderTimeline() {
  return [...groupByYear(activities.items)]
    .map(
      ([year, items]) => `<section class="activity-year">
        <h2>${escapeHtml(year)}</h2>
        <div class="activity-list">
          ${items
            .map(
              (item) => `<article class="activity-row">
                <div class="activity-meta">
                  <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.dateLabel)}</time>
                  <p class="activity-type">${escapeHtml(item.type)}</p>
                </div>
                <div class="activity-copy">
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.text)}</p>
                </div>
              </article>`,
            )
            .join("\n")}
        </div>
      </section>`,
    )
    .join("\n");
}

export const activitiesPage = {
  page: "activities",
  output: "activities.html",
  title: activities.title,
  description: activities.description,
  robots: "noindex",
  render({ assetVersion } = {}) {
    const main = `<div class="page-shell">
      <header class="page-heading">
        <h1>${escapeHtml(activities.title)}</h1>
        <p class="page-introduction">${escapeHtml(activities.introduction)}</p>
      </header>
      <div class="activity-timeline">${renderTimeline()}</div>
    </div>`;

    return renderLayout({
      page: this.page,
      output: this.output,
      title: this.title,
      description: this.description,
      main,
      assetVersion,
      robots: this.robots,
    });
  },
};
