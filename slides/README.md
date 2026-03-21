# Slides

Presentations built with [Quarto](https://quarto.org/) + [reveal.js](https://revealjs.com/), using a custom SCSS theme.

## Prerequisites

- [Quarto CLI](https://quarto.org/docs/get-started/) (v1.8+)
- Node.js (for accessibility checking)

```bash
npm install
```

## Authoring

Edit `slides/presentation.qmd`. Slides are separated by headings:

- `##` (H2) creates a **content** slide
- `## Title {background-color="#00274C" .section-divider}` creates a **section divider** slide

### Images

```markdown
![Alt text](images/photo.png){fig-alt="Detailed description for screen readers"}
```

Place images in `slides/images/`. Both `![alt text]` and `{fig-alt="..."}` provide accessibility — use `fig-alt` for longer descriptions.

### Two-column layout

```markdown
:::: {.columns}

::: {.column width="50%"}
Left column
:::

::: {.column width="50%"}
Right column
:::

::::
```

### Speaker notes

```markdown
::: {.notes}
Notes visible in speaker view (press S).
:::
```

## Theme

Edit `slides/custom.scss` to customize colors, fonts, and styles. Uses SCSS with two sections:

- `/*-- scss:defaults --*/` — SASS variables (colors, fonts, sizes)
- `/*-- scss:rules --*/` — custom CSS rules

## Building slides

### Live preview (while authoring)

```bash
npm run slides:dev
```

Opens a browser with hot-reload — the presentation rebuilds on every save.

### Build to HTML

```bash
npm run slides:html
```

Renders a self-contained HTML file to `docs/presentation.html` with all assets (images, fonts, CSS, JS) inlined via `embed-resources: true`. This is the file that gets published and distributed.

### Accessibility check

```bash
npm run slides:a11y
```

Runs [axe-core](https://github.com/dequelabs/axe-core) WCAG 2.1 AA checks against the rendered HTML. Returns non-zero on violations, so it can be used in CI.

One upstream reveal.js issue is suppressed (`meta-viewport` — reveal.js disables pinch-to-zoom for its scaling to work). The slide menu plugin is disabled (`menu: false`) to avoid its accessibility issue; use `Esc` for the overview mode instead.

### Build commands summary

| Command | Output | Description |
|---------|--------|-------------|
| `npm run slides:dev` | browser | Live preview with hot-reload |
| `npm run slides:html` | `docs/presentation.html` | Self-contained HTML build |
| `npm run slides:a11y` | terminal | axe-core accessibility check |
| `npm run slides:zip` | `presentation.zip` | Build + zip for distribution |

## Publishing to GitHub Pages

### 1. Build and push

```bash
npm run slides:html
git add docs/
git commit -m "build: update slides"
git push
```

### 2. Enable GitHub Pages (one-time setup)

1. Go to your repo on GitHub
2. **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Set branch to **main** and folder to **/docs**
5. Click **Save**

### 3. Find your published URL

Your slides will be available at:

```
https://<username>.github.io/<repo-name>/presentation.html
```

For example, if your GitHub username is `presnick` and the repo is `ellison-guest-lecture`:

```
https://presnick.github.io/ellison-guest-lecture/presentation.html
```

You can also find the URL on the repo's GitHub Pages settings page. It takes a minute or two after the first push for the site to go live.

## Accessibility

- **Clean semantic DOM**: reveal.js uses `<section>` elements with real HTML content
- **`aria-hidden`** on inactive slides (built into reveal.js)
- **Built-in `aria-live` region** announces slide content to screen readers on transition
- **Keyboard navigation**: arrow keys, Space, Escape for overview
- **`slide-tone`**: Set to `true` in `presentation.qmd` to play an auditory tone on slide transitions (plays for all users)
- **`axe: output: console`** in the YAML enables Quarto's built-in axe-core checks during `quarto preview`

## Distributing slides

- **Online**: Publish via GitHub Pages (see above)
- **Downloadable**: `npm run slides:zip` creates a zip of `docs/`. The HTML has all assets inlined, so it works offline in any browser.
