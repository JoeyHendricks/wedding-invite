# Wedding invite

A single-page wedding invite for Smriti Prasad & Joey Hendricks. Static HTML, CSS and
JavaScript — no build step, no framework, no required dependencies.

Dates, venues, hotel block and contact email are placeholders.

## Files

| File | Contents |
|---|---|
| `index.html` | The page. Also holds the couple illustration, the decorative SVGs, and the agenda (a JSON block with `id="schedule-data"`). |
| `styles.css` | All styling. Ivory canvas and colour story in `:root`; illustration palette in `.couple`. |
| `main.js` | The `WEDDING` and `INTRO` config at the top, then the motif registry, schedule renderer, envelope, countdown, `.ics` generator, music control, card dots and Motion. |
| `assets/` | `photo-1`, `photo-2`, and `music.mp3` if you add one. |
| `.nojekyll` | Stops GitHub Pages running the files through Jekyll. |

## The page, in order

1. **Welcome** — deep green, the photograph inside a jharokha arch, and the invitation
   itself: names, date, countdown and the two buttons. Stacked on phones, the arch beside
   the type on wide screens.
2. **Day one** — yellow. Haldi, Mehendi, Sangeet.
3. **Day two** — red. Baraat, the ceremony, the reception.
4. **Travel & stay** — neutral and functional
5. **RSVP** — back to ivory and gold
6. **Closing** — the sign-off, with the drawn couple

Two extras per day, both optional and both set in the JSON:

- `"petals": true` drops a handful of petals down the page, once, the first time a guest
  reaches it. It never loops, and it does not run for reduced-motion visitors.
- A day whose tint has a **corner scene** (currently `yellow`, the haldi bowl) gets that
  instead of the two small corner marks, so the page does not get busy. Corner scenes live
  in `BACKDROPS` in `main.js`; the small marks live in `DECO`.

To put a **photograph** behind a day, set `--bg-photo` on its tint in `styles.css`:

```css
.day-page--yellow{ --bg-photo: url("assets/haldi.jpg"); }
```

The tint then becomes a translucent wash over the photo (`--tint-wash`) so the type stays
readable. Drop the wash to `transparent` if you want the photo at full strength.

Each day in the agenda JSON becomes its own full-screen page in its own tint — add a third
day and you get a third page, a third dot, and the next tint, with no other edits. Set
`"tint"` on a day to choose: `yellow`, `red`, `leaf`, `rose` or `marigold`.

On phones this is a locked deck: swipe **down** for the next chapter, **sideways** through
the travel cards, which are the only sideways set left. Desktop scrolls
normally. The dot rail on the right tracks position and jumps between chapters.

The swipe is a real pager, not just scroll snapping — the gesture is intercepted, so the
page cannot be dragged part-way between two chapters. One swipe is one page, and a fast
double-swipe still only moves one. It stands aside for horizontal swipes and for lists that
can still scroll inside themselves, so the carousels and the day timelines behave normally.
Thresholds are in `PAGER` at the top of that section in `main.js`.

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
- Valid JSON only: double quotes, no trailing commas, straight quotes. Write ampersands
  plainly as `&` — the block is a `<script>`, so HTML entities are *not* decoded there and
  `&amp;` would show up on the page as those five characters. A syntax error is reported on
  the page in place of the schedule.
- The "Add to calendar" button and the countdown read from `main.js`, not from this block.
  Change dates in both places.

### The photograph

One photograph, in the arch. Replace `assets/photo-2` with a JPEG and update its `src` in
`index.html`. Portrait, roughly 3:4, about 1600px on the long edge.

It is clipped to an arch silhouette, so keep faces well inside the frame — the top corners
are cut away.

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

Names, venue addresses, travel cards, RSVP and footer are plain HTML in `index.html`,
marked with section comments.

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

Scroll reveals, the parallax botanicals and the arch reveal use
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

### The RSVP form

Replies need somewhere to go. Put a URL in `RSVP.endpoint` at the top of
`main.js` and the form starts recording; until then it tells the guest
plainly that it is not connected rather than pretending to send.

Two kinds of endpoint work, and the code tells them apart from the URL.

**Option A — Formspree (no Google, and errors are actually reported)**

1. Sign up at formspree.io, make a form, copy its endpoint
   (`https://formspree.io/f/xxxxxxx`).
2. Paste it into `RSVP.endpoint`.

Formspree answers cross-origin requests properly, so a failure is caught
and shown to the guest instead of disappearing. Free tier is ~50 replies
a month. Getform and Basin work the same way.

**Option B — Google Apps Script (writes straight to a Sheet)**

1. Make a Google Sheet with a tab named `RSVPs`.
2. **Extensions → Apps Script**, and paste:

```js
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var sh = SpreadsheetApp.getActive().getSheetByName(d.sheet || 'RSVPs');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Sent at','Name','Attending','Guests attending','Guest names']);
  }
  sh.appendRow([d.sentAt, d.name, d.attending, d.count, d.guests]);
  return ContentService.createTextOutput('ok');
}
```

3. **Deploy → New deployment → Web app.** Execute as *me*, access *Anyone*.
4. Copy the `/exec` URL into `RSVP.endpoint`.

Apps Script sends no CORS headers, so that request goes as `no-cors` and
the browser cannot read a status back — a submit is treated as sent once
the request resolves. **Send yourself a test reply and check the Sheet**
before this goes out to guests.

#### "Sorry, unable to open the file at this time"

This is nearly always multiple Google accounts being signed in at once:
the Sheet lives under one account and Apps Script opens under another.

- Open the Sheet in an **incognito window**, signed into only the account
  that owns it, then try Extensions → Apps Script again.
- Or check the account index in the URL — `docs.google.com/u/0/...` versus
  `/u/1/...` — and make sure the Apps Script tab opens under the same one.
- Disable ad blockers and allow third-party cookies for
  `script.google.com`.
- On a work or school account, an admin may have disabled Apps Script
  entirely. A personal Gmail account will not have that restriction.

If none of that clears it, use Option A — it needs no Google at all.

