document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Globe scroll choreography ---------- */
  // Positions the fixed globe travels through (vw / vh / scale), keyed to
  // sections that carry a data-globe attribute.
  const globePositions = [
    { left: 78, top: 52, scale: 1.45, opacity: 0.95 }, // hero  → right
    { left: 50, top: 42, scale: 2.6,  opacity: 0.30 }, // branchen → big backdrop, faint
  ];

  const globeLayer = document.getElementById('globeLayer');
  const globeSections = Array.from(document.querySelectorAll('[data-globe]'));
  let globeFadeStart = null; // first section that fades the globe out

  function setGlobe(pos) {
    globeLayer.style.transform =
      `translate3d(${pos.left}vw, ${pos.top}vh, 0) scale(${pos.scale})`;
    globeLayer.style.opacity = pos.opacity;
  }
  if (globePositions.length) setGlobe(globePositions[0]);

  /* ---------- Scroll handler (RAF throttled) ---------- */
  const header = document.getElementById('header');
  const progress = document.getElementById('progressFill');
  let ticking = false;

  function onScroll() {
    const scrollTop = window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? Math.min(Math.max(scrollTop / docH, 0), 1) : 0;
    progress.style.transform = `scaleX(${p})`;

    header.classList.toggle('header--scrolled', scrollTop > 30);

    // Decide which globe-bearing section is closest to viewport centre
    const vc = window.innerHeight / 2;
    let active = 0, min = Infinity, fade = false;
    globeSections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - vc);
      const key = sec.dataset.globe;
      if (dist < min) {
        min = dist;
        if (key === 'fade') { fade = true; }
        else { active = parseInt(key, 10) || 0; fade = false; }
      }
    });

    if (fade) {
      // keep last position but fade out so content takes over
      globeLayer.style.opacity = 0;
    } else if (globePositions[active]) {
      setGlobe(globePositions[active]);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Section nav dots ---------- */
  const dotsWrap = document.getElementById('dots');
  const navTargets = [
    { id: 'hero', label: 'Start' },
    { id: 'branchen', label: 'Branchen' },
    { id: 'leistungen', label: 'Leistungen' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'prozess', label: 'Ablauf' },
    { id: 'preise', label: 'Preise' },
    { id: 'ueber', label: 'Über mich' },
    { id: 'kontakt', label: 'Kontakt' },
  ];
  const sections = [];
  navTargets.forEach(t => {
    const sec = document.getElementById(t.id);
    if (!sec) return;
    const b = document.createElement('button');
    b.dataset.label = t.label;
    b.setAttribute('aria-label', t.label);
    b.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    dotsWrap.appendChild(b);
    sections.push({ sec, btn: b });
  });

  const dotIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        sections.forEach(s => s.btn.classList.toggle('active', s.sec === e.target));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => dotIO.observe(s.sec));

  /* ---------- Count-up numbers ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1600, start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const prog = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(ease(prog) * target);
        if (prog < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('mobile');
  const toggle = () => {
    burger.classList.toggle('active');
    mobile.classList.toggle('active');
    document.body.style.overflow = mobile.classList.contains('active') ? 'hidden' : '';
  };
  burger.addEventListener('click', toggle);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('active');
    mobile.classList.remove('active');
    document.body.style.overflow = '';
  }));

  /* ---------- Smooth anchor offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Pricing toggle (animated price) ---------- */
  const priceToggle = document.getElementById('priceToggle');
  const priceAmount = document.getElementById('priceAmount');
  const priceNote = document.getElementById('priceNote');
  if (priceToggle && priceAmount) {
    let animId;
    const animatePrice = (to) => {
      const from = parseInt(priceAmount.textContent, 10) || to;
      const dur = 450, start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      cancelAnimationFrame(animId);
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        priceAmount.textContent = Math.round(from + (to - from) * ease(p));
        if (p < 1) animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    };
    priceToggle.querySelectorAll('.toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        priceToggle.querySelectorAll('.toggle__btn').forEach(b => {
          b.classList.remove('active'); b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
        animatePrice(parseInt(btn.dataset.price, 10));
        if (priceNote) priceNote.innerHTML =
          `${btn.dataset.months}&nbsp;Monate Laufzeit · zzgl. einmalig 400&nbsp;€ Erstzahlung`;
      });
    });
  }

  /* ---------- Contact form → Formspree (echtes Backend, speichert jede Anfrage) ---------- */
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Wird gesendet …';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          btn.innerHTML = '✓ Danke! Ich melde mich in 24 Std.';
          btn.style.background = '#1faa59';
          btn.style.borderColor = '#1faa59';
        } else {
          throw new Error('send failed');
        }
      } catch (err) {
        btn.innerHTML = 'Fehler — bitte anrufen: 0179 4741210';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = original; }, 5000);
      }
    });
  }

  /* ---------- Website Finder (interactive quiz) ---------- */
  (function () {
    var finder = document.getElementById('finder');
    var body = document.getElementById('finderBody');
    var bar = document.getElementById('finderBar');
    var openBtn = document.getElementById('openFinder');
    if (!finder || !body || !openBtn) return;

    var steps = [
      { key: 'branche', type: 'single', q: 'In welcher Branche bist du?', opts: [
        { i: '✂️', t: 'Friseur / Beauty' }, { i: '🍽️', t: 'Gastronomie' },
        { i: '🔧', t: 'Handwerk / Elektro' }, { i: '🛍️', t: 'Einzelhandel' },
        { i: '💪', t: 'Fitness / Gesundheit' }, { i: '💼', t: 'Dienstleistung' },
        { i: '🏢', t: 'Immobilien / Bau' }, { i: '✨', t: 'Andere Branche' } ] },
      { key: 'ziel', type: 'single', q: 'Was soll deine Website vor allem erreichen?', opts: [
        { i: '📈', t: 'Mehr Anfragen & Kunden' }, { i: '📅', t: 'Online-Termine / Reservierung' },
        { i: '⭐', t: 'Bekannter werden & Image' }, { i: '🛒', t: 'Produkte online verkaufen' } ] },
      { key: 'status', type: 'single', q: 'Hast du schon eine Website?', opts: [
        { i: '🆕', t: 'Nein, ganz neu' }, { i: '🔁', t: 'Ja, aber veraltet' },
        { i: '😕', t: 'Ja, gefällt mir nicht' }, { i: '📷', t: 'Nur Social Media' } ] },
      { key: 'umfang', type: 'single', q: 'Wie groß soll die Website werden?', opts: [
        { i: '📄', t: 'Eine Seite (One-Pager)' }, { i: '🗂️', t: 'Mehrere Seiten (3–5)' },
        { i: '📚', t: 'Umfangreich (viele Seiten)' }, { i: '🤔', t: 'Weiß ich noch nicht' } ] },
      { key: 'stil', type: 'single', q: 'Welcher Stil gefällt dir am besten?', opts: [
        { i: '🖤', t: 'Elegant & edel' }, { i: '⬜', t: 'Modern & minimal' },
        { i: '🔥', t: 'Warm & einladend' }, { i: '⚡', t: 'Kräftig & auffällig' } ] },
      { key: 'features', type: 'multi', q: 'Was ist dir besonders wichtig? (Mehrfachauswahl)', opts: [
        { i: '📅', t: 'Terminbuchung' }, { i: '🖼️', t: 'Bildergalerie' },
        { i: '📜', t: 'Speisekarte / Leistungen' }, { i: '✉️', t: 'Kontaktformular' },
        { i: '⭐', t: 'Bewertungen' }, { i: '🛒', t: 'Online-Shop' },
        { i: '🗺️', t: 'Google Maps & Anfahrt' }, { i: '🌐', t: 'Mehrsprachig' } ] },
      { key: 'tempo', type: 'single', q: 'Wie schnell brauchst du die Website?', opts: [
        { i: '🚀', t: 'So schnell wie möglich' }, { i: '🗓️', t: 'In 2–4 Wochen' },
        { i: '🌱', t: 'Kein Zeitdruck' } ] },
      { key: 'extra', type: 'text', q: 'Hast du besondere Wünsche?', placeholder: 'z. B. bestimmte Farben, Funktionen, Vorbilder, Logo vorhanden … (optional)' }
    ];
    var answers = {}, cur = 0;

    function open() { finder.classList.add('open'); finder.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; cur = 0; answers = {}; render(); }
    function close() { finder.classList.remove('open'); finder.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

    function render() {
      var total = steps.length, s = steps[cur];
      var last = cur === total - 1;
      bar.style.width = (cur / total) * 100 + '%';
      var h = '<span class="finder__step-no">Frage ' + (cur + 1) + ' / ' + total + '</span>';
      h += '<h3 class="finder__q">' + s.q + '</h3>';

      if (s.type === 'text') {
        h += '<textarea class="finder__text" id="finderText" rows="4" placeholder="' + (s.placeholder || '') + '">' + (answers[s.key] || '') + '</textarea>';
        h += '<div class="finder__actions"><button class="finder__back" data-back>← zurück</button><button class="btn btn--primary" data-next>Ergebnis anzeigen →</button></div>';
        body.innerHTML = h;
        return;
      }

      var sel = answers[s.key] || (s.type === 'multi' ? [] : null);
      h += '<div class="finder__opts">';
      s.opts.forEach(function (o) {
        var on = s.type === 'multi' ? sel.indexOf(o.t) > -1 : sel === o.t;
        h += '<button type="button" class="finder__opt' + (on ? ' sel' : '') + '" data-val="' + o.t + '"><span class="ic">' + o.i + '</span>' + o.t + '</button>';
      });
      h += '</div>';
      if (s.type === 'multi') h += '<div class="finder__actions"><button class="finder__back" data-back>← zurück</button><button class="btn btn--primary" data-next>Weiter →</button></div>';
      else if (cur > 0) h += '<div class="finder__actions"><button class="finder__back" data-back>← zurück</button><span></span></div>';
      else h += '<p class="finder__hint">Tippe einfach an — es geht automatisch weiter.</p>';
      body.innerHTML = h;
    }

    function next() { if (cur < steps.length - 1) { cur++; render(); } else result(); }

    function styleWord(s) {
      return ({ 'Elegant & edel': 'eleganten, edlen', 'Modern & minimal': 'modern-minimalistischen',
        'Warm & einladend': 'warmen, einladenden', 'Kräftig & auffällig': 'kräftigen, auffälligen' }[s]) || 'modernen';
    }
    function zielWord(z) {
      if (!z) return 'mehr Anfragen zu bringen';
      if (z.indexOf('Termine') > -1) return 'Besucher direkt zu Buchungen zu führen';
      if (z.indexOf('verkaufen') > -1) return 'deine Produkte zu verkaufen';
      if (z.indexOf('Image') > -1) return 'Vertrauen und Bekanntheit aufzubauen';
      return 'dir mehr Anfragen zu bringen';
    }

    function result() {
      bar.style.width = '100%';
      var b = answers.branche || 'dein Geschäft', z = answers.ziel || '', st = answers.stil || '', f = answers.features || [], u = answers.umfang || '';
      var pkg = 'Premium', why = 'der ideale Mittelweg aus Wirkung und Preis';
      if (z.indexOf('verkaufen') > -1 || f.indexOf('Online-Shop') > -1 || f.length >= 4 || u.indexOf('Umfangreich') > -1) { pkg = 'Komplett'; why = 'du hast viel vor — da lohnt sich das Rundum-Paket (inkl. Websites für all deine Unternehmen)'; }
      else if (f.length <= 1 && u.indexOf('One-Pager') > -1) { pkg = 'Start'; why = 'ein starker, schlanker Auftritt reicht hier völlig'; }
      var tags = [b, z, u, st].filter(Boolean).concat(f).map(function (t) { return '<span>' + t + '</span>'; }).join('');
      var h = '<div class="finder__result"><span class="finder__result-badge">Deine Richtung steht 🎯</span>';
      h += '<h3>So sieht deine Website-Richtung aus.</h3>';
      h += '<p>Für <b>' + b + '</b> mit dem Ziel „' + z + '" empfehle ich einen <b>' + styleWord(st) + '</b> Auftritt — klar aufgebaut, auf dem Handy perfekt und darauf ausgelegt, ' + zielWord(z) + '.</p>';
      h += '<div class="finder__result-tags">' + tags + '</div>';
      h += '<div class="reco">Mein Vorschlag: das <b>' + pkg + '</b>-Paket — ' + why + '.</div>';
      h += '<button class="btn btn--primary btn--block" id="finderToContact">Diese Richtung anfragen →</button>';
      h += '<p class="finder__hint">Kostenlos &amp; unverbindlich — ich melde mich innerhalb von 24 Stunden.</p></div>';
      body.innerHTML = h;
      document.getElementById('finderToContact').addEventListener('click', toContact);
    }

    function toContact() {
      var msg = 'Hallo Zaid! Ich habe den Website-Finder genutzt:\n'
        + '• Branche: ' + (answers.branche || '-') + '\n'
        + '• Ziel: ' + (answers.ziel || '-') + '\n'
        + '• Aktuelle Website: ' + (answers.status || '-') + '\n'
        + '• Umfang: ' + (answers.umfang || '-') + '\n'
        + '• Stil: ' + (answers.stil || '-') + '\n'
        + '• Wichtig: ' + ((answers.features || []).join(', ') || '-') + '\n'
        + '• Zeitrahmen: ' + (answers.tempo || '-') + '\n'
        + '• Extra-Wünsche: ' + (answers.extra || '-') + '\n\n'
        + 'Bitte melde dich mit einem Vorschlag. Danke!';
      var m = document.getElementById('msg'); if (m) m.value = msg;
      var selEl = document.getElementById('branche');
      if (selEl) {
        var map = { 'Friseur / Beauty': 'Friseur / Beauty', 'Gastronomie': 'Restaurant / Café / Bar', 'Handwerk / Elektro': 'Elektriker / Handwerk' };
        var want = map[answers.branche] || 'Andere';
        for (var i = 0; i < selEl.options.length; i++) { if (selEl.options[i].text === want) { selEl.selectedIndex = i; break; } }
      }
      close();
      var t = document.getElementById('kontakt');
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      setTimeout(function () { var n = document.getElementById('name'); if (n) n.focus(); }, 700);
    }

    body.addEventListener('click', function (e) {
      var opt = e.target.closest('.finder__opt');
      if (opt) {
        var s = steps[cur], v = opt.getAttribute('data-val');
        if (s.type === 'multi') {
          var arr = answers[s.key] || []; var ix = arr.indexOf(v);
          if (ix > -1) arr.splice(ix, 1); else arr.push(v);
          answers[s.key] = arr; opt.classList.toggle('sel');
        } else { answers[s.key] = v; setTimeout(next, 180); }
        return;
      }
      if (e.target.closest('[data-next]')) {
        var cs = steps[cur];
        if (cs.type === 'text') { var ta = document.getElementById('finderText'); answers[cs.key] = ta ? ta.value.trim() : ''; }
        return next();
      }
      if (e.target.closest('[data-back]')) { if (cur > 0) { cur--; render(); } return; }
    });

    openBtn.addEventListener('click', open);
    finder.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && finder.classList.contains('open')) close(); });
  })();
});


// ---------- WhatsApp Floating Button (Style + Button) ----------
(function () {
  var s = document.createElement("style");
  s.innerHTML = ".whatsapp-btn{position:fixed;bottom:30px;right:30px;width:60px;height:60px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(37,211,102,.4);transition:transform .25s,box-shadow .25s,background .25s;z-index:999;text-decoration:none}.whatsapp-btn:hover{background:#20ba5a;transform:scale(1.1);box-shadow:0 8px 22px rgba(37,211,102,.5)}.whatsapp-btn svg{width:34px;height:34px;fill:#fff}@media(max-width:768px){.whatsapp-btn{bottom:92px;right:16px;width:54px;height:54px}.whatsapp-btn svg{width:30px;height:30px}}";
  document.head.appendChild(s);
  var a = document.createElement("a");
  a.href = "https://wa.me/491794741210";
  a.className = "whatsapp-btn";
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "WhatsApp Chat starten");
  a.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.49-1.711zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
  document.body.appendChild(a);
})();
