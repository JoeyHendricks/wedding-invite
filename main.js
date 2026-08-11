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
  countdownTo: "2026-12-05T16:00:00+05:30",

  // Paste your Google Form's share link here (the "Send → link" URL).
  // Until you do, the RSVP button shows a friendly note instead.
  rsvpUrl: "",

  // Calendar entries created by the "Add to calendar" button.
  events: [
    {
      title: "Smriti & Joey — Mehendi & Sangeet",
      start: "2026-12-05T16:00:00+05:30",
      end:   "2026-12-05T23:59:00+05:30",
      location: "The Terrace at Bandra Reclamation, Bandra West, Mumbai 400050",
      description: "Day one: Mehendi from 4pm, Sangeet from 7pm, dancing from 10pm. Dress: festive Indian."
    },
    {
      title: "Smriti & Joey — Wedding Ceremony & Reception",
      start: "2026-12-06T09:30:00+05:30",
      end:   "2026-12-06T23:59:00+05:30",
      location: "Sea-facing Lawns, Worli Sea Face, Mumbai 400018",
      description: "Day two: Haldi 9:30am, Baraat 5pm, Pheras 6:30pm, Reception & dinner 8:30pm. Dress: Indian formal."
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

  host.innerHTML = days.map(day => {
    const events = Array.isArray(day.events) ? day.events : [];
    return `
      <article class="day reveal">
        <header class="day__head">
          ${day.label ? `<span class="day__num">${esc(day.label)}</span>` : ""}
          <h3>${esc(day.date)}</h3>
          ${day.venue ? `<p class="day__place">${esc(day.venue)}</p>` : ""}
        </header>
        <ol class="timeline">
          ${events.map(ev => `
            <li>
              <span class="t">${esc(ev.time)}</span>
              <div>
                <h4>${esc(ev.title)}</h4>
                ${ev.note ? `<p>${esc(ev.note)}</p>` : ""}
              </div>
            </li>`).join("")}
        </ol>
        ${day.dress ? `<p class="dress"><span class="label">Dress</span> ${esc(day.dress)}</p>` : ""}
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


/* ---------- mobile card dots ----------
   One dot per card. Highlights whichever card is on screen, and tapping
   one jumps to it. Hidden on desktop by CSS, so this is harmless there. */
(function dots(){
  const rail = document.getElementById("dots");
  if (!rail) return;

  const cards = [
    ["#top",      "Invitation"],
    ["#story",    "Our story"],
    ["#schedule", "Schedule"],
    ["#travel",   "Travel"],
    ["#gallery",  "Photos"],
    ["#rsvp",     "RSVP"]
  ].map(([sel, label]) => [document.querySelector(sel), label])
   .filter(([el]) => el);

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
