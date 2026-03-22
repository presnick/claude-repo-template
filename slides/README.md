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

Images are automatically scaled to fit within the slide (max 55% of viewport height). For multi-column layouts, you may need inline `style="max-height:620px; width:100%; object-fit:contain;"` to fine-tune sizing.

### Full-bleed image slides

Use a background image to fill the entire slide with no title or heading:

```markdown
## {background-image="images/photo.png" background-size="contain" background-color="#ffffff"}
```

### Titleless content slides

Use the `.no-title` class for slides that need maximum content area (e.g., multi-column image layouts):

```markdown
## {.no-title}

Content here gets the full slide area — no heading or yellow underline.
```

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

Add `style="gap: 2em;"` to `:::: {.columns}` for spacing between columns.

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

**Run before every push:**

```bash
npm run slides:a11y:all
```

This runs both checks:

1. **axe-core** (`npm run slides:a11y`) — WCAG 2.1 AA static analysis of the rendered HTML
2. **Accessibility tree test** (`npm run slides:a11y:menu`) — verifies that the runtime ARIA patches for the slide menu produce correct roles, labels, focus management, and inert state. Uses Puppeteer to inspect the browser's accessibility tree.

Suppressed axe rules (all fixed at runtime by JS in `presentation.qmd`, but axe tests static HTML before scripts run):

- **`meta-viewport`**: reveal.js disables pinch-to-zoom; runtime script re-enables it
- **`link-name`**: slide menu button `<a>` gets `aria-label` at runtime
- **`scrollable-region-focusable`**: menu panel gets `tabindex` and proper roles at runtime
- **`frame-title`**: YouTube iframes from Quarto's `{{< video >}}` shortcode get `title` at runtime

### Build commands summary

| Command | Output | Description |
|---------|--------|-------------|
| `npm run slides:dev` | browser | Live preview with hot-reload |
| `npm run slides:html` | `docs/presentation.html` | Self-contained HTML build |
| `npm run slides:a11y:all` | terminal | All accessibility checks (run before every push) |
| `npm run slides:a11y` | terminal | axe-core checks only |
| `npm run slides:a11y:menu` | terminal | Accessibility tree + focus management checks only |
| `npm run slides:check` | terminal | Check all slides for content overflow |
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
- **Slide change announcements**: reveal.js's `aria-live` region is patched to announce just the slide title/number instead of dumping all content (which caused double-reading)
- **Keyboard navigation**: arrow keys, Space, Escape for overview
- **Navigation menu**: Press `M` to open. The menu plugin's DOM is patched at runtime with proper ARIA roles (`menu`, `menuitem`, `tab`, `button`) so screen readers can navigate slide titles and toolbar items
- **Pinch-to-zoom**: Enabled on mobile via a viewport meta override (reveal.js disables it by default)
- **Color contrast**: Bullet markers use a darker gold (#C8A200) instead of the standard Michigan maize (#FFCB05) to meet WCAG AA contrast requirements on white backgrounds
- **`slide-tone`**: Set to `true` in `presentation.qmd` to play an auditory tone on slide transitions (plays for all users)
- **`axe: output: console`** in the YAML enables Quarto's built-in axe-core checks during `quarto preview`

## Distributing slides

- **Online**: Publish via GitHub Pages (see above)
- **Downloadable**: `npm run slides:zip` creates a zip of `docs/`. The HTML has all assets inlined, so it works offline in any browser.
