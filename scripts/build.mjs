import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { site } from "../content/site.js";
import { homePage } from "../pages/index.js";
import { aboutPage } from "../pages/about.js";
import { researchPage } from "../pages/research.js";
import { activitiesPage } from "../pages/activities.js";
import { contactPage } from "../pages/contact.js";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [homePage, aboutPage, researchPage, activitiesPage, contactPage];

function resolveOutputDirectory(outputDir) {
  if (outputDir instanceof URL) return fileURLToPath(outputDir);
  return resolve(outputDir);
}

async function listAssetFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listAssetFiles(path) : [path];
    }),
  );

  return files.flat();
}

async function createAssetVersion() {
  const hash = createHash("sha256");
  const files = (await listAssetFiles(join(rootDirectory, "assets"))).sort();

  for (const file of files) {
    hash.update(file.slice(rootDirectory.length));
    hash.update(await readFile(file));
  }

  return hash.digest("hex").slice(0, 12);
}

function createSitemap() {
  const urls = pages
    .filter((page) => page.robots !== "noindex")
    .map((page) => (page.output === "index.html" ? `${site.domain}/` : `${site.domain}/${page.output}`));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
}

function createRobotsFile() {
  return `User-agent: *
Allow: /

Sitemap: ${site.domain}/sitemap.xml
`;
}

export async function buildSite({ outputDir = join(rootDirectory, "dist") } = {}) {
  const destination = resolveOutputDirectory(outputDir);
  const assetVersion = await createAssetVersion();
  const hostname = new URL(site.domain).hostname;

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(join(rootDirectory, "assets"), join(destination, "assets"), { recursive: true });
  for (const page of pages) {
    await writeFile(join(destination, page.output), page.render({ assetVersion }), "utf8");
  }
  await writeFile(join(destination, "CNAME"), `${hostname}\n`, "utf8");
  await writeFile(join(destination, ".nojekyll"), "", "utf8");
  await writeFile(join(destination, "robots.txt"), createRobotsFile(), "utf8");
  await writeFile(join(destination, "sitemap.xml"), createSitemap(), "utf8");

  return destination;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const destination = await buildSite();
  console.log(`Built static site in ${destination}`);
}
