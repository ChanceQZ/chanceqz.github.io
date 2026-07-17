import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import { site } from "../content/site.js";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "about.html",
  "research.html",
  "activities.html",
  "contact.html",
  "CNAME",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
];

function resolveOutputDirectory(outputDir) {
  if (outputDir instanceof URL) return fileURLToPath(outputDir);
  return resolve(outputDir);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function isLocalReference(reference) {
  return !(
    reference.startsWith("#") ||
    reference.startsWith("mailto:") ||
    reference.startsWith("tel:") ||
    reference.startsWith("http:") ||
    reference.startsWith("https:") ||
    reference.startsWith("//")
  );
}

function referencePath(reference) {
  return reference.split(/[?#]/, 1)[0];
}

async function validateHtmlFile(outputDir, file, errors) {
  const html = await readFile(join(outputDir, file), "utf8");

  if (!/<main id="main-content">[\s\S]+<\/main>/.test(html)) {
    errors.push(`${file} has no contentful main landmark.`);
  }
  if (html.includes("assets/content.js")) {
    errors.push(`${file} still references the retired browser-side content database.`);
  }

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (!isLocalReference(reference)) continue;

    const path = referencePath(reference);
    if (!path) continue;

    const target = resolve(outputDir, path);
    if (relative(outputDir, target).startsWith("..")) {
      errors.push(`${file} links outside the generated site: ${reference}`);
    } else if (!(await exists(target))) {
      errors.push(`${file} references a missing local file: ${reference}`);
    }
  }
}

export async function validateSite({ outputDir = join(rootDirectory, "dist") } = {}) {
  const destination = resolveOutputDirectory(outputDir);
  const errors = [];

  for (const file of requiredFiles) {
    if (!(await exists(join(destination, file)))) {
      errors.push(`Missing required deployment file: ${file}`);
    }
  }

  for (const file of requiredFiles.filter((file) => file.endsWith(".html"))) {
    if (await exists(join(destination, file))) {
      await validateHtmlFile(destination, file, errors);
    }
  }

  if (await exists(join(destination, "CNAME"))) {
    const cname = (await readFile(join(destination, "CNAME"), "utf8")).trim();
    if (cname !== new URL(site.domain).hostname) {
      errors.push(`CNAME must equal ${new URL(site.domain).hostname}.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Static-site validation failed:\n- ${errors.join("\n- ")}`);
  }

  return { outputDir: destination, pages: requiredFiles.filter((file) => file.endsWith(".html")) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateSite();
  console.log(`Validated ${result.pages.length} static pages in ${result.outputDir}`);
}
