import { contact } from "../content/contact.js";
import { escapeHtml, renderLayout } from "../templates/layout.js";

export const contactPage = {
  page: "contact",
  output: "contact.html",
  title: contact.title,
  description: contact.description,
  render({ assetVersion } = {}) {
    const affiliationMarkup = contact.affiliations
      .map((affiliation) => `<p>${escapeHtml(affiliation)}</p>`)
      .join("\n          ");
    const main = `<div class="page-shell reading-shell contact-shell">
      <header class="page-heading">
        <h1>${escapeHtml(contact.title)}</h1>
        <p class="page-introduction">${escapeHtml(contact.introduction)}</p>
      </header>
      <dl class="contact-details">
        <dt>Email</dt>
        <dd><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></dd>
        <dt>Affiliations</dt>
        <dd>${affiliationMarkup}</dd>
        <dt>Mailing address</dt>
        <dd>${escapeHtml(contact.address)}</dd>
      </dl>
    </div>`;

    return renderLayout({
      page: this.page,
      output: this.output,
      title: this.title,
      description: this.description,
      main,
      assetVersion,
    });
  },
};
