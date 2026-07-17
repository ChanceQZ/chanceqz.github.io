# Static Site Build Refactor

Date: 2026-07-17  
Owner: Zhen Qian  
Target: `/Users/zhenqian/Documents/Blog`

## Goal

Refactor the academic website into a lightweight, build-generated static site. Preserve the current editorial visual design and existing public copy while improving resilience, search visibility, image delivery, testing, deployment, and support for future site modules.

## Non-goals

- Do not migrate to React, Next.js, Astro, or another framework.
- Do not redesign the visual language, information hierarchy, or existing public copy except for required metadata and accessibility fixes.
- Do not activate GoatCounter yet. Leave a blank, documented configuration field for the future site code.
- Do not make Activities visible in primary navigation.

## Architecture

`Blog` becomes the only source of truth. A small Node.js build script converts structured content and page definitions into complete static HTML files in `dist/`. The public pages must contain usable navigation, main content, and footer before JavaScript runs.

Browser JavaScript is limited to progressive enhancement:

- Accessible mobile navigation.
- Optional future analytics snippet loading.

The build receives content from focused modules:

```text
content/
  site.js          Shared profile, navigation, SEO defaults, analytics config
  home.js          Home-page content
  about.js         About-page content
  research.js      Directions, featured papers, academic links
  activities.js    Historical activity data
  contact.js       Contact content
templates/
  layout.js        Document shell, head metadata, header, footer
pages/
  index.js         Home page definition
  about.js         About page definition
  research.js      Research page definition
  activities.js    Activities page definition
  contact.js       Contact page definition
scripts/
  build.mjs        Generates dist/
  validate.mjs     Validates generated HTML, assets, and internal links
assets/
  styles.css       Existing editorial styles with focused performance fixes
  script.js        Mobile menu and optional analytics enhancement
  img/             Source image assets and optimized web images
  docs/            CV and other public documents
dist/              Generated deployment output; never hand-edited
tests/             Node built-in test-runner tests
```

## Content and Page Rules

- Every visible page has a page-specific title, meta description, canonical URL, Open Graph metadata, and a single `h1`.
- The body uses complete semantic landmarks, a skip link, a static navigation list, and a static footer.
- Chinese name text is marked with `lang="zh"` where rendered.
- `activities.html` remains generated and reachable by direct URL, but carries `noindex` until deliberately restored to navigation.
- Research data remains editable without touching HTML templates.
- New modules such as Publications, Writing, Teaching, Software and Data, or Media are added through a content module plus a page definition rather than copying a page skeleton.

## Analytics

`content/site.js` includes:

```js
analytics: {
  provider: "goatcounter",
  site: "",
}
```

When `site` is blank, the build must not output an analytics script. When it contains a GoatCounter site identifier, the shared layout emits the official GoatCounter snippet once per generated page. A future privacy page can describe the enabled provider without changing application logic.

## Performance and Stability

- Project images are served in suitable web dimensions and with correct file extensions and MIME types.
- Below-the-fold paper images use `loading="lazy"` and `decoding="async"` with intrinsic width and height.
- Generated assets use a build version or content hash so browser caches do not mix old and new script/content versions.
- The build rejects unknown page definitions, missing assets, invalid internal links, and empty required SEO fields.
- The deployment output includes `CNAME` for `zqian-chansen.com` and `.nojekyll`.

## Testing and Deployment

Tests use Node's built-in test runner and cover:

- Content-model shape and navigation visibility.
- Build output for all pages.
- SEO metadata, canonical URLs, `noindex`, and language annotations.
- Internal page, image, CV, and stylesheet paths.
- Analytics is absent when unconfigured and appears once when configured.

GitHub Actions runs tests, validation, and the build on every push. A successful push publishes only `dist/` to the GitHub Pages deployment target. This removes the manual copying workflow between `Blog` and `chanceqz.github.io`.

## Acceptance Criteria

1. Disabling JavaScript still leaves each page usable and readable.
2. The live site preserves the existing editorial appearance and current visible content.
3. `Blog` is the only edited source directory.
4. A single documented command validates and builds the site locally.
5. A single push deploys a tested static build to the existing custom domain.
6. GoatCounter remains disabled until Zhen supplies a site identifier.
7. Future modules can be added with new content and page modules, without duplicating global layout markup.
