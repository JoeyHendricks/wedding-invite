# Wedding invite

A single-page wedding invite for Smriti Prasad & Joey Hendricks. Static HTML, CSS and
JavaScript — no build step, no framework, no required dependencies.

Dates, venues, hotel block, contact email and story text are placeholders.

## Files

| File | Contents |
|---|---|
| `index.html` | The page. Also holds the couple illustration, the decorative SVGs, and the agenda (a JSON block with `id="schedule-data"`). |
| `styles.css` | All styling. Ivory canvas and colour story in `:root`; illustration palette in `.couple`. |
| `main.js` | The `WEDDING` and `INTRO` config at the top, then the motif registry, schedule renderer, envelope, countdown, `.ics` generator, music control, card dots and Motion. |
| `assets/` | `photo-1`, `photo-2`, and `music.mp3` if you add one. |
| `.nojekyll` | Stops GitHub Pages running the files through Jekyll. |

## The page, in order

1. **Invitation** — names, date, countdown, the drawn couple
2. **Chapter one** — full-colour rani pink screen
3. **Our story** — three beats, with photo one as a print
4. **Come and stand with us** — full-colour green screen, photo two inside a jharokha arch
5. **The celebration** — the two-day schedule
6. **Travel & stay** — neutral and functional
7. **RSVP** — back to ivory and gold
8. **Closing** — the sign-off

On phones this is a locked deck: swipe **down** for the next chapter, **sideways** through
the cards inside a chapter (story beats, the two days, the travel cards). Desktop scrolls
normally. The dot rail on the right tracks position and jumps between chapters.

## Editing

### The agenda

In `index.html`, search for `schedule-data`. The schedule is built from that JSON block
at page load.

```json
{
  "days": [
    {
      "label": "Day one",
      "date": "Saturday, 5 December",
      "venue": "The Terrace at Bandra Reclamation",
      "dress": "Festive Indian — colour encouraged, comfort essential.",
      "events": [
        { "time": "4:00 pm", "title": "Mehendi", "motif": "mehendi",
          "note": "Optional one-line description." }
      ]
    }
  ]
}
```

- Add or remove days and events; the layout adapts.
- `label`, `venue`, `dress`, `note` and `motif` are all optional.
- `motif` draws a small mark beside the time. Available: `mehendi`, `sangeet`, `dancing`,
  `haldi`, `baraat`, `ceremony`, `reception`. Anything unrecognised simply draws nothing.
  Add your own to `MOTIFS` in `main.js`.
- Valid JSON only: double quotes, no trailing commas, straight quotes. Write a literal
  ampersand as `&amp;`. A syntax error is reported on the page in place of the schedule.
- The "Add to calendar" button and the countdown read from `main.js`, not from this block.
  Change dates in both places.

### Photographs

Two photographs, both in Our Story. Replace the placeholder SVGs with JPEGs and update the
`src` in `index.html`:

| File | Where | Shape |
|---|---|---|
| `assets/photo-1` | Inside Our Story, as a tilted print with stamp and postmark | portrait, 4:5 |
| `assets/photo-2` | Inside the jharokha arch, leading into the celebration | portrait, 3:4 |

Resize to about 1600px on the long edge and save as JPEG. Photo two is clipped to an arch
silhouette, so keep faces well inside the frame — the top corners are cut away.

### Music

**No audio file ships with this repo.** Add your own at `assets/music.mp3` and the control
appears by itself; with no file present the button removes itself and nothing else changes.

- Playback starts when the guest opens the envelope — that gesture is what browser autoplay
  policy requires. If the envelope is skipped, it waits for their first tap or keypress.
- It fades in over 2.6s to 32% volume rather than arriving at full blast. Both values are in
  the `MUSIC` object in `main.js`.
- The fixed control at bottom-left mutes and unmutes, and the choice is remembered for the tab.
- Use something you are licensed to use. A wedding invite on a public URL is publishing.

### Text

Names, story beats, venue addresses, travel cards, RSVP and footer are plain HTML in
`index.html`, marked with section comments.

### Colour

`:root` in `styles.css` holds two groups. The ivory canvas — `--paper`, `--paper-alt`,
`--ink`, `--ink-soft`, `--accent`, `--line` — and the colour story: `--marigold`, `--rani`,
`--vermilion`, `--emerald`, `--gold`, plus `--rani-deep` and `--green-deep` for the two
full-colour screens.

Colour belongs to the illustrations and those two screens. Body text stays ink on ivory
everywhere else; that restraint is what makes the colour screens land.

The couple illustration has its own palette in the `.couple` block: `--c-ink`, `--c-sand`,
`--c-terra`, `--c-ochre`, `--c-teal`.

### Motion

Scroll reveals, the parallax botanicals, and the settling of the photo print use
**Motion One** (`motion` on npm) — the vanilla-JavaScript library from the author of Framer
Motion, with the same `animate` / `inView` / `scroll` API. It loads as an ES module from a
CDN, pinned in `MOTION_SRC` in `main.js`.

It is entirely optional. If the CDN is unreachable the page falls back to the CSS reveal
transitions and everything still works — worth knowing, since guests will open this on
mobile data.

All motion is scroll-linked; nothing loops forever. Everything is skipped for visitors with
`prefers-reduced-motion`.

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
