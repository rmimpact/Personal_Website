# Remy Moscovitz portfolio

This is a static HTML, CSS and JavaScript portfolio published at
`https://remymoscovitz.com`.

## Project pages and social previews

Project content lives in:

- `projects/projects.json`
- `projects/projects.fr.json`

Each project has a crawlable English and French route:

- `/projects/<id>/`
- `/fr/projects/<id>/`

Set `ogImage` to a root-relative static image path to control that project's
Discord, iMessage, Facebook, X and LinkedIn preview. If `ogImage` is missing,
the generator uses `/media/og-remy-portfolio.png`.

After editing either project JSON file, regenerate and test the static pages:

```sh
node generate-project-pages.js
node test-project-pages.js
```

The generated HTML must be committed with the JSON changes because social
crawlers generally do not run the browser JavaScript.
