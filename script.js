const PROJECTS_ENDPOINT = "/projects/projects.json";

function setupNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-site-nav]");

  if (!button || !navigation) return;

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
    const label = button.querySelector(".sr-only");
    if (label) label.textContent = "Open navigation";
  };

  button.addEventListener("click", () => {
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(willOpen));
    navigation.dataset.open = String(willOpen);
    const label = button.querySelector(".sr-only");
    if (label) label.textContent = willOpen ? "Close navigation" : "Open navigation";
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
  card.href = `/projects/ProjectInfo.html?id=${encodeURIComponent(project.id)}`;
  card.setAttribute("aria-label", `View ${project.title} project`);

  const media = document.createElement("div");
  media.className = "project-card__media";

  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.loading = "lazy";
    image.decoding = "async";
    applyImageFallback(image, media, `${project.title} preview`);
    media.appendChild(image);
  } else {
    media.classList.add("project-card__media--fallback");
    media.textContent = `${project.title} preview`;
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
      message.textContent = "The projects could not be loaded just now. Please refresh the page.";
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
    bar.innerHTML = `<span>Live website preview</span><a href="${project.preview.url}" target="_blank" rel="noopener noreferrer">Open full website ↗</a>`;

    const frame = document.createElement("iframe");
    frame.src = project.preview.url;
    frame.title = `${project.title} website`;
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
      root.innerHTML = `<p class="eyebrow">Project not found</p><h1>That project isn’t here.</h1><p class="project-page-intro">Choose one of the three current projects from the project index.</p><div class="button-row"><a class="button button--primary" href="/projects/">View projects</a></div>`;
      document.title = "Project not found — Remy Moscovitz";
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
        <p>${project.year} · Selected project</p>
      </aside>`;

    const copy = document.createElement("section");
    copy.className = "project-copy-grid";
    copy.innerHTML = `<div><p class="eyebrow">Project story</p><h2>What I built.</h2><p class="project-description">${project.description}</p></div>`;

    const actions = document.createElement("div");
    actions.className = "project-actions";
    (project.links || []).forEach((link) => actions.appendChild(createProjectLink(link)));
    actions.appendChild(createProjectLink({ label: "Back to all projects", url: "/projects/", primary: false }));
    copy.appendChild(actions);

    root.replaceChildren(header, createProjectVisual(project), copy);
  } catch (error) {
    root.innerHTML = `<p class="eyebrow">Something went wrong</p><h1>This project could not be loaded.</h1><p class="project-page-intro">Please refresh the page or return to the project index.</p><div class="button-row"><a class="button button--primary" href="/projects/">View projects</a></div>`;
  }
}

setupNavigation();
setCurrentYear();
renderProjectGrids();
renderProjectDetail();
