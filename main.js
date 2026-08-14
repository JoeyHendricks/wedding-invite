/* ============================================================
   EDIT EVERYTHING HERE
   ------------------------------------------------------------
   The two-day agenda lives in schedule.json — edit that file.
   These are the only values you need to change in this one.
   Times use +05:30 (India Standard Time) — keep that suffix.
   ============================================================ */
const WEDDING = {
  couple: "Smriti & Joey",

  // The moment the countdown counts down to (first event, day one).
  countdownTo: "2026-10-17T10:00:00+05:30",

  // Paste your Google Form's share link here (the "Send → link" URL).
  // Until you do, the RSVP button shows a friendly note instead.
  rsvpUrl: "",

  // Calendar entries created by the "Add to calendar" button.
  events: [
    {
      title: "Smriti & Joey — Haldi, Mehendi & Sangeet",
      start: "2026-10-17T10:00:00+05:30",
      end:   "2026-10-17T23:59:00+05:30",
      location: "The Terrace at Bandra Reclamation, Bandra West, Mumbai 400050",
      description: "Day one: Haldi from 10am, Mehendi from 2pm, Sangeet from 7pm. Dress: yellows and whites."
    },
    {
      title: "Smriti & Joey — Wedding Ceremony & Reception",
      start: "2026-10-18T17:00:00+05:30",
      end:   "2026-10-18T23:59:00+05:30",
      location: "Sea-facing Lawns, Worli Sea Face, Mumbai 400018",
      description: "Day two: Baraat 5pm, Pheras 6:30pm, Reception & dinner 8:30pm. Dress: Indian formal."
    }
  ]
};

/* The envelope. Every number is a beat in a sequence that is meant to
   feel like film: nothing here is under a second. The scene waits for
   the guest — it never opens by itself. */
const INTRO = {
  play: true,
  oncePerTab: true,   // false = the envelope opens on every page load

  press:   0,         // the seal takes the touch
  unseal:  650,       // the wax gives way
  open:   1150,       // the flap falls open        (1.7s to swing)
  slide:  2300,       // the card rises             (1.9s to climb)
  fade:   5200,       // the scene begins to leave  (1.5s to go)
  end:    6700        // removed, page unlocked
};
/* ========================= end of edits ===================== */


/* ---------- 1 · the envelope ----------
   The inline script in <head> already decided whether this runs by
   adding .has-intro to <html> (skipped for reduced-motion, repeat
   visits in the same tab, and JavaScript-off).                      */
(function envelope(){
  const root  = document.documentElement;
  const intro = document.getElementById("intro");
  if (!intro) return;

  if (!INTRO.play || !root.classList.contains("has-intro")){
    root.classList.remove("has-intro");
    intro.remove();
    // No envelope this visit, so wait for whatever the guest does first.
    ["pointerdown","keydown","touchstart"].forEach(type =>
      addEventListener(type, () => music.start(), { once: true, passive: true }));
    return;
  }

  try { if (INTRO.oncePerTab) sessionStorage.setItem("inviteOpened", "1"); } catch(e){}

  let opening = false, done = false, timers = [];
  const at = (fn, ms) => timers.push(setTimeout(fn, ms));
  const mark = cls => intro.classList.add(cls);

  /* The whole sequence, started by the guest and only by the guest. */
  function open(){
    if (opening || done) return;
    opening = true;

    mark("is-pressed");                       // the seal takes the press
    at(() => mark("is-unsealed"), INTRO.unseal);
    at(() => mark("is-open"),     INTRO.open);
    at(() => mark("is-out"),      INTRO.slide);

    // the music comes up as the card does, not before
    at(() => music.start(), INTRO.slide);

    at(fade,   INTRO.fade);
    at(finish, INTRO.end);
  }

  function fade(){ intro.classList.add("is-gone"); }

  function finish(){
    if (done) return;
    done = true;
    timers.forEach(clearTimeout); timers = [];
    root.classList.remove("has-intro");
    intro.remove();
    detach();
    music.start();
  }

  /* Skip leaves quietly, without the performance. */
  function skip(e){
    if (e) e.stopPropagation();
    if (done) return;
    timers.forEach(clearTimeout); timers = [];
    fade();
    at(finish, 900);
  }

  function onKey(e){
    if (e.key === "Escape") return skip();
    if (["Enter"," ","ArrowDown","PageDown"].includes(e.key)){ e.preventDefault(); open(); }
  }
  function onWheel(e){ e.preventDefault(); open(); }
  function onTouchMove(e){ e.preventDefault(); open(); }

  function detach(){
    document.removeEventListener("keydown", onKey);
    intro.removeEventListener("wheel", onWheel);
    intro.removeEventListener("touchmove", onTouchMove);
  }

  document.addEventListener("keydown", onKey);
  intro.addEventListener("wheel", onWheel, { passive: false });
  intro.addEventListener("touchmove", onTouchMove, { passive: false });
  intro.addEventListener("click", () => open());
  document.getElementById("introSkip")?.addEventListener("click", skip);

  const hint = document.getElementById("introHint");
  if (hint && matchMedia("(hover: none)").matches) hint.textContent = "Tap the seal to open";
})();


/* ---------- event motifs ----------
   One drawn mark per kind of event, drawn at 32×32. Referenced from the
   agenda JSON by its key: "motif": "mehendi". Add your own by adding a
   key here — anything unrecognised simply renders no motif.       */
const MOTIFS = {
  // paisley, for henna
  mehendi: `<path d="M16 5 C24 9 26 19 20 25 C16 28 10 26 9 21 C8 16 13 12 17 14.5
                     C20 16 20 20 17 21"/>
            <circle cx="17.5" cy="10" r="1"/><circle cx="21" cy="14" r="1"/>`,
  // dholak
  sangeet: `<path d="M8 12.5 C8 10 24 10 24 12.5 L24 20 C24 22.5 8 22.5 8 20 Z"/>
            <ellipse cx="16" cy="12.5" rx="8" ry="2.5"/>
            <path d="M9 14 L23 19 M9 19 L23 14" opacity=".55"/>`,
  // ghungroo bells on a thread
  dancing: `<path d="M5 11 C11 21 21 21 27 11"/>
            <circle cx="10" cy="17" r="2.2"/><circle cx="16" cy="19.5" r="2.2"/>
            <circle cx="22" cy="17" r="2.2"/>`,
  // bowl of turmeric
  haldi:   `<path d="M6 15.5 C6 24 26 24 26 15.5 Z"/>
            <path d="M4.5 15.5 L27.5 15.5"/>
            <circle cx="12" cy="10" r="1.4"/><circle cx="16.5" cy="7.5" r="1.4"/>
            <circle cx="21" cy="10.5" r="1.4"/>`,
  // dhol and sticks, for the procession
  baraat:  `<path d="M9 13 C9 10.5 23 10.5 23 13 L23 19 C23 21.5 9 21.5 9 19 Z"/>
            <ellipse cx="16" cy="13" rx="7" ry="2.4"/>
            <path d="M4 8 L11 12 M28 8 L21 12"/>`,
  // the sacred fire
  ceremony:`<path d="M16 5 C19.5 10.5 22.5 12.5 22.5 17 C22.5 21 19.5 23.5 16 23.5
                     C12.5 23.5 9.5 21 9.5 17 C9.5 12.5 12.5 10.5 16 5 Z"/>
            <path d="M16 14 C17.5 16 18.5 17.5 18.5 19 C18.5 20.6 17.4 21.5 16 21.5
                     C14.6 21.5 13.5 20.6 13.5 19 C13.5 17.5 14.5 16 16 14 Z" opacity=".6"/>
            <path d="M6 26.5 L26 26.5"/>`,
  // diya
  reception:`<path d="M5.5 19 C9 25 23 25 26.5 19 Z"/>
             <path d="M4 19 L28 19"/>
             <path d="M16 16.5 C18 14 18.5 11 16 7.5 C13.5 11 14 14 16 16.5 Z"/>`
};


/* ---------- reveal on scroll (shared) ---------- */
const revealer = ("IntersectionObserver" in window)
  ? new IntersectionObserver((entries, io) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("is-in"), i * 70);
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 })
  : null;

function observeReveals(root = document){
  root.querySelectorAll(".reveal").forEach(el => {
    if (revealer) revealer.observe(el);
    else el.classList.add("is-in");
  });
}
observeReveals();

/* Safety net. If the observer never reports — a tab opened in the
   background, an unusual browser — show whatever is actually on screen
   after a couple of seconds. Anything below the fold still reveals on
   scroll as normal, so this costs nothing when things work. */
setTimeout(() => {
  document.querySelectorAll(".reveal:not(.is-in)").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0 && r.height > 0) el.classList.add("is-in");
  });
}, 2500);


/* ---------- schedule ----------
   Reads the JSON block <script id="schedule-data"> at the bottom of the
   schedule section in index.html. Edit the agenda there, not here.      */
(function schedule(){
  const host = document.getElementById("days");
  const src  = document.getElementById("schedule-data");
  if (!host || !src) return;

  let data;
  try {
    data = JSON.parse(src.textContent);
  } catch (err) {
    host.removeAttribute("aria-busy");
    host.innerHTML = `<div class="days__err">
        <h3>The agenda JSON has a typo</h3>
        <p class="muted">${String(err.message)}</p>
        <p class="muted">Fix the <code>schedule-data</code> block in <code>index.html</code> —
        usually a missing comma, a trailing comma, or a curly quote. Paste it into
        jsonlint.com to find it.</p>
      </div>`;
    console.error("[schedule]", err);
    return;
  }

  const days = Array.isArray(data && data.days) ? data.days : [];
  if (!days.length){
    host.removeAttribute("aria-busy");
    host.innerHTML = `<div class="days__err"><h3>No days in the agenda</h3>
      <p class="muted">Add at least one entry to the <code>days</code> array in
      the <code>schedule-data</code> block in <code>index.html</code>.</p></div>`;
    return;
  }

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

  const motif = key => {
    const d = MOTIFS[key];
    if (!d) return "";                       // unknown or omitted: no decoration
    return `<svg class="motif motif--${esc(key)}" viewBox="0 0 32 32" fill="none"
      stroke="currentColor" stroke-width="1.3" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  };

  /* Each day is a block on the ivory, not a coloured screen. Its accent
     — "tint" in the JSON — colours only the small things: the label, the
     rule, the event marks. That is the whole of the restraint. */
  const TINTS = ["gold", "carmine", "olive"];

  host.innerHTML = days.map((day, i) => {
    const events = Array.isArray(day.events) ? day.events : [];
    const tint = TINTS.includes(day.tint) ? day.tint : TINTS[i % 2];
    return `
      <article class="day day--${tint}" id="day-${i + 1}">
        <header class="day__head reveal">
          ${day.label ? `<span class="day__num">${esc(day.label)}</span>` : ""}
          <h3>${esc(day.date)}</h3>
          ${day.venue ? `<p class="day__place">${esc(day.venue)}</p>` : ""}
          <span class="day__rule" aria-hidden="true"></span>
        </header>
        <ol class="timeline">
          ${events.map(ev => `
            <li class="reveal">
              <span class="t">${motif(ev.motif)}${esc(ev.time)}</span>
              <div>
                <h4>${esc(ev.title)}</h4>
                ${ev.note ? `<p>${esc(ev.note)}</p>` : ""}
              </div>
            </li>`).join("")}
        </ol>
        ${day.dress ? `<p class="dress reveal"><span class="label">Dress</span> ${esc(day.dress)}</p>` : ""}
      </article>`;
  }).join("");

  host.removeAttribute("aria-busy");
  observeReveals(host);
})();


/* ---------- countdown ---------- */
(function countdown(){
  const root = document.getElementById("countdown");
  if (!root) return;
  const out = {
    days:  root.querySelector('[data-cd="days"]'),
    hours: root.querySelector('[data-cd="hours"]'),
    mins:  root.querySelector('[data-cd="mins"]'),
    secs:  root.querySelector('[data-cd="secs"]')
  };
  const target = new Date(WEDDING.countdownTo).getTime();
  const pad = n => String(n).padStart(2, "0");

  function tick(){
    const diff = target - Date.now();
    if (diff <= 0){
      root.innerHTML = '<p class="cd-done">Today is the day.</p>';
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    out.days.textContent  = Math.floor(s / 86400);
    out.hours.textContent = pad(Math.floor(s % 86400 / 3600));
    out.mins.textContent  = pad(Math.floor(s % 3600 / 60));
    out.secs.textContent  = pad(s % 60);
  }
  tick();
  const timer = setInterval(tick, 1000);
})();


/* ---------- RSVP link ---------- */
(function rsvp(){
  const el = document.getElementById("rsvpLink");
  if (!el) return;
  if (WEDDING.rsvpUrl){
    el.href = WEDDING.rsvpUrl;
  } else {
    el.removeAttribute("target");
    el.addEventListener("click", e => {
      e.preventDefault();
      alert("The RSVP form isn't linked yet.\n\nAdd your Google Form link to WEDDING.rsvpUrl at the top of main.js.");
    });
  }
})();


/* ---------- add to calendar (.ics download) ---------- */
(function calendar(){
  const btn = document.getElementById("ics");
  if (!btn) return;

  const stamp = iso => new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = t => String(t).replace(/[\\;,]/g, m => "\\" + m).replace(/\n/g, "\\n");

  btn.addEventListener("click", () => {
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0",
      "PRODID:-//wedding-invite//EN", "CALSCALE:GREGORIAN"
    ];
    WEDDING.events.forEach((ev, i) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:wedding-${i}-${stamp(ev.start)}@invite`,
        `DTSTAMP:${stamp(new Date().toISOString())}`,
        `DTSTART:${stamp(ev.start)}`,
        `DTEND:${stamp(ev.end)}`,
        `SUMMARY:${esc(ev.title)}`,
        `LOCATION:${esc(ev.location)}`,
        `DESCRIPTION:${esc(ev.description)}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");

    // .ics requires CRLF line endings
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = WEDDING.couple.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();


/* ---------- background music ----------
   Starts only from the guest's own gesture (opening the envelope), which
   is also what browser autoplay policy requires. Fades in rather than
   arriving at full volume. The control hides itself entirely if no audio
   file is present, so a missing assets/music.mp3 costs nothing.      */
const MUSIC = { volume: 0.32, fadeMs: 2600 };

const music = (function(){
  const audio = document.getElementById("music");
  const btn   = document.getElementById("musicBtn");
  if (!audio || !btn) return { start(){} };

  let available = true, started = false, fadeTimer = null;
  const stored = (() => { try { return sessionStorage.getItem("musicMuted"); } catch(e){ return null; } })();
  let muted = stored === "1";

  // No file, wrong format, or it failed to load: remove the control.
  audio.addEventListener("error", vanish, true);
  audio.querySelector("source")?.addEventListener("error", vanish);

  function vanish(){
    available = false;
    btn.remove();
  }

  function paint(){
    btn.classList.toggle("is-muted", muted);
    btn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    btn.setAttribute("aria-pressed", String(muted));
  }

  function fadeTo(target){
    clearInterval(fadeTimer);
    const from = audio.volume, steps = 30, dt = MUSIC.fadeMs / steps;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * (i / steps)));
      if (i >= steps){
        clearInterval(fadeTimer);
        if (target === 0) audio.pause();
      }
    }, dt);
  }

  async function start(){
    if (!available || started || muted) { paint(); return; }
    started = true;
    audio.volume = 0;
    try {
      await audio.play();
      btn.classList.add("is-ready");
      paint();
      fadeTo(MUSIC.volume);
    } catch (err) {
      // Autoplay refused, or nothing to play. Offer the control anyway
      // so the guest can start it deliberately.
      started = false;
      if (audio.error) return vanish();
      muted = true;
      btn.classList.add("is-ready");
      paint();
    }
  }

  btn.addEventListener("click", async () => {
    muted = !muted;
    try { sessionStorage.setItem("musicMuted", muted ? "1" : "0"); } catch(e){}
    paint();
    if (muted){
      fadeTo(0);
    } else {
      audio.volume = 0;
      try { await audio.play(); started = true; fadeTo(MUSIC.volume); }
      catch(e){ muted = true; paint(); }
    }
  });

  paint();
  return { start };
})();


/* ---------- Motion ----------
   Motion One — the vanilla build of Framer Motion, same author, same
   animate/inView/scroll API, no build step. Loaded as an ES module from
   a CDN and entirely optional: if the import fails the CSS reveal
   transitions already in styles.css carry the page unchanged.

   Scroll-linked only. Nothing loops forever.                         */
const MOTION_SRC = "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

(async function motion(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let M;
  try {
    M = await import(MOTION_SRC);
  } catch (err) {
    console.info("[motion] library unavailable — using CSS reveals", err?.message || err);
    return;
  }

  const { animate, inView, scroll } = M;
  document.documentElement.classList.add("has-motion");

  const ease = [0.2, 0.7, 0.3, 1];

  /* Reveals. Anything the IntersectionObserver already showed is left
     alone, so taking over mid-page never causes a flash. */
  document.querySelectorAll(".reveal:not(.is-in)").forEach(el => {
    inView(el, () => {
      animate(el,
        { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
        { duration: 0.9, easing: ease }
      );
      el.classList.add("is-in");
    }, { amount: 0.15 });
  });

  /* ── 2 · the photographs are laid down ──
     Each print arrives lifted, straighter and slightly larger, then
     settles onto its resting angle — the way a photograph looks when a
     hand lets go of it. The end state is the angle CSS already holds,
     so if this never runs the composition is simply already in place.
     inView fires once; it does not re-run on every scroll past. */
  const stationery = document.querySelector(".stationery");
  if (stationery){
    const prints = [
      [".print--a", "rotate(-9deg) translateY(-30px) scale(1.035)", "rotate(-4.2deg) translateY(0px) scale(1)", 0],
      [".print--b", "rotate(8.5deg) translateY(-34px) scale(1.035)", "rotate(3.1deg) translateY(0px) scale(1)", 0.42]
    ];
    inView(stationery, () => {
      prints.forEach(([sel, from, to, delay]) => {
        const el = stationery.querySelector(sel);
        if (!el) return;
        animate(el, { opacity: [0, 1], transform: [from, to] },
          { duration: 1.5, delay, easing: [0.16, 0.72, 0.24, 1] });
      });

      // the clip goes on last, once both prints have settled
      const clip = stationery.querySelector(".clip");
      if (clip){
        animate(clip,
          { opacity: [0, 1],
            transform: ["rotate(22deg) translateY(-16px) scale(.9)", "rotate(9deg) translateY(0px) scale(1)"] },
          { duration: 1.1, delay: 1.5, easing: ease });
      }

      // the drawn stationery fades up quietly behind it all
      stationery.querySelectorAll(".pressed, .lotus, .stamp").forEach((el, i) => {
        const rest = getComputedStyle(el).opacity;
        animate(el, { opacity: [0, rest] },
          { duration: 1.4, delay: 1.7 + i * 0.22, easing: ease });
      });
    }, { amount: 0.3 });
  }

})();


/* ---------- sticky nav border + active section ---------- */
(function nav(){
  const bar = document.getElementById("nav");
  if (bar){
    const onScroll = () => bar.classList.toggle("is-stuck", window.scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));
})();
