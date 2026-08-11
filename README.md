# Wedding invite

A single-page wedding invite, built as a static site so it can be hosted free on GitHub Pages.
No build step, no framework, no dependencies — three files and a folder of images.

There is **no Python in this project** despite it living under `PycharmProjects`. PyCharm
creates a `.venv` for every new project; it's ignored by git and you can delete it.

Built for **Joey Hendricks & Smriti Prasad**. The names are real — the **dates, venues,
hotel block, contact email and story are all invented placeholders**. Replace them.

---

## 1. Put it on GitHub Pages

The repo is already initialised on branch `main`, and `.idea/` and `.venv/` are ignored —
PyCharm's project files and the virtualenv stay on your machine. Create an empty **public**
repo on GitHub (no README, no .gitignore), then:

```bash
git add -A
git commit -m "Wedding invite"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**

Your site appears in about a minute at:

```
https://<your-username>.github.io/<repo-name>/
```

If you name the repo `<your-username>.github.io`, it lives at the root domain instead.

> The repo must be **public** — GitHub Pages on private repos requires a paid plan.
> That also means **anything you commit here is world-readable**: never put the guest
> list, addresses or RSVP exports in this folder. `.gitignore` already blocks
> `private/`, `guests*.csv` and `rsvp*.csv` as a safety net.

### Custom domain (optional)

Buy a domain, add a `CNAME` file to this folder containing just the domain
(e.g. `joeyandsmriti.com`), point your DNS at GitHub, and set it under Settings → Pages.

---

## 2. Change the details

| What | Where |
|---|---|
| **The two-day agenda** | **`index.html`** — the JSON block at the bottom of the schedule section, see below |
| Names, story, venues, travel cards | `index.html` — plain HTML with section comments |
| Countdown target, RSVP link, calendar events | `main.js` — the `WEDDING` block at the very top |
| Colours and fonts | `styles.css` — the `:root` block at the very top (six values) |
| The couple illustration | `index.html` — inline SVG in the hero. Its nine colours (`--c-marigold`, `--c-rose`, `--c-teal`, `--c-gold`, skin tones…) and its size live in the `.couple` block in `styles.css` |
| Photos | `assets/` — see below |
| Browser tab title & link preview text | `<title>` and `<meta>` tags in `index.html` |

### The agenda

Search `index.html` for `schedule-data`. The schedule section is built from that JSON block
at page load, so you edit data instead of markup — no `<article>`/`<ol>`/`<li>` to keep balanced.

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

- Add or remove **days** and **events** freely — the layout adapts. Three days works; so does one.
- `label`, `venue`, `dress` and `note` are optional; leave them out and they're simply not rendered.
- It must stay valid JSON: double quotes only, no trailing commas, straight quotes not curly ones.
  Write a literal ampersand as `&amp;`. If you break it, the page tells you what's wrong and where
  instead of showing a blank section.
- Changing the agenda here does **not** change the "Add to calendar" button — that's the
  `events` array in `main.js`, and the countdown date lives there too.

### The RSVP form

1. Create a Google Form (name, email, number of guests, which days, dietary needs).
2. **Send → link icon → Copy.**
3. Paste it into `rsvpUrl` in `main.js`.

Responses land in a Google Sheet. Until you paste a link, the button explains that it isn't wired up yet.

### Photos

Drop your images into `assets/` and update the four `<img src="...">` tags in the
gallery section of `index.html`. Resize to roughly **1600px on the long edge** and
save as JPEG — guests will open this on phone data, and a 6MB photo from a camera
will make the page crawl. The current `.svg` files are placeholders; delete them once replaced.

---

## 3. Preview locally

Double-click `index.html`. That's the whole procedure — no server, no build step.
Edit, save, refresh.

---

## What's in it

- A hand-coded illustration of the couple — pure SVG, no image file, its own nine-colour palette
- Countdown to the first event
- Two-day schedule driven by an editable JSON block
- Travel, venues, hotels, weather
- Photo gallery
- "Add to calendar" button that generates an `.ics` for both days
- Responsive down to small phones, respects `prefers-reduced-motion`
