# Slides

Markdown slide decks using [Marp](https://marp.app/) with a custom theme (`theme.css`).

## Setup

```bash
npm install
```

## Authoring

Edit `slides/presentation.md`. Slides are separated by `---`. Use standard Markdown for content.

### Slide classes

Apply a class with `<!-- _class: classname -->` before a slide's heading:

- `title` — centered white-on-dark title slide with diagonal accent wedge
- `section` — accent-colored section divider
- `accent` — dark background for emphasis or key takeaways
- (no class) — standard content slide

### Images

Place images in `slides/images/` and reference them with relative paths:

```markdown
![Alt text describing the image](images/photo.png)
```

Marp sizing directives go in the alt text:

```markdown
![w:600 Alt text](images/diagram.png)
![bg right:40%](images/photo.png)
```

**Accessibility:** `bg` images become CSS backgrounds and are invisible to screen readers. For those slides, add a hidden description:

```html
<span style="position:absolute;left:-9999px">Description of the background image</span>
```

### Two-column layout

```html
<div class="columns">
<div>

Left column content

</div>
<div>

Right column content

</div>
</div>
```

### Theme

Edit `theme.css` to customize colors, fonts, and slide classes. Colors default to Michigan Blue/Maize.

## Build commands

| Command | Output | Description |
|---------|--------|-------------|
| `npm run slides:dev` | `docs/presentation.html` | Live-reload watcher; rebuilds on every save |
| `npm run slides:html` | `docs/presentation.html` | One-time HTML build; copies images to `docs/images/` |
| `npm run slides:pdf` | `docs/presentation.pdf` | PDF with selectable text; embeds images |
| `npm run slides:zip` | `presentation.zip` | Builds HTML then zips `docs/` for distribution |

## Distributing slides

- **Online:** Publish the `docs/` directory via GitHub Pages (see below).
- **Offline/downloadable:** Run `npm run slides:zip` to create a self-contained zip. Recipients unzip and open `presentation.html` in any browser. The HTML preserves full text, semantic structure, and screen reader support.
- **PDF:** `npm run slides:pdf` produces a single file with selectable text, but less accessible than the HTML.
- **PPTX:** Marp can generate PPTX (`--pptx` flag) but it renders slides as images only — not accessible. Avoid for distribution.

## Publishing to GitHub Pages

1. Go to your repo on GitHub: **Settings > Pages**
2. Under **Source**, select **Deploy from a branch**
3. Set the branch to `main` (or your default branch) and the folder to `/docs`
4. Click **Save**

GitHub will publish the contents of `docs/` to `https://<username>.github.io/<repo-name>/`. After each push that updates `docs/`, the site rebuilds automatically (may take a minute).

The published URL for slides will be:
```
https://<username>.github.io/<repo-name>/presentation.html
```
