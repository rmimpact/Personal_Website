#!/usr/bin/env node
// Generates a static, crawlable page per project (English + French) so that
// each project's link/social preview card shows its own banner image and
// description instead of the generic site preview.
//
// Social crawlers (Discord, iMessage, Slack, X, Facebook, LinkedIn...) do not
// run JavaScript, so the og:* / twitter:* tags have to already be in the
// HTML response for that URL. This script reads projects/projects.json and
// projects/projects.fr.json as the single source of truth and writes
// /projects/<id>/index.html and /fr/projects/<id>/index.html accordingly.
//
// Run this after editing either projects JSON file:
//   node generate-project-pages.js

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://remymoscovitz.com";
const ROOT = __dirname;
const ASSET_VERSION = "20260726-1";

function readProjects(file) {
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  return JSON.parse(raw);
}

function absoluteUrl(url) {
  if (/^https?:\/\//.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPage({ lang, project, canonicalPath, alternatePath, nav, ogLocale }) {
  const title = `${project.title} — Remy Moscovitz`;
  const description = escapeHtml(project.summary);
  const image = absoluteUrl(project.image || "/media/og-remy-portfolio.png");
  const imageAlt = escapeHtml(project.imageAlt || project.title);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const alternateUrl = `${SITE_URL}${alternatePath}`;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#060817">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="${nav.altHreflang}" href="${alternateUrl}">
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}/projects/${project.id}/">
  <link rel="icon" href="/media/rm_custom_icon.png" type="image/png">
  <title>${escapeHtml(title)}</title>

  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(project.title)}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Remy Moscovitz">
  <meta property="og:locale" content="${ogLocale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(project.title)}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">

  <script src="/language.js?v=${ASSET_VERSION}"></script>
  <link rel="stylesheet" href="/styles/site.css?v=${ASSET_VERSION}">
  <script src="/script.js?v=${ASSET_VERSION}" defer></script>
</head>
<body>
  <a class="skip-link" href="#main-content">${nav.skipLink}</a>
  <header class="site-header" data-site-header>
    <a class="brand" href="${nav.homeHref}" aria-label="Remy Moscovitz — ${nav.homeLabel}">
      <img src="/media/white_nav_icon.png" alt="" width="44" height="44">
      <span>Remy Moscovitz</span>
    </a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-button>
      <span class="sr-only">${nav.openNav}</span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="${nav.navLabel}" data-site-nav>
      ${nav.links}
      <a class="language-link" href="${alternatePath}" lang="${nav.altHreflang}" hreflang="${nav.altHreflang}" data-language-choice="${nav.altHreflang}" aria-label="${nav.altLabel}">${nav.altHreflang.toUpperCase()}</a>
    </nav>
  </header>

  <main id="main-content" class="project-detail section-shell">
    <a class="back-link" href="${nav.projectsIndexHref}"><span aria-hidden="true">←</span> ${nav.allProjects}</a>
    <article data-project-detail aria-live="polite">
      <p class="eyebrow">${nav.loadingEyebrow}</p>
      <h1>${nav.loadingHeading}</h1>
    </article>
  </main>

  <footer class="site-footer section-shell">
    <p>© <span data-current-year></span> Remy Moscovitz</p>
    <p><a href="${nav.projectsIndexHref}">${nav.projectIndexLink}</a></p>
  </footer>
</body>
</html>
`;
}

const EN_NAV = {
  skipLink: "Skip to content",
  homeHref: "/",
  homeLabel: "home",
  openNav: "Open navigation",
  navLabel: "Primary navigation",
  links: `<a href="/#about">About</a>
      <a href="/projects/" aria-current="page">Work</a>
      <a href="/#skills">Skills</a>
      <a href="/#setup">Setup</a>
      <a href="/#contact">Contact</a>`,
  altHreflang: "fr",
  altLabel: "View the site in French",
  projectsIndexHref: "/projects/",
  allProjects: "All projects",
  loadingEyebrow: "Loading project",
  loadingHeading: "Preparing the preview…",
  projectIndexLink: "Project index"
};

const FR_NAV = {
  skipLink: "Aller au contenu",
  homeHref: "/fr/",
  homeLabel: "accueil",
  openNav: "Ouvrir la navigation",
  navLabel: "Navigation principale",
  links: `<a href="/fr/#about">À propos</a>
      <a href="/fr/projects/" aria-current="page">Projets</a>
      <a href="/fr/#skills">Compétences</a>
      <a href="/fr/#setup">Setup</a>
      <a href="/fr/#contact">Contact</a>`,
  altHreflang: "en",
  altLabel: "Voir le site en anglais",
  projectsIndexHref: "/fr/projects/",
  allProjects: "Tous les projets",
  loadingEyebrow: "Chargement du projet",
  loadingHeading: "Préparation de l’aperçu…",
  projectIndexLink: "Index des projets"
};

function writePage(outputPath, contents) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, contents);
  console.log(`wrote ${path.relative(ROOT, outputPath)}`);
}

function pruneStaleDirs(baseDir, validIds) {
  if (!fs.existsSync(baseDir)) return;
  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || validIds.has(entry.name)) continue;
    const indexFile = path.join(baseDir, entry.name, "index.html");
    if (fs.existsSync(indexFile) && fs.readFileSync(indexFile, "utf8").includes("data-project-detail")) {
      fs.rmSync(path.join(baseDir, entry.name), { recursive: true, force: true });
      console.log(`removed stale ${path.relative(ROOT, path.join(baseDir, entry.name))}`);
    }
  }
}

function main() {
  const enProjects = readProjects("projects/projects.json");
  const frProjects = readProjects("projects/projects.fr.json");
  const frById = new Map(frProjects.map((project) => [project.id, project]));

  const enIds = new Set(enProjects.map((project) => project.id));

  for (const project of enProjects) {
    const frProject = frById.get(project.id) || project;

    const enHtml = renderPage({
      lang: "en",
      project,
      canonicalPath: `/projects/${project.id}/`,
      alternatePath: `/fr/projects/${project.id}/`,
      nav: EN_NAV,
      ogLocale: "en_US"
    });
    writePage(path.join(ROOT, "projects", project.id, "index.html"), enHtml);

    const frHtml = renderPage({
      lang: "fr",
      project: frProject,
      canonicalPath: `/fr/projects/${project.id}/`,
      alternatePath: `/projects/${project.id}/`,
      nav: FR_NAV,
      ogLocale: "fr_FR"
    });
    writePage(path.join(ROOT, "fr", "projects", project.id, "index.html"), frHtml);
  }

  pruneStaleDirs(path.join(ROOT, "projects"), enIds);
  pruneStaleDirs(path.join(ROOT, "fr", "projects"), enIds);
}

main();
