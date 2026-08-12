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
  countdownTo: "2026-12-05T10:00:00+05:30",

  // Paste your Google Form's share link here (the "Send → link" URL).
  // Until you do, the RSVP button shows a friendly note instead.
  rsvpUrl: "",

  // Calendar entries created by the "Add to calendar" button.
  events: [
    {
      title: "Smriti & Joey — Haldi, Mehendi & Sangeet",
      start: "2026-12-05T10:00:00+05:30",
      end:   "2026-12-05T23:59:00+05:30",
      location: "The Terrace at Bandra Reclamation, Bandra West, Mumbai 400050",
      description: "Day one: Haldi from 10am, Mehendi from 2pm, Sangeet from 7pm. Dress: yellows and whites."
    },
    {
      title: "Smriti & Joey — Wedding Ceremony & Reception",
      start: "2026-12-06T17:00:00+05:30",
      end:   "2026-12-06T23:59:00+05:30",
      location: "Sea-facing Lawns, Worli Sea Face, Mumbai 400018",
      description: "Day two: Baraat 5pm, Pheras 6:30pm, Reception & dinner 8:30pm. Dress: Indian formal."
    }
  ]
};

/* Envelope intro timings, in milliseconds from page load.
   Set INTRO.play to false to switch the whole thing off.
   Scrolling or swiping opens it early — INTRO.step paces that. */
const INTRO = {
  play: true,
  oncePerTab: true,   // false = the envelope opens on every page load
  unseal: 1900,       // wax seal breaks — the hold before this is the "look at the seal" beat
  open:  2500,        // flap swings open
  slide: 3500,        // card slides out
  fade:  4600,        // overlay starts fading
  end:   5400,        // overlay removed, page unlocked
  step:   420         // gap between stages when the guest scrolls/swipes to hurry it along
};
/* ========================= end of edits ===================== */


/* ---------- envelope intro ----------
   The inline script in <head> already decided whether this runs by
   adding .has-intro to <html> (skipped for reduced-motion, repeat
   visits in the same tab, and JavaScript-off).                      */
(function envelope(){
  const root = document.documentElement;
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

  // The opening runs as three stages. Timers walk through them on their own;
  // a scroll or a swipe walks through them faster.
  const STAGES = ["is-unsealed", "is-open", "is-out"];
  let stage = 0, hurried = false, done = false;
  let timers = [];

  function to(n){
    while (stage < n && stage < STAGES.length) intro.classList.add(STAGES[stage++]);
  }

  timers.push(
    setTimeout(() => to(1), INTRO.unseal),
    setTimeout(() => to(2), INTRO.open),
    setTimeout(() => to(3), INTRO.slide),
    setTimeout(fade,        INTRO.fade),
    setTimeout(finish,      INTRO.end)
  );

  function clear(){ timers.forEach(clearTimeout); timers = []; }
  function fade(){ intro.classList.add("is-gone"); }

  function finish(){
    if (done) return;
    done = true;
    clear();
    root.classList.remove("has-intro");
    intro.remove();
    detach();
    // Opening the envelope is the gesture that lets audio play.
    music.start();
  }

  /* scroll / swipe / click: run the remaining stages back to back */
  function hurry(){
    if (hurried || done) return;
    hurried = true;
    intro.classList.add("is-hurried");
    clear();

    let d = 0;
    for (let i = stage; i < STAGES.length; i++){
      const cls = STAGES[i];
      timers.push(setTimeout(() => intro.classList.add(cls), d));
      d += INTRO.step;
    }
    stage = STAGES.length;
    timers.push(setTimeout(fade, d + 200), setTimeout(finish, d + 1000));
  }

  /* skip: straight out, no opening */
  function skip(e){
    if (e) e.stopPropagation();
    if (done) return;
    clear();
    fade();
    timers.push(setTimeout(finish, 600));
  }

  const HURRY_KEYS = ["ArrowDown","ArrowUp","PageDown","PageUp"," ","Enter"];
  function onKey(e){
    if (e.key === "Escape") return skip();
    if (HURRY_KEYS.includes(e.key)){ e.preventDefault(); hurry(); }
  }

  // Desktop: the wheel opens it.
  function onWheel(e){ e.preventDefault(); hurry(); }

  // Mobile: a swipe in either direction opens it. Anything under 24px is a tap.
  let touchY = null;
  function onTouchStart(e){ touchY = e.touches[0].clientY; }
  function onTouchMove(e){
    e.preventDefault();
    if (touchY === null) return;
    if (Math.abs(e.touches[0].clientY - touchY) > 24){ touchY = null; hurry(); }
  }

  function detach(){
    document.removeEventListener("keydown", onKey);
    intro.removeEventListener("wheel", onWheel);
    intro.removeEventListener("touchstart", onTouchStart);
    intro.removeEventListener("touchmove", onTouchMove);
  }

  document.addEventListener("keydown", onKey);
  intro.addEventListener("wheel", onWheel, { passive: false });
  intro.addEventListener("touchstart", onTouchStart, { passive: true });
  intro.addEventListener("touchmove", onTouchMove, { passive: false });
  intro.addEventListener("click", () => hurry());
  document.getElementById("introSkip")?.addEventListener("click", skip);

  // Tell the guest which gesture applies to the device they're holding.
  const hint = document.getElementById("introHint");
  if (hint && matchMedia("(hover: none)").matches) hint.textContent = "Swipe to open";
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


/* ---------- day page decoration ----------
   A little drawn something in the corners of each day, keyed to that
   day's tint. Small and quiet: two corners, nothing animated.      */
const DECO = {
  marigold: `
    <svg class="day-page__deco day-page__deco--a" viewBox="0 0 120 120" fill="none"
         stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
      <circle cx="60" cy="60" r="17"/>
      <g opacity=".85">
        <path d="M60 32 L60 20"/><path d="M60 100 L60 88"/>
        <path d="M32 60 L20 60"/><path d="M100 60 L88 60"/>
        <path d="M40 40 L31 31"/><path d="M80 80 L89 89"/>
        <path d="M80 40 L89 31"/><path d="M40 80 L31 89"/>
      </g>
      <circle cx="60" cy="60" r="7" opacity=".5"/>
    </svg>
    <svg class="day-page__deco day-page__deco--b" viewBox="0 0 120 120" fill="none"
         stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
      <path d="M20 100 C40 84 56 62 62 34"/>
      <circle cx="62" cy="26" r="8"/>
      <path d="M54 22 C58 14 68 14 72 20" opacity=".8"/>
      <path d="M38 78 C32 68 34 56 42 52 C48 60 46 72 38 78 Z"/>
      <path d="M52 56 C46 46 48 34 56 30 C62 38 60 50 52 56 Z" opacity=".7"/>
      <circle cx="30" cy="92" r="2.5" fill="currentColor" stroke="none"/>
    </svg>`,

  leaf: `
    <svg class="day-page__deco day-page__deco--a" viewBox="0 0 120 120" fill="none"
         stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
      <path d="M100 20 C76 40 58 66 48 100"/>
      <path d="M86 34 C94 26 106 28 110 36 C100 44 88 42 86 34 Z"/>
      <path d="M72 52 C80 44 92 46 96 54 C86 62 74 60 72 52 Z" opacity=".85"/>
      <path d="M60 72 C68 64 80 66 84 74 C74 82 62 80 60 72 Z" opacity=".7"/>
      <circle cx="46" cy="106" r="2.5" fill="currentColor" stroke="none"/>
    </svg>
    <svg class="day-page__deco day-page__deco--b" viewBox="0 0 120 120" fill="none"
         stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
      <path d="M24 96 C36 72 34 46 22 24"/>
      <path d="M28 74 C38 70 48 76 50 84 C40 90 30 84 28 74 Z"/>
      <path d="M26 50 C36 46 46 52 48 60 C38 66 28 60 26 50 Z" opacity=".8"/>
      <circle cx="60" cy="30" r="6"/>
      <path d="M60 24 L60 16 M54 30 L46 30 M66 30 L74 30" opacity=".6"/>
    </svg>`,

  rose: `
    <svg class="day-page__deco day-page__deco--a" viewBox="0 0 120 120" fill="none"
         stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
      <circle cx="60" cy="60" r="9"/>
      <path d="M60 51 C50 44 40 50 42 60 C32 62 32 74 42 76 C44 86 56 88 60 79
               C64 88 76 86 78 76 C88 74 88 62 78 60 C80 50 70 44 60 51 Z" opacity=".8"/>
      <circle cx="60" cy="60" r="3" fill="currentColor" stroke="none" opacity=".6"/>
    </svg>
    <svg class="day-page__deco day-page__deco--b" viewBox="0 0 120 120" fill="none"
         stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">
      <path d="M24 100 C44 84 58 60 62 32"/>
      <circle cx="64" cy="24" r="7"/>
      <path d="M40 76 C34 66 36 54 44 50 C50 58 48 70 40 76 Z"/>
      <circle cx="30" cy="90" r="2.5" fill="currentColor" stroke="none"/>
    </svg>`
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

  // Each day is its own full-screen page in its own colour. Set "tint"
  // per day in the JSON to choose; otherwise they alternate.
  const TINTS = ["yellow", "red", "leaf", "rose"];

  host.outerHTML = days.map((day, i) => {
    const events = Array.isArray(day.events) ? day.events : [];
    const tint = TINTS.includes(day.tint) ? day.tint : TINTS[i % 2];
    return `
      <section class="section section--alt day-page day-page--${tint}"
               id="day-${i + 1}" data-dot="${esc(day.label || day.date)}">
        ${DECO[tint] || ""}
        <div class="day-page__inner reveal">
          <svg class="day__crest" viewBox="0 0 60 26" fill="none" stroke="currentColor"
               stroke-width="1.2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 6 C16 20 44 20 56 6"/>
            <circle cx="14" cy="15" r="2.6"/><circle cx="23" cy="18.5" r="2.6"/>
            <circle cx="32" cy="19.5" r="2.6"/><circle cx="41" cy="18" r="2.6"/>
            <circle cx="49" cy="14" r="2.6"/>
            <path d="M30 6 C33 2 37 2 39 5" opacity=".7"/>
          </svg>
          ${day.label ? `<span class="day__num">${esc(day.label)}</span>` : ""}
          <h2>${esc(day.date)}</h2>
          ${day.venue ? `<p class="day__place">${esc(day.venue)}</p>` : ""}
          <ol class="timeline">
            ${events.map(ev => `
              <li>
                <span class="t">${motif(ev.motif)}${esc(ev.time)}</span>
                <div>
                  <h4>${esc(ev.title)}</h4>
                  ${ev.note ? `<p>${esc(ev.note)}</p>` : ""}
                </div>
              </li>`).join("")}
          </ol>
          ${day.dress ? `<p class="dress"><span class="label">Dress</span> ${esc(day.dress)}</p>` : ""}
        </div>
      </section>`;
  }).join("");

  // host was replaced by the day pages above, so re-find them to reveal.
  document.querySelectorAll(".day-page").forEach(p => observeReveals(p));
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


/* ---------- mobile pager ----------
   Scroll snapping only decides where a drag lands — you can still drag
   the page around mid-gesture, which is what makes it feel like a web
   page instead of an app. This takes the gesture itself: one swipe is
   one page, and there is no dragging in between.

   It deliberately stands aside for horizontal swipes (the carousels)
   and for anything that can still scroll inside itself (a day's list of
   events), so those keep working natively.                          */
const PAGER = {
  swipe: 45,   // px of travel before it counts as a swipe
  lock: 620    // ms to ignore further gestures while a page is moving
};

(function pager(){
  const mq = matchMedia("(max-width: 768px)");
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  let pages = [];
  const collect = () => { pages = [...document.querySelectorAll(".hero, .section, .chapter, .foot")]; };
  collect();
  if (!pages.length) return;

  // Tells the stylesheet the pager is running, which switches CSS scroll
  // snapping off. The two fight: mandatory snapping keeps re-snapping
  // during our own smooth scroll, which is what made the page spring
  // back when you swiped up. Snapping stays in the CSS as the fallback
  // for anyone whose JavaScript never gets this far.
  document.documentElement.classList.add("has-pager");

  let busy = false, startY = 0, startX = 0, startEl = null, owner = null, wheelUntil = 0;

  // Which page are we actually on? Measured, so the dots and nav links
  // can move us and the pager stays in step.
  function current(){
    const mid = scrollY + innerHeight / 2;
    let best = 0, bd = Infinity;
    pages.forEach((el, i) => {
      const c = el.offsetTop + el.offsetHeight / 2;
      const d = Math.abs(c - mid);
      if (d < bd){ bd = d; best = i; }
    });
    return best;
  }

  let settleTimer = null, targetTop = 0;

  function go(dir){
    if (busy) return;
    const i = current();
    const n = Math.max(0, Math.min(pages.length - 1, i + dir));
    if (n === i) return;
    busy = true;

    // Absolute position rather than scrollIntoView: it can't be nudged by
    // scroll-margin or by an ancestor deciding to scroll instead.
    targetTop = Math.round(pages[n].getBoundingClientRect().top + scrollY);
    scrollTo({ top: targetTop, behavior: reduced() ? "auto" : "smooth" });

    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      busy = false;
      // If the animation was interrupted and we came to rest anywhere
      // other than the target, land it. This is what stopped the page
      // drifting back when reversing direction.
      if (Math.abs(scrollY - targetTop) > 2) scrollTo({ top: targetTop, behavior: "auto" });
    }, PAGER.lock);
  }

  /* Walks up from the touched element looking for something that can
     still scroll in the direction of travel. dy < 0 means the finger
     moved up, so the content underneath wants to scroll down. */
  function innerScroller(node, dy){
    while (node && node !== document.body && node.nodeType === 1){
      const oy = getComputedStyle(node).overflowY;
      if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 2){
        const atTop    = node.scrollTop <= 0;
        const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
        if ((dy < 0 && !atBottom) || (dy > 0 && !atTop)) return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  const introUp = () => !!document.getElementById("intro");

  function onStart(e){
    if (e.touches.length !== 1) return;      // leave pinch-zoom alone
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    startEl = e.target;
    owner = ownedByCarousel(e.target) ? "carousel" : "page";
  }

  /* Who owns this gesture? Decided once, at touchstart, from where the
     finger landed — never re-judged mid-gesture. Judging per move was
     the bug: iOS commits to a native scroll on the first move that
     isn't prevented, so a hard sideways flick that curved downwards
     used to escape the lock and scroll the page. */
  function ownedByCarousel(node){
    return !!(node && node.closest && node.closest(".cards"));
  }

  function onMove(e){
    if (!mq.matches || introUp() || e.touches.length !== 1) return;
    if (owner === "carousel") return;                 // touch-action: pan-x holds it
    const dy = e.touches[0].clientY - startY;
    if (innerScroller(startEl, dy)) return;           // a list that can still scroll
    e.preventDefault();                                // the page itself never drags
  }

  function onEnd(e){
    if (!mq.matches || introUp() || !startEl) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - startY;
    const dx = t.clientX - startX;
    const own = owner;
    startEl = null; owner = null;
    if (own === "carousel") return;
    if (Math.abs(dx) > Math.abs(dy)) return;
    if (Math.abs(dy) < PAGER.swipe) return;
    go(dy < 0 ? 1 : -1);
  }

  function onWheel(e){
    if (!mq.matches || introUp()) return;
    if (innerScroller(e.target, -e.deltaY)) return;
    e.preventDefault();
    if (Date.now() < wheelUntil || Math.abs(e.deltaY) < 8) return;
    wheelUntil = Date.now() + PAGER.lock;
    go(e.deltaY > 0 ? 1 : -1);
  }

  addEventListener("touchstart", onStart, { passive: true });
  addEventListener("touchmove",  onMove,  { passive: false });
  addEventListener("touchend",   onEnd,   { passive: true });
  addEventListener("wheel",      onWheel, { passive: false });
  addEventListener("resize", collect);
})();


/* ---------- mobile card dots ----------
   One dot per card. Highlights whichever card is on screen, and tapping
   one jumps to it. Hidden on desktop by CSS, so this is harmless there. */
(function dots(){
  const rail = document.getElementById("dots");
  if (!rail) return;

  // Built from the page order in the DOM, so day pages added in the
  // agenda JSON get their own dot without touching this list.
  const cards = [...document.querySelectorAll("[data-dot]")]
    .map(el => [el, el.getAttribute("data-dot")]);

  if (!cards.length) return;

  const buttons = cards.map(([el, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.addEventListener("click", () => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    rail.appendChild(b);
    return b;
  });

  if (!("IntersectionObserver" in window)) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = cards.findIndex(([el]) => el === e.target);
      buttons.forEach((b, n) => b.classList.toggle("is-on", n === i));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  cards.forEach(([el]) => spy.observe(el));
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

  /* Botanicals drift against the scroll — the parallax is deliberately
     small, 30px over a whole screen. */
  document.querySelectorAll(".bota").forEach(el => {
    const up = el.classList.contains("bota--tl") || el.classList.contains("bota--tr");
    const d = up ? 30 : -30;
    const section = el.closest("section") || el.parentElement;
    scroll(
      animate(el, { transform: [`translateY(${d}px)`, `translateY(${-d}px)`] }, { easing: "linear" }),
      { target: section, offset: ["start end", "end start"] }
    );
  });

  /* The jharokha opens once, when you reach it. */
  const arch = document.querySelector(".arch");
  if (arch){
    inView(arch, () => {
      animate(arch,
        { opacity: [0, 1], transform: ["scale(0.94)", "scale(1)"] },
        { duration: 1.3, easing: ease }
      );
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
