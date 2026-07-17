# Zhen Qian Academic Site

This repository builds the static site for [zqian-chansen.com](https://zqian-chansen.com).

## Edit the site

Do not edit `dist/`: it is rebuilt automatically. Edit the source instead:

- `content/`: page text, research projects, navigation, and site-wide settings.
- `pages/`: page-specific static HTML rendering.
- `templates/layout.js`: shared document shell, navigation, metadata, and analytics hook.
- `assets/`: styles, lightweight browser behavior, images, and downloadable files.

For a routine text or image update, edit the relevant file in `content/` or `assets/`, then run:

```bash
npm run check
```

This runs tests, rebuilds `dist/`, and validates local links and deployment metadata.

## Add a future module

1. Add structured content in `content/`, if the module needs it.
2. Create a renderer in `pages/` using `renderLayout` from `templates/layout.js`.
3. Add the page object to the `pages` list in `scripts/build.mjs`.
4. Add a navigation item in `content/site.js` when the page should appear in the header. Use `hidden: true` to keep a page published but out of the navigation.
5. Add an appropriate static-build test in `tests/site.test.mjs`.

`Activities` follows this pattern: it remains built at `activities.html`, is excluded from search indexing, and can be reintroduced to the navigation by removing `hidden: true` from `content/site.js`.

## Analytics

The GoatCounter hook is intentionally inactive. After creating an account, set `site.analytics.site` in `content/site.js` to the GoatCounter site identifier. The build will then emit the official analytics script; no tracking script is included while the value is blank.

## Deployment

The workflow in `.github/workflows/deploy.yml` tests, builds, validates, and publishes the generated `dist/` artifact whenever `master` changes. In the GitHub repository, set **Settings → Pages → Source** to **GitHub Actions** before the first deployment using this workflow.
