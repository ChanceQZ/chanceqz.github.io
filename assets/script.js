const content = window.siteContent;
const pageKey = document.body.dataset.page;
const main = document.getElementById("main-content");

function element(tagName, options = {}) {
  const node = document.createElement(tagName);

  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.href) node.href = options.href;
  if (options.src) node.src = options.src;
  if (options.alt !== undefined) node.alt = options.alt;

  return node;
}

function paragraph(text, className = "") {
  return element("p", { className, text });
}

function createPageHeader(title, introduction) {
  const header = element("header", { className: "page-heading" });
  header.append(
    element("h1", { text: title }),
    paragraph(introduction, "page-introduction"),
  );
  return header;
}

function createExternalLink({ label, href }, className = "") {
  const link = element("a", { className, href, text: label });
  if (/^https?:\/\//.test(href)) link.rel = "noopener noreferrer";
  return link;
}

function renderNavigation() {
  const nav = document.getElementById("site-nav");
  const links = content.navigation
    .filter((item) => !item.hidden)
    .map((item) => {
      const link = element("a", { href: item.href, text: item.label });
      if (item.page === pageKey) link.setAttribute("aria-current", "page");
      return link;
    });

  nav.replaceChildren(...links);
}

function renderFooter() {
  const footer = document.getElementById("site-footer-content");
  const year = new Date().getFullYear();
  const copyright = paragraph(`© ${year} ${content.footer.text}.`);

  footer.replaceChildren(copyright);
}

function renderHome(data) {
  const section = element("section", { className: "home-intro" });
  section.setAttribute("aria-labelledby", "home-title");

  const copy = element("div", { className: "home-copy" });
  const eyebrow = paragraph(data.eyebrow, "eyebrow");
  const title = element("h1", { text: data.title });
  title.id = "home-title";
  copy.append(
    eyebrow,
    title,
    paragraph(data.intro, "home-summary"),
    paragraph(data.affiliation, "affiliation"),
  );

  const portrait = element("img", {
    className: "home-portrait",
    src: data.portrait.src,
    alt: data.portrait.alt,
  });

  section.append(copy, portrait);
  main.replaceChildren(section);
}

function renderAbout(data) {
  const shell = element("div", { className: "page-shell reading-shell" });
  shell.append(createPageHeader(data.title, data.introduction));

  const article = element("article", { className: "narrative" });
  for (const sectionData of data.sections) {
    const section = element("section", { className: "narrative-section" });
    section.append(element("h2", { text: sectionData.title }));
    section.append(...sectionData.paragraphs.map((text) => paragraph(text)));
    article.append(section);
  }

  shell.append(article);
  main.replaceChildren(shell);
}

function renderResearch(data) {
  const shell = element("div", { className: "page-shell" });
  shell.append(createPageHeader(data.title, data.introduction));

  const directionsSection = element("section", { className: "research-section" });
  directionsSection.append(element("h2", { text: "Research directions" }));
  const directions = element("div", { className: "direction-list" });
  for (const direction of data.directions) {
    const item = element("article", { className: "direction-item" });
    item.append(
      element("h3", { text: direction.title }),
      paragraph(direction.text),
    );
    directions.append(item);
  }
  directionsSection.append(directions);

  const projectsSection = element("section", { className: "research-section" });
  projectsSection.append(element("h2", { text: "Representative projects and papers" }));
  const projects = element("div", { className: "project-list" });
  for (const project of data.projects) {
    const projectLink = element("a", {
      className: "project-row",
      href: project.href,
    });
    projectLink.rel = "noopener noreferrer";

    const image = element("img", {
      className: "project-image",
      src: project.image,
      alt: project.imageAlt,
    });
    const projectCopy = element("div", { className: "project-copy" });
    projectCopy.append(
      paragraph(project.category, "project-category"),
      element("h3", { text: project.title }),
      paragraph(project.summary, "project-summary"),
      paragraph(project.venue, "project-venue"),
    );
    projectLink.append(image, projectCopy);
    projects.append(projectLink);
  }
  projectsSection.append(projects);

  const linksSection = element("section", {
    className: "research-section academic-links-section",
  });
  linksSection.append(element("h2", { text: "Academic links" }));
  const links = element("div", { className: "academic-links" });
  for (const item of data.links) {
    const link = createExternalLink(item, "academic-link");
    link.append(paragraph(item.description));
    links.append(link);
  }
  linksSection.append(links);

  shell.append(directionsSection, projectsSection, linksSection);
  main.replaceChildren(shell);
}

function groupActivities(items) {
  const groups = [];

  for (const item of [...items].sort((a, b) => b.date.localeCompare(a.date))) {
    const year = item.date.slice(0, 4);
    let group = groups[groups.length - 1];
    if (!group || group.year !== year) {
      group = { year, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups;
}

function renderActivities(data) {
  const shell = element("div", { className: "page-shell" });
  shell.append(createPageHeader(data.title, data.introduction));

  const timeline = element("div", { className: "activity-timeline" });
  for (const group of groupActivities(data.items)) {
    const section = element("section", { className: "activity-year" });
    section.append(element("h2", { text: group.year }));

    const list = element("div", { className: "activity-list" });
    for (const item of group.items) {
      const row = element("article", { className: "activity-row" });
      const meta = element("div", { className: "activity-meta" });
      const date = element("time", { text: item.dateLabel });
      date.dateTime = item.date;
      meta.append(date, paragraph(item.type, "activity-type"));

      const copy = element("div", { className: "activity-copy" });
      copy.append(
        element("h3", { text: item.title }),
        paragraph(item.text),
      );
      row.append(meta, copy);
      list.append(row);
    }

    section.append(list);
    timeline.append(section);
  }

  shell.append(timeline);
  main.replaceChildren(shell);
}

function renderContact(data) {
  const shell = element("div", { className: "page-shell reading-shell contact-shell" });
  shell.append(createPageHeader(data.title, data.introduction));

  const details = element("dl", { className: "contact-details" });

  details.append(element("dt", { text: "Email" }));
  const email = element("dd");
  email.append(element("a", {
    href: `mailto:${data.email}`,
    text: data.email,
  }));
  details.append(email);

  details.append(element("dt", { text: "Affiliations" }));
  const affiliations = element("dd");
  affiliations.append(...data.affiliations.map((item) => paragraph(item)));
  details.append(affiliations);

  details.append(
    element("dt", { text: "Mailing address" }),
    element("dd", { text: data.address }),
  );

  shell.append(details);
  main.replaceChildren(shell);
}

function setMenuOpen(open) {
  const button = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  button.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
}

function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    setMenuOpen(!expanded);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      button.focus();
    }
  });
}

const renderers = {
  home: renderHome,
  about: renderAbout,
  research: renderResearch,
  activities: renderActivities,
  contact: renderContact,
};

renderNavigation();
renderFooter();
renderers[pageKey](content[pageKey]);
setupMenu();
