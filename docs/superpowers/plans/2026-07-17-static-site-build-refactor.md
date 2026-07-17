# Static Site Build Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the academic homepage into a build-generated, SEO-ready static site with one canonical source repository, automated GitHub Pages deployment, and an inactive GoatCounter configuration slot.

**Architecture:** Structured content modules and page renderers generate complete HTML documents into `dist/` using Node.js only. Browser JavaScript becomes a small progressive-enhancement layer for the mobile menu. The existing Pages repository history is retained by making its working tree the new `/Users/zhenqian/Documents/Blog` source directory; GitHub Actions validates and deploys the generated artifact.

**Tech Stack:** Node.js built-in modules and test runner, semantic HTML, CSS, browser JavaScript, GitHub Actions, GitHub Pages.

---

## File Structure

- Create: `package.json` — one-command local test, build, validation, and preview commands.
- Create: `.gitignore` — ignores generated output, macOS files, and brainstorming state.
- Create: `content/site.js` — shared profile, visible navigation, SEO defaults, canonical URL, and disabled analytics config.
- Create: `content/home.js`, `content/about.js`, `content/research.js`, `content/activities.js`, `content/contact.js` — page-specific editable content.
- Create: `templates/layout.js` — escaping, head metadata, static header, footer, analytics tag, and document wrapper.
- Create: `pages/index.js`, `pages/about.js`, `pages/research.js`, `pages/activities.js`, `pages/contact.js` — page-specific semantic markup and metadata.
- Create: `scripts/build.mjs` — builds complete HTML, copies public assets, writes `CNAME`, `.nojekyll`, `robots.txt`, and `sitemap.xml`.
- Create: `scripts/validate.mjs` — verifies generated documents, required assets, and internal links.
- Create: `.github/workflows/deploy.yml` — test, build, validate, and deploy `dist/` through GitHub Pages.
- Modify: `assets/styles.css` — retain editorial design while supporting static markup, lazy images, and an accessible hidden-name utility.
- Modify: `assets/script.js` — retain only mobile-menu behavior.
- Move: `assets/img/papers/IESM.jpg` to `assets/img/papers/IESM.png` when its actual file type is confirmed as PNG.
- Remove: `assets/content.js`, root-level `index.html`, `about.html`, `research.html`, `activities.html`, and `contact.html` after build-output tests replace their source role.
- Replace: `tests/site.test.mjs` with tests for content, build output, validation, analytics configuration, and static fallback.

### Task 1: Preserve the Existing Pages History and Establish the Canonical Source Checkout

**Files:**
- Move: `/Users/zhenqian/Documents/Blog` to a timestamped backup directory.
- Move: `/Users/zhenqian/Documents/chanceqz.github.io` to `/Users/zhenqian/Documents/Blog`.
- Copy: refactor source files from the timestamped backup into the new Git checkout, excluding `.git` and macOS metadata.

- [ ] **Step 1: Inspect the release repository before moving anything**

Run:

```bash
git -C /Users/zhenqian/Documents/chanceqz.github.io status --short --branch
git -C /Users/zhenqian/Documents/chanceqz.github.io remote -v
```

Expected: `master...origin/master` with only untracked `.DS_Store` files and `origin` set to `git@github.com:ChanceQZ/chanceqz.github.io.git`.

- [ ] **Step 2: Create a timestamped source backup without deleting either directory**

Run the following commands as separate filesystem operations:

```bash
mv /Users/zhenqian/Documents/Blog /Users/zhenqian/Documents/Blog-source-backup-2026-07-17
mv /Users/zhenqian/Documents/chanceqz.github.io /Users/zhenqian/Documents/Blog
```

Expected: `/Users/zhenqian/Documents/Blog` contains the existing Pages Git checkout, and `/Users/zhenqian/Documents/Blog-source-backup-2026-07-17` preserves the complete pre-refactor source directory.

- [ ] **Step 3: Copy the source files into the preserved Git checkout**

Run:

```bash
rsync -a --exclude .git --exclude .DS_Store /Users/zhenqian/Documents/Blog-source-backup-2026-07-17/ /Users/zhenqian/Documents/Blog/
```

Expected: the new `Blog` directory contains the former source files plus the original repository `.git` directory and remote history.

- [ ] **Step 4: Verify the new working directory and baseline tests**

Run:

```bash
git -C /Users/zhenqian/Documents/Blog status --short --branch
node --test /Users/zhenqian/Documents/Blog/tests/site.test.mjs
```

Expected: Git recognises the new `Blog` directory as the Pages repository and the pre-refactor suite passes before code changes.

- [ ] **Step 5: Commit the source migration marker**

Run:

```bash
git -C /Users/zhenqian/Documents/Blog add docs/superpowers
git -C /Users/zhenqian/Documents/Blog commit -m "docs: add static-site refactor specification"
```

Expected: the existing Pages history is retained and the approved specification is tracked.

### Task 2: Add a Dependency-Free Build Contract and Failing Tests

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write failing build-contract tests**

Replace the renderer-string assertions with tests that import a future `buildSite` function and require complete documents without evaluating browser JavaScript:

```js
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "../scripts/build.mjs";

test("builds usable static page content without browser JavaScript", async () => {
  const outputDir = await mkdtemp(join(tmpdir(), "zqian-site-"));
  await buildSite({ outputDir });
  const html = await readFile(join(outputDir, "research.html"), "utf8");

  assert.match(html, /<nav id="site-nav" class="site-nav" aria-label="Primary navigation">/);
  assert.match(html, /<h1>Research<\/h1>/);
  assert.match(html, /Featured papers/);
  assert.doesNotMatch(html, /assets\/content\.js/);
  await rm(outputDir, { recursive: true, force: true });
});

test("does not emit GoatCounter when its site identifier is blank", async () => {
  const outputDir = await mkdtemp(join(tmpdir(), "zqian-site-"));
  await buildSite({ outputDir });
  const html = await readFile(join(outputDir, "index.html"), "utf8");

  assert.doesNotMatch(html, /gc\.zgo\.at\/count\.js/);
  await rm(outputDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: failure with `ERR_MODULE_NOT_FOUND` for `scripts/build.mjs`, proving the new tests target the missing build behavior.

- [ ] **Step 3: Add package scripts and generated-file rules**

Create `package.json`:

```json
{
  "name": "zhen-qian-academic-site",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/site.test.mjs",
    "build": "node scripts/build.mjs",
    "validate": "node scripts/validate.mjs",
    "check": "npm run test && npm run build && npm run validate"
  }
}
```

Create `.gitignore`:

```gitignore
dist/
.DS_Store
.superpowers/
Blog-source-backup-*/
```

- [ ] **Step 4: Commit the test contract and project commands**

Run:

```bash
git add package.json .gitignore tests/site.test.mjs
git commit -m "test: define static build contract"
```

Expected: test suite remains red only because the builder does not yet exist.

### Task 3: Split Editable Content into Focused Modules

**Files:**
- Create: `content/site.js`
- Create: `content/home.js`
- Create: `content/about.js`
- Create: `content/research.js`
- Create: `content/activities.js`
- Create: `content/contact.js`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write failing content-model tests**

Add tests that require the canonical site fields and research-image metadata:

```js
import { site } from "../content/site.js";
import { research } from "../content/research.js";

test("defines disabled GoatCounter configuration in shared site content", () => {
  assert.deepEqual(site.analytics, { provider: "goatcounter", site: "" });
});

test("defines complete intrinsic image dimensions for featured papers", () => {
  for (const paper of research.projects) {
    assert.ok(Number.isInteger(paper.image.width));
    assert.ok(Number.isInteger(paper.image.height));
    assert.match(paper.image.src, /^assets\/img\/papers\//);
  }
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: failure because content modules do not exist yet.

- [ ] **Step 3: Create the content modules from the current approved content**

Create `content/site.js` with visible navigation, canonical domain, copyright text, profile fields, and disabled analytics:

```js
export const site = {
  name: "Zhen Qian",
  nativeName: "钱 振",
  domain: "https://zqian-chansen.com",
  email: "zhen.qian@tum.de",
  footerText: "Zhen Qian",
  navigation: [
    { label: "Home", href: "index.html", page: "home" },
    { label: "About", href: "about.html", page: "about" },
    { label: "Research", href: "research.html", page: "research" },
    { label: "Contact", href: "contact.html", page: "contact" }
  ],
  analytics: { provider: "goatcounter", site: "" }
};
```

Move the current approved page copy from `assets/content.js` into its corresponding named export. In `content/research.js`, preserve the four existing papers and store each image as:

```js
image: {
  src: "assets/img/papers/climate-system.jpg",
  alt: "Reconstructed global historical climate fields",
  width: 2754,
  height: 1536
}
```

Use the measured dimensions for every image. Change the Iterative Earth System Modeling image path to `assets/img/papers/IESM.png` only after its binary file has been renamed to the matching PNG extension.

Set the activities page definition to `hidden: true` and preserve the historical entries in reverse chronological order.

- [ ] **Step 4: Run the content tests and verify GREEN**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: content-model tests pass; builder-contract tests remain red until the builder is implemented.

- [ ] **Step 5: Commit content modularisation**

Run:

```bash
git add content tests/site.test.mjs assets/img/papers/IESM.png
git rm assets/img/papers/IESM.jpg
git commit -m "refactor: split site content into page modules"
```

Expected: approved content is separated from rendering code and remains easy to edit.

### Task 4: Build Complete Static Documents

**Files:**
- Create: `templates/layout.js`
- Create: `pages/index.js`
- Create: `pages/about.js`
- Create: `pages/research.js`
- Create: `pages/activities.js`
- Create: `pages/contact.js`
- Create: `scripts/build.mjs`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write failing metadata and no-JavaScript tests**

Add tests for all generated pages:

```js
test("builds page-specific SEO metadata and static semantic landmarks", async () => {
  const outputDir = await mkdtemp(join(tmpdir(), "zqian-site-"));
  await buildSite({ outputDir });

  for (const page of ["index.html", "about.html", "research.html", "activities.html", "contact.html"]) {
    const html = await readFile(join(outputDir, page), "utf8");
    assert.match(html, /<link rel="canonical" href="https:\/\/zqian-chansen\.com\//);
    assert.match(html, /<header class="site-header">/);
    assert.match(html, /<main id="main-content">[\s\S]+<\/main>/);
    assert.match(html, /<footer class="site-footer">/);
  }

  const activities = await readFile(join(outputDir, "activities.html"), "utf8");
  assert.match(activities, /<meta name="robots" content="noindex">/);
  await rm(outputDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: failure because the builder cannot yet produce static semantic pages.

- [ ] **Step 3: Implement a safe shared layout**

Create `templates/layout.js` with an `escapeHtml` function and `renderLayout` function. The layout must:

- Escape all text content interpolated from data modules.
- Render the static primary navigation with `aria-current="page"`.
- Add a page-specific title, description, canonical URL, Open Graph title/description/url/type metadata, viewport, and stylesheet link.
- Render `<span lang="zh">钱 振</span>` for the Chinese name.
- Emit no analytics script when `site.analytics.site` is empty.
- Emit this exact GoatCounter shape only when a non-empty site identifier is present:

```html
<script data-goatcounter="https://SITE.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
```

- [ ] **Step 4: Implement focused page renderers**

Each `pages/*.js` module exports an object with `output`, `title`, `description`, `robots`, and `render` fields. `render` returns semantic markup for that page only.

For Research, render project images with:

```html
<img class="project-image" src="..." alt="..." width="2754" height="1536" loading="lazy" decoding="async">
```

Mark only the portrait image as `fetchpriority="high"`; do not lazily load it.

For Activities, include complete timeline content but retain `robots: "noindex"` and keep it out of `site.navigation`.

- [ ] **Step 5: Implement the build script**

Export this callable contract from `scripts/build.mjs`:

```js
export async function buildSite({ outputDir = new URL("../dist/", import.meta.url) } = {}) {
  const destination = fileURLToPath(outputDir);
  const assetVersion = await assetDigest(["assets/styles.css", "assets/script.js"]);

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp("assets", join(destination, "assets"), { recursive: true });

  for (const page of pages) {
    const html = renderLayout({ page, assetVersion });
    await writeFile(join(destination, page.output), html, "utf8");
  }

  await Promise.all([
    writeFile(join(destination, "CNAME"), "zqian-chansen.com\\n", "utf8"),
    writeFile(join(destination, ".nojekyll"), "", "utf8"),
    writeFile(join(destination, "robots.txt"), "User-agent: *\\nAllow: /\\nSitemap: https://zqian-chansen.com/sitemap.xml\\n", "utf8"),
    writeFile(join(destination, "sitemap.xml"), renderSitemap(pages), "utf8")
  ]);

  return destination;
}
```

Import `cp`, `mkdir`, `rm`, and `writeFile` from `node:fs/promises`; `createHash` from `node:crypto`; `fileURLToPath` from `node:url`; and `join` from `node:path`. Define `pages` as the five imported page definitions. When executed directly, call `buildSite()` and print the absolute output directory. `assetDigest` reads `assets/styles.css` and `assets/script.js` in a stable order, feeds both buffers into `createHash("sha256")`, and returns the first 12 hexadecimal characters for the generated CSS and JavaScript query strings.

- [ ] **Step 6: Run all tests and a real build to verify GREEN**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and `dist/` contains five complete HTML pages, `assets/`, `CNAME`, `.nojekyll`, `robots.txt`, and `sitemap.xml`.

- [ ] **Step 7: Commit the static document generator**

Run:

```bash
git add templates pages scripts content tests package.json
git commit -m "feat: generate static academic site pages"
```

### Task 5: Retain Visual Design with Progressive Enhancement and Correct Asset Delivery

**Files:**
- Modify: `assets/styles.css`
- Modify: `assets/script.js`
- Modify: `tests/site.test.mjs`
- Remove: `assets/content.js`
- Remove: root-level `index.html`, `about.html`, `research.html`, `activities.html`, `contact.html`

- [ ] **Step 1: Write failing interaction and performance tests**

Add source tests that require the progressively enhanced menu and generated image attributes:

```js
test("keeps browser JavaScript limited to mobile navigation", async () => {
  const client = await readFile(new URL("../assets/script.js", import.meta.url), "utf8");
  assert.match(client, /aria-expanded/);
  assert.match(client, /classList\.toggle\("is-open"/);
  assert.doesNotMatch(client, /siteContent/);
  assert.doesNotMatch(client, /replaceChildren/);
});

test("uses lazy asynchronous loading for paper images", async () => {
  const outputDir = await mkdtemp(join(tmpdir(), "zqian-site-"));
  await buildSite({ outputDir });
  const research = await readFile(join(outputDir, "research.html"), "utf8");
  assert.match(research, /class="project-image"[^>]*loading="lazy"[^>]*decoding="async"/);
  await rm(outputDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npm test
```

Expected: failure because the old client renderer still references `siteContent` and produces no static image-loading attributes.

- [ ] **Step 3: Reduce client JavaScript to the accessible menu**

Replace `assets/script.js` with menu-only behavior:

```js
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}
```

- [ ] **Step 4: Make only targeted CSS changes**

Keep the editorial palette, typography, desktop layout, and responsive breakpoints. Add only:

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Preserve all existing `.site-nav.is-open`, focus, reduced-motion, image, research-row, and mobile rules. Do not introduce cards, shadows, gradients, or new design systems.

- [ ] **Step 5: Remove the obsolete client-rendered source files**

Run:

```bash
git rm assets/content.js index.html about.html research.html activities.html contact.html
```

Expected: source HTML cannot be accidentally edited instead of generated output.

- [ ] **Step 6: Run tests, build, and inspect generated output**

Run:

```bash
npm run check
rg -n "siteContent|replaceChildren|assets/content\.js" dist assets/script.js
```

Expected: tests, build, and validation succeed; the final search returns no matches.

- [ ] **Step 7: Commit progressive enhancement and asset changes**

Run:

```bash
git add assets tests
git commit -m "refactor: make static pages progressively enhanced"
```

### Task 6: Add Generated-Output Validation and Deployment Workflow

**Files:**
- Create: `scripts/validate.mjs`
- Create: `.github/workflows/deploy.yml`
- Modify: `tests/site.test.mjs`

- [ ] **Step 1: Write failing validation tests**

Add a test that builds to a temporary output directory and verifies the validator succeeds for the generated site:

```js
import { validateSite } from "../scripts/validate.mjs";

test("validates all generated pages and their internal assets", async () => {
  const outputDir = await mkdtemp(join(tmpdir(), "zqian-site-"));
  await buildSite({ outputDir });
  await assert.doesNotReject(() => validateSite({ outputDir }));
  await rm(outputDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test
```

Expected: failure with `ERR_MODULE_NOT_FOUND` for `scripts/validate.mjs`.

- [ ] **Step 3: Implement generated-site validation**

Export:

```js
export async function validateSite({ outputDir = new URL("../dist/", import.meta.url) } = {})
```

The validator must check:

- All five expected HTML files exist.
- Every HTML file has title, meta description, canonical URL, one `h1`, header, main, footer, stylesheet reference, and menu script reference.
- `activities.html` has `noindex`; the other four pages do not.
- Every local `href` and `src` path in generated HTML resolves within `outputDir`.
- `CNAME`, `.nojekyll`, `robots.txt`, and `sitemap.xml` exist.
- GoatCounter is absent because the configured site identifier is blank.

When executed directly, validate `dist/`, print a success message, and exit non-zero with a precise error for the first invalid item.

- [ ] **Step 4: Add GitHub Pages workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and deploy site

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm run check
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 5: Run the full local verification suite**

Run:

```bash
npm run check
git status --short
```

Expected: all tests and output validation pass; only intentional source, workflow, and documentation changes are staged or unstaged.

- [ ] **Step 6: Commit deployment automation**

Run:

```bash
git add scripts .github tests package.json
git commit -m "ci: validate and deploy static site"
```

### Task 7: Activate the New Source and Verify the Public Deployment

**Files:**
- Modify: GitHub Pages repository setting from branch deployment to GitHub Actions deployment.
- Modify: `README.md` if needed to document commands and the one-time Pages setting.

- [ ] **Step 1: Add concise contributor instructions**

Create `README.md` with this exact local workflow:

````markdown
# Zhen Qian Academic Site

## Edit and verify locally

```bash
npm run check
```

## Preview the generated site

```bash
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`.

## GoatCounter

Set `site.analytics.site` in `content/site.js` to the GoatCounter site identifier only after it has been registered. An empty string disables analytics.
````

- [ ] **Step 2: Commit and push the source repository**

Run:

```bash
git add README.md
git commit -m "docs: document site maintenance workflow"
git push origin master
```

Expected: GitHub Actions starts the `Build and deploy site` workflow.

- [ ] **Step 3: Set GitHub Pages source to GitHub Actions once**

In the GitHub repository, open `Settings` → `Pages`, set `Source` to `GitHub Actions`, and save. Do not remove the custom domain or HTTPS setting.

- [ ] **Step 4: Verify the deployed site**

Check `https://zqian-chansen.com/`, `/research.html`, `/activities.html`, and mobile navigation. Confirm that Activities does not appear in navigation and that generated pages show content with JavaScript disabled.

- [ ] **Step 5: Commit the final deployment-state documentation if it changed**

Run:

```bash
git status --short
```

Expected: a clean working tree, excluding ignored macOS and generated files.

## Plan Self-Review

- Spec coverage: Tasks 1–7 cover canonical source migration, static rendering, content modules, SEO, analytics placeholder, performance, validation, GitHub Actions, and public deployment.
- Placeholder scan: no deferred implementation language or unspecified code paths are used.
- Type consistency: `buildSite`, `validateSite`, `site.analytics`, `outputDir`, and the `dist/` deployment directory use the same names throughout.
