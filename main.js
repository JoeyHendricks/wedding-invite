/* ============================================================
   EDIT EVERYTHING HERE
   ------------------------------------------------------------
   The two-day agenda lives in schedule.json — edit that file.
   These are the only values you need to change in this one.
   Times use +05:30 (India Standard Time) — keep that suffix.
   ============================================================ */
const WEDDING = {
  couple: "Joey & Smriti",

  // The moment the countdown counts down to (first event, day one).
  countdownTo: "2026-12-05T16:00:00+05:30",

  // Paste your Google Form's share link here (the "Send → link" URL).
  // Until you do, the RSVP button shows a friendly note instead.
  rsvpUrl: "",

  // Calendar entries created by the "Add to calendar" button.
  events: [
    {
      title: "Joey & Smriti — Mehendi & Sangeet",
      start: "2026-12-05T16:00:00+05:30",
      end:   "2026-12-05T23:59:00+05:30",
      location: "The Terrace at Bandra Reclamation, Bandra West, Mumbai 400050",
      description: "Day one: Mehendi from 4pm, Sangeet from 7pm, dancing from 10pm. Dress: festive Indian."
    },
    {
      title: "Joey & Smriti — Wedding Ceremony & Reception",
      start: "2026-12-06T09:30:00+05:30",
      end:   "2026-12-06T23:59:00+05:30",
      location: "Sea-facing Lawns, Worli Sea Face, Mumbai 400018",
      description: "Day two: Haldi 9:30am, Baraat 5pm, Pheras 6:30pm, Reception & dinner 8:30pm. Dress: Indian formal."
    }
  ]
};
/* ========================= end of edits ===================== */


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
