const IS_FRENCH = document.documentElement.lang.toLowerCase().startsWith("fr");
const PROJECTS_ENDPOINT = IS_FRENCH ? "/projects/projects.fr.json" : "/projects/projects.json";
const PROJECT_DETAIL_PATH = IS_FRENCH ? "/fr/projects/ProjectInfo.html" : "/projects/ProjectInfo.html";
const PROJECT_INDEX_PATH = IS_FRENCH ? "/fr/projects/" : "/projects/";

const UI_TEXT = IS_FRENCH ? {
  openNavigation: "Ouvrir la navigation",
  closeNavigation: "Fermer la navigation",
  viewProject: "Voir le projet",
  preview: "Aperçu",
  projectsError: "Impossible de charger les projets pour le moment. Veuillez actualiser la page.",
  livePreview: "Aperçu du site en direct",
  openWebsite: "Ouvrir le site complet ↗",
  websiteTitle: "site web",
  projectNotFound: "Projet introuvable",
  projectMissingTitle: "Ce projet n’est pas disponible.",
  projectMissingText: "Choisissez l’un des trois projets actuels dans l’index des projets.",
  viewProjects: "Voir les projets",
  selectedProject: "Projet sélectionné",
  projectStory: "À propos du projet",
  whatIBuilt: "Ce que j’ai réalisé.",
  backToProjects: "Retour à tous les projets",
  genericError: "Un problème est survenu",
  loadErrorTitle: "Impossible de charger ce projet.",
  loadErrorText: "Veuillez actualiser la page ou revenir à l’index des projets."
} : {
  openNavigation: "Open navigation",
  closeNavigation: "Close navigation",
  viewProject: "View project",
  preview: "preview",
  projectsError: "The projects could not be loaded just now. Please refresh the page.",
  livePreview: "Live website preview",
  openWebsite: "Open full website ↗",
  websiteTitle: "website",
  projectNotFound: "Project not found",
  projectMissingTitle: "That project isn’t here.",
  projectMissingText: "Choose one of the three current projects from the project index.",
  viewProjects: "View projects",
  selectedProject: "Selected project",
  projectStory: "Project story",
  whatIBuilt: "What I built.",
  backToProjects: "Back to all projects",
  genericError: "Something went wrong",
  loadErrorTitle: "This project could not be loaded.",
  loadErrorText: "Please refresh the page or return to the project index."
};

function setupNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-site-nav]");

  if (!button || !navigation) return;

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
    const label = button.querySelector(".sr-only");
    if (label) label.textContent = UI_TEXT.openNavigation;
  };

  button.addEventListener("click", () => {
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(willOpen));
    navigation.dataset.open = String(willOpen);
    const label = button.querySelector(".sr-only");
    if (label) label.textContent = willOpen ? UI_TEXT.closeNavigation : UI_TEXT.openNavigation;
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

async function fetchProjects() {
  const response = await fetch(PROJECTS_ENDPOINT);
  if (!response.ok) throw new Error("Could not load project data");
  return response.json();
}

function applyImageFallback(image, container, label) {
  image.addEventListener("error", () => {
    image.remove();
    container.classList.add("project-card__media--fallback");
    container.textContent = label;
  }, { once: true });
}

function createProjectCard(project) {
  const card = document.createElement("a");
  card.className = "project-card";
  card.href = `${PROJECT_DETAIL_PATH}?id=${encodeURIComponent(project.id)}`;
  card.setAttribute("aria-label", `${UI_TEXT.viewProject} ${project.title}`);

  const media = document.createElement("div");
  media.className = "project-card__media";

  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.loading = "lazy";
    image.decoding = "async";
    applyImageFallback(image, media, `${UI_TEXT.preview} ${project.title}`);
    media.appendChild(image);
  } else {
    media.classList.add("project-card__media--fallback");
    media.textContent = `${UI_TEXT.preview} ${project.title}`;
  }

  const body = document.createElement("div");
  body.className = "project-card__body";

  const eyebrow = document.createElement("p");
  eyebrow.className = "project-card__eyebrow";
  eyebrow.textContent = project.eyebrow;

  const title = document.createElement("h3");
  title.textContent = project.title;

  const summary = document.createElement("p");
  summary.className = "project-card__summary";
  summary.textContent = project.summary;

  const footer = document.createElement("div");
  footer.className = "project-card__footer";
  footer.innerHTML = `<span>${project.tags.slice(0, 2).join(" · ")}</span><span class="project-card__arrow" aria-hidden="true">→</span>`;

  body.append(eyebrow, title, summary, footer);
  card.append(media, body);
  return card;
}

async function renderProjectGrids() {
  const grids = document.querySelectorAll("[data-project-grid]");
  if (!grids.length) return;

  try {
    const projects = await fetchProjects();
    grids.forEach((grid) => {
      const limit = Number(grid.dataset.projectLimit) || projects.length;
      grid.replaceChildren(...projects.slice(0, limit).map(createProjectCard));
    });
  } catch (error) {
    grids.forEach((grid) => {
      const message = document.createElement("p");
      message.className = "error-message";
      message.textContent = UI_TEXT.projectsError;
      grid.replaceChildren(message);
    });
  }
}

function createProjectVisual(project) {
  if (project.preview?.type === "iframe" && project.preview.url) {
    const preview = document.createElement("section");
    preview.className = "live-preview";
    preview.setAttribute("aria-label", `${project.title} live website preview`);

    const bar = document.createElement("div");
    bar.className = "live-preview__bar";
    bar.innerHTML = `<span>${UI_TEXT.livePreview}</span><a href="${project.preview.url}" target="_blank" rel="noopener noreferrer">${UI_TEXT.openWebsite}</a>`;

    const frame = document.createElement("iframe");
    frame.src = project.preview.url;
    frame.title = `${project.title} ${UI_TEXT.websiteTitle}`;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute("sandbox", "allow-forms allow-popups allow-same-origin allow-scripts");

    preview.append(bar, frame);
    return preview;
  }

  const visual = document.createElement("div");
  visual.className = "project-visual";

  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      visual.classList.add("project-visual--fallback");
      visual.textContent = project.title;
    }, { once: true });
    visual.appendChild(image);
  } else {
    visual.classList.add("project-visual--fallback");
    visual.textContent = project.title;
  }

  return visual;
}

function createProjectLink(link) {
  const anchor = document.createElement("a");
  anchor.className = `button ${link.primary ? "button--primary" : "button--secondary"}`;
  anchor.href = link.url;
  anchor.textContent = link.label;

  if (/^https?:\/\//.test(link.url)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  return anchor;
}

async function renderProjectDetail() {
  const root = document.querySelector("[data-project-detail]");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id");

  try {
    const projects = await fetchProjects();
    const project = projects.find((item) => item.id === id);

    if (!project) {
      root.innerHTML = `<p class="eyebrow">${UI_TEXT.projectNotFound}</p><h1>${UI_TEXT.projectMissingTitle}</h1><p class="project-page-intro">${UI_TEXT.projectMissingText}</p><div class="button-row"><a class="button button--primary" href="${PROJECT_INDEX_PATH}">${UI_TEXT.viewProjects}</a></div>`;
      document.title = `${UI_TEXT.projectNotFound} — Remy Moscovitz`;
      return;
    }

    document.title = `${project.title} — Remy Moscovitz`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = project.summary;

    const header = document.createElement("header");
    header.className = "project-detail__header";
    header.innerHTML = `
      <div>
        <p class="eyebrow">${project.eyebrow}</p>
        <h1>${project.title}</h1>
        <p class="project-page-intro">${project.summary}</p>
      </div>
      <aside class="project-detail__meta">
        <ul class="tag-list">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
        <p>${project.year} · ${UI_TEXT.selectedProject}</p>
      </aside>`;

    const copy = document.createElement("section");
    copy.className = "project-copy-grid";
    copy.innerHTML = `<div><p class="eyebrow">${UI_TEXT.projectStory}</p><h2>${UI_TEXT.whatIBuilt}</h2><p class="project-description">${project.description}</p></div>`;

    const actions = document.createElement("div");
    actions.className = "project-actions";
    (project.links || []).forEach((link) => actions.appendChild(createProjectLink(link)));
    actions.appendChild(createProjectLink({ label: UI_TEXT.backToProjects, url: PROJECT_INDEX_PATH, primary: false }));
    copy.appendChild(actions);

    root.replaceChildren(header, createProjectVisual(project), copy);
  } catch (error) {
    root.innerHTML = `<p class="eyebrow">${UI_TEXT.genericError}</p><h1>${UI_TEXT.loadErrorTitle}</h1><p class="project-page-intro">${UI_TEXT.loadErrorText}</p><div class="button-row"><a class="button button--primary" href="${PROJECT_INDEX_PATH}">${UI_TEXT.viewProjects}</a></div>`;
  }
}

setupNavigation();
setCurrentYear();
renderProjectGrids();
renderProjectDetail();
