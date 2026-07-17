import { site } from "../content/site.js";

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function assetUrl(path, assetVersion) {
  return assetVersion ? `${path}?v=${assetVersion}` : path;
}

function renderNavigation(page) {
  return site.navigation
    .filter((item) => !item.hidden)
    .map((item) => {
      const current = item.page === page ? ' aria-current="page"' : "";
      return `<a href="${escapeHtml(item.href)}"${current}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n        ");
}

function renderAnalytics() {
  if (site.analytics.provider !== "goatcounter" || !site.analytics.site) return "";

  const identifier = escapeHtml(site.analytics.site);
  return `\n  <script data-goatcounter="https://${identifier}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`;
}

export function renderLayout({ page, output, title, description, main, assetVersion = "", robots = "" }) {
  const canonical = output === "index.html" ? `${site.domain}/` : `${site.domain}/${output}`;
  const stylesheet = `assets/styles.css${assetVersion ? `?v=${assetVersion}` : ""}`;
  const script = `assets/script.js${assetVersion ? `?v=${assetVersion}` : ""}`;
  const fullTitle = page === "home" ? `${site.name} (${site.nativeName})` : `${title} | ${site.name}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  ${robots ? `<meta name="robots" content="${escapeHtml(robots)}">` : ""}
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <title>${escapeHtml(fullTitle)}</title>
  <link rel="stylesheet" href="${stylesheet}">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="site-name" href="index.html">${escapeHtml(site.name)}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span>Menu</span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
        ${renderNavigation(page)}
      </nav>
    </div>
  </header>
  <main id="main-content">${main}</main>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>© ${new Date().getFullYear()} ${escapeHtml(site.name)} (<span lang="zh">${escapeHtml(site.nativeName)}</span>).</p>
    </div>
  </footer>
  <script defer src="${script}"></script>${renderAnalytics()}
</body>
</html>
`;
}
