import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildSite } from "../scripts/build.mjs";
import { site } from "../content/site.js";

const pageFiles = ["index.html", "about.html", "research.html", "activities.html", "contact.html"];

async function withBuiltSite(run) {
  const outputDir = await mkdtemp(join(tmpdir(), "zqian-site-"));

  try {
    await buildSite({ outputDir });
    await run({
      outputDir,
      read: (file) => readFile(join(outputDir, file), "utf8"),
    });
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
}

test("builds complete, contentful HTML pages without a client-side content renderer", async () => {
  await withBuiltSite(async ({ read }) => {
    for (const page of pageFiles) {
      const html = await read(page);

      assert.match(html, /<header class="site-header">/);
      assert.match(html, /<main id="main-content">[\s\S]+<\/main>/);
      assert.match(html, /<footer class="site-footer">/);
      assert.match(html, /class="skip-link"/);
      assert.doesNotMatch(html, /assets\/content\.js/);
      assert.doesNotMatch(html, /gc\.zgo\.at\/count\.js/);
    }
  });
});

test("preserves the approved research identity and editorial structure", async () => {
  await withBuiltSite(async ({ read }) => {
    const home = await read("index.html");
    const research = await read("research.html");
    const about = await read("about.html");

    assert.match(home, /Earth System Science · Spatiotemporal Intelligence/);
    assert.match(research, /<h1>Research<\/h1>/);
    assert.match(research, /Featured papers/);
    assert.match(
      research,
      /Nonlinear dynamics, extreme events, tipping behavior, and land-atmosphere feedbacks, with an emphasis on mechanisms that can be recovered from incomplete observations\./,
    );
    assert.doesNotMatch(about, /supervised by Prof\. Dr\. Niklas Boers/);
  });
});

test("renders accessible navigation with Activities intentionally hidden", async () => {
  await withBuiltSite(async ({ read }) => {
    const home = await read("index.html");
    const research = await read("research.html");
    const activities = await read("activities.html");

    assert.match(
      home,
      /<nav id="site-nav" class="site-nav" aria-label="Primary navigation">[\s\S]*Home[\s\S]*About[\s\S]*Research[\s\S]*Contact[\s\S]*<\/nav>/,
    );
    assert.doesNotMatch(home, />Activities<\/a>/);
    assert.match(research, /href="research\.html" aria-current="page">Research<\/a>/);
    assert.match(activities, /<meta name="robots" content="noindex">/);
    assert.doesNotMatch(activities, />Activities<\/a>/);
  });
});

test("keeps hidden pages in the navigation configuration for future reuse", () => {
  assert.deepEqual(
    site.navigation.find((item) => item.page === "activities"),
    { label: "Activities", href: "activities.html", page: "activities", hidden: true },
  );
});

test("keeps browser JavaScript limited to progressive mobile navigation", async () => {
  const client = await readFile(new URL("../assets/script.js", import.meta.url), "utf8");

  assert.match(client, /aria-expanded/);
  assert.match(client, /classList\.toggle\("is-open"/);
  assert.match(client, /Escape/);
  assert.doesNotMatch(client, /siteContent/);
  assert.doesNotMatch(client, /replaceChildren/);
});

test("retains the editorial visual system and responsive accessibility safeguards", async () => {
  const css = await readFile(new URL("../assets/styles.css", import.meta.url), "utf8");

  for (const token of [
    "--background: #fcfcfb;",
    "--text: #20252b;",
    "--accent: #315f86;",
    'font-family: Georgia, "Times New Roman", serif;',
  ]) {
    assert.ok(css.includes(token), `${token} should remain part of the visual system`);
  }

  assert.match(css, /\.skip-link:focus/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("does not package the retired browser-side content database", async () => {
  await withBuiltSite(async ({ outputDir }) => {
    await assert.rejects(access(join(outputDir, "assets", "content.js")), { code: "ENOENT" });
  });
});

test("validates a generated site before it is deployed", async () => {
  const { validateSite } = await import("../scripts/validate.mjs");

  await withBuiltSite(async ({ outputDir }) => {
    await validateSite({ outputDir });
  });
});

test("emits deployable Pages metadata, sitemap, and cache-versioned shared assets", async () => {
  await withBuiltSite(async ({ outputDir, read }) => {
    await access(join(outputDir, "CNAME"));
    await access(join(outputDir, ".nojekyll"));

    const index = await read("index.html");
    const robots = await read("robots.txt");
    const sitemap = await read("sitemap.xml");

    assert.match(index, /assets\/styles\.css\?v=[a-f0-9]{12}/);
    assert.match(index, /assets\/script\.js\?v=[a-f0-9]{12}/);
    assert.match(index, /<link rel="canonical" href="https:\/\/zqian-chansen\.com\/">/);
    assert.match(robots, /Sitemap: https:\/\/zqian-chansen\.com\/sitemap\.xml/);
    assert.match(sitemap, /https:\/\/zqian-chansen\.com\/research\.html/);
    assert.doesNotMatch(sitemap, /activities\.html/);
  });
});

test("ships local images with intrinsic dimensions and lazy-loads non-critical paper artwork", async () => {
  await withBuiltSite(async ({ read }) => {
    const home = await read("index.html");
    const research = await read("research.html");

    assert.match(home, /<img class="home-portrait"[^>]*width="641"[^>]*height="617"[^>]*fetchpriority="high"/);
    assert.match(
      research,
      /width="2754" height="1536" loading="lazy" decoding="async"/,
    );
    assert.match(home, /src="assets\/img\/qz\.jpg\?v=[a-f0-9]{12}"/);
    assert.match(research, /src="assets\/img\/papers\/IESM\.png\?v=[a-f0-9]{12}"/);
    assert.match(research, /href="assets\/docs\/CV_ZhenQian\.pdf\?v=[a-f0-9]{12}"/);
    assert.doesNotMatch(research, /assets\/img\/papers\/IESM\.jpg/);
  });
});

test("defines a GitHub Actions workflow that verifies and deploys the generated site", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/deploy.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /branches:\s*\[master\]/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /path: dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
