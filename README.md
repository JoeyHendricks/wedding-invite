# Wedding invite

A single-page wedding invite for Smriti Prasad & Joey Hendricks. Static HTML, CSS and
JavaScript — no build step, no framework, no dependencies.

Dates, venues, hotel block, contact email and story text are placeholders.

## Files

| File | Contents |
|---|---|
| `index.html` | The page: hero, story, schedule, travel, gallery, RSVP. Also holds the couple illustration (inline SVG) and the agenda (a JSON block with `id="schedule-data"`). |
| `styles.css` | All styling. Site palette and fonts in the `:root` block at the top; illustration palette and size in the `.couple` block. |
| `main.js` | The `WEDDING` config at the top (countdown date, RSVP link, calendar events), then the schedule renderer, countdown, `.ics` generator and scroll behaviour. |
| `assets/` | Gallery images. Currently four placeholder SVGs. |
| `.nojekyll` | Stops GitHub Pages running the files through Jekyll. |

## Sections

Hero with countdown, our story, two-day schedule, travel and accommodation cards,
photo gallery, RSVP. Plus an "Add to calendar" button that downloads an `.ics` for both
days. Responsive to phone widths; respects `prefers-reduced-motion`.

## Editing

### The agenda

In `index.html`, search for `schedule-data`. The schedule section is built from that JSON
block at page load.

```json
{
  "days": [
    {
      "label": "Day one",
      "date": "Saturday, 5 December",
      "venue": "The Terrace at Bandra Reclamation",
      "dress": "Festive Indian — colour encouraged, comfort essential.",
      "events": [
        { "time": "4:00 pm", "title": "Mehendi", "note": "Optional one-line description." }
      ]
    }
  ]
}
```

- Add or remove days and events; the layout adapts.
- `label`, `venue`, `dress` and `note` are optional.
- Valid JSON only: double quotes, no trailing commas, straight quotes. Write a literal
  ampersand as `&amp;`. A syntax error is reported on the page in place of the schedule.
- The "Add to calendar" button and the countdown read from `main.js`, not from this block.
  Change dates in both places.

### Text

Names, story, venue addresses, travel cards, RSVP deadline and footer are plain HTML in
`index.html`, marked with section comments. The tab title and link-preview text are the
`<title>` and `<meta>` tags in `<head>`.

### RSVP form

1. Create a Google Form (name, email, party size, which days, dietary needs).
2. **Send → link icon → Copy.**
3. Paste the URL into `rsvpUrl` in `main.js`.

Responses collect in a Google Sheet. Until a URL is set, the button reports that it is
unlinked.

### Photos

Add images to `assets/` and update the four `<img src="...">` tags in the gallery section
of `index.html`. Resize to about 1600px on the long edge and save as JPEG. Delete the
placeholder SVGs once replaced.

### Colours

Site palette: the six values in `:root` at the top of `styles.css` (`--paper`,
`--paper-alt`, `--ink`, `--ink-soft`, `--accent`, `--line`).

Illustration palette: the five values in the `.couple` block (`--c-ink`, `--c-sand`,
`--c-terra`, `--c-ochre`, `--c-teal`). `.couple { width }` sets its size.

## Preview

Open `index.html` in a browser. Edit, save, refresh.

## Publish to GitHub Pages

The repo is initialised on branch `main`. Push it to
<https://github.com/JoeyHendricks/wedding-invite>:

```bash
git add -A
git commit -m "Wedding invite"
git remote add origin https://github.com/JoeyHendricks/wedding-invite.git
git push -u origin main
```

On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**

The site is then published at:

```
https://joeyhendricks.github.io/wedding-invite/
```

The local folder name is not part of the URL — only the GitHub repo name is.

GitHub Pages requires a public repo on the free plan, so everything committed here is
publicly readable. `.gitignore` blocks `private/`, `guests*.csv` and `rsvp*.csv`.

### Custom domain

Add a `CNAME` file containing only the domain (e.g. `joeyandsmriti.com`), point the
domain's DNS at GitHub, and set it under Settings → Pages.
