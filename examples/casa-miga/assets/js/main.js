/*
 * CASA MIGA · comportamiento de la página
 * 1. Datos del negocio (config.js)   2. Cabecera y menú móvil   3. Revelados
 * 4. Carta por categorías            5. Vapor                    6. Escenas de scroll (GSAP)
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var motionOK = root.classList.contains('motion');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) { node.append(c); });
    return node;
  }

  /* ---------- 1. Datos del negocio ---------- */

  function applyConfig() {
    var cfg = window.CASA_MIGA || {};
    var fill = function (field, nodes) {
      $$('[data-field="' + field + '"]').forEach(function (target) { target.replaceChildren.apply(target, nodes()); });
    };
    var handle = (cfg.instagram || '').replace(/^@/, '').trim();

    if (cfg.address) fill('address', function () { return [cfg.address]; });
    if (cfg.hours && cfg.hours.length) {
      fill('hours', function () {
        return cfg.hours.map(function (row) {
          return el('span', { class: 'hours' }, [el('span', {}, [row[0]]), el('span', {}, [row[1]])]);
        });
      });
    }
    if (cfg.phone) {
      fill('phone', function () { return [el('a', { href: 'tel:' + cfg.phone.replace(/[^+\d]/g, '') }, [cfg.phone])]; });
    }
    if (cfg.email) fill('email', function () { return [el('a', { href: 'mailto:' + cfg.email }, [cfg.email])]; });
    if (handle) {
      var igUrl = 'https://www.instagram.com/' + encodeURIComponent(handle) + '/';
      var igLink = function () { return el('a', { href: igUrl, target: '_blank', rel: 'noopener', 'data-track': 'instagram' }, ['@' + handle]); };
      fill('instagram', function () { return [igLink()]; });
      $$('[data-field="instagram-footer"]').forEach(function (target) {
        var icon = $('svg', target);
        target.replaceChildren(icon, igLink());
      });
    }
    if (cfg.mapsUrl) {
      $$('[data-maps]').forEach(function (a) {
        a.href = cfg.mapsUrl;
        a.target = '_blank';
        a.rel = 'noopener';
        a.removeAttribute('aria-disabled');
        a.removeAttribute('role');
      });
      $$('[data-maps-hint]').forEach(function (p) { p.hidden = true; });
    }

    // Datos estructurados sólo con datos reales
    if (cfg.address && cfg.phone && cfg.hours && cfg.hours.length) {
      var data = {
        '@context': 'https://schema.org',
        '@type': 'CafeOrCoffeeShop',
        name: 'CASA MIGA',
        slogan: 'El placer de ir más despacio.',
        address: cfg.address,
        telephone: cfg.phone,
        servesCuisine: ['Café de especialidad', 'Panadería artesanal']
      };
      var schemaHours = cfg.hours.map(function (row) { return row[2]; }).filter(Boolean);
      if (schemaHours.length) data.openingHours = schemaHours;
      if (cfg.email) data.email = cfg.email;
      if (cfg.siteUrl) data.url = cfg.siteUrl;
      if (cfg.mapsUrl) data.hasMap = cfg.mapsUrl;
      if (handle) data.sameAs = ['https://www.instagram.com/' + handle + '/'];
      document.head.append(el('script', { type: 'application/ld+json' }, [JSON.stringify(data)]));
    }
  }

  // Analítica: los elementos con data-track empujan un evento si hay un dataLayer instalado
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (t && Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'cta_click', cta: t.getAttribute('data-track') });
  });

  /* ---------- 2. Cabecera y menú ---------- */

  function initHeader() {
    var header = $('[data-header]');
    var hero = $('.hero');
    var darkZones = [$('.ritual'), $('.site-footer')];
    var links = $$('[data-nav]');
    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY;
      var h = header.offsetHeight;
      var pastHero = y > hero.offsetHeight - h;
      header.classList.toggle('is-solid', y > 4);
      var hide = pastHero && y > lastY + 4 && !root.classList.contains('menu-open') && !header.contains(document.activeElement);
      if (hide) header.classList.add('is-hidden');
      else if (y < lastY - 4 || !pastHero) header.classList.remove('is-hidden');
      lastY = y;
      var mid = h / 2;
      header.classList.toggle('is-dark', darkZones.some(function (z) {
        if (!z) return false;
        var r = z.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      }));
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    // Sección activa en la navegación
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('data-nav')); });
    var io = new IntersectionObserver(function () {
      var current = null;
      sections.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.45) current = s.id;
      });
      links.forEach(function (a) {
        if (a.getAttribute('data-nav') === current) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -54% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  function focusSection(hash) {
    var target = hash && document.getElementById(hash.slice(1));
    if (!target) return;
    target.scrollIntoView({ behavior: motionOK ? 'smooth' : 'auto', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  function initMenu() {
    var dialog = $('#menu');
    var openBtn = $('[data-menu-open]');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    function open() {
      if (dialog.open) return;
      dialog.showModal();
      root.classList.add('menu-open');
      openBtn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { requestAnimationFrame(function () { dialog.classList.add('is-open'); }); });
    }

    function close(after) {
      if (!dialog.open) return;
      dialog.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        dialog.close();
        root.classList.remove('menu-open');
        if (after) after();
      };
      if (!motionOK) return finish();
      dialog.addEventListener('transitionend', function onEnd(e) {
        if (e.target === dialog && e.propertyName === 'clip-path') { dialog.removeEventListener('transitionend', onEnd); finish(); }
      });
      setTimeout(finish, 650);
    }

    openBtn.addEventListener('click', open);
    $('[data-menu-close]', dialog).addEventListener('click', function () { close(); });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    $$('a[href^="#"]', dialog).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var hash = a.getAttribute('href');
        close(function () { focusSection(hash); history.replaceState(null, '', hash); });
      });
    });
    matchMedia('(min-width: 1024px)').addEventListener('change', function (e) { if (e.matches) close(); });
  }

  /* ---------- 3. Revelados ---------- */

  function initReveals() {
    var items = $$('[data-reveal]');
    if (!motionOK || !('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 4. Carta ---------- */

  function initTabs() {
    var wrap = $('[data-tabs]');
    var panelsWrap = $('[data-panels]');
    if (!wrap || !panelsWrap) return;
    wrap.hidden = false;
    panelsWrap.classList.add('tabs-on');

    var tabs = $$('[role="tab"]', wrap);
    var activeCopy = $('[data-tabs-active]', wrap);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var current = 0;

    panels.forEach(function (p, i) {
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('tabindex', '0');
      p.hidden = i !== 0;
    });

    function clipTo(tab) {
      var W = tab.parentElement.offsetWidth;
      activeCopy.style.setProperty('--clip-l', tab.offsetLeft + 'px');
      activeCopy.style.setProperty('--clip-r', (W - tab.offsetLeft - tab.offsetWidth) + 'px');
    }

    function select(i, focus) {
      if (i === current && !focus) return;
      current = i;
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      clipTo(tabs[i]);
      var panel = panels[i];
      panel.classList.remove('is-entering');
      void panel.offsetWidth;
      panel.classList.add('is-entering');
      if (focus) tabs[i].focus();
      var sl = wrap.scrollLeft, tl = tabs[i].offsetLeft, tw = tabs[i].offsetWidth;
      if (tl < sl || tl + tw > sl + wrap.clientWidth) wrap.scrollTo({ left: tl - 16, behavior: motionOK ? 'smooth' : 'auto' });
    }

    tabs.forEach(function (t, i) { t.addEventListener('click', function () { select(i); }); });
    $('[role="tablist"]', wrap).addEventListener('keydown', function (e) {
      var n = tabs.length, next = null;
      if (e.key === 'ArrowRight') next = (current + 1) % n;
      else if (e.key === 'ArrowLeft') next = (current - 1 + n) % n;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });

    clipTo(tabs[0]);
    requestAnimationFrame(function () { wrap.classList.add('is-ready'); });
    var reclip = function () { clipTo(tabs[current]); };
    window.addEventListener('resize', reclip);
    if (document.fonts) document.fonts.ready.then(reclip);
  }

  /* ---------- 5. Vapor ---------- */

  // Coordenadas en la imagen fuente: base del vapor sobre la superficie del café
  var STEAM_HERO = { w: 3320, h: 1940, x: 2060, y: 930, bw: 720, bh: 860 };
  var STEAM_HERO_MOBILE = { w: 1720, h: 1940, x: 460, y: 930, bw: 720, bh: 860 };
  var STEAM_CUP = { w: 2620, h: 1540, x: 1360, y: 770, bw: 760, bh: 760 };

  function makeSteam(canvas, img, spec, opts) {
    if (!motionOK || !canvas || !img || !window.CasaSteam) return null;
    var steam = window.CasaSteam.create(canvas, opts);
    if (!steam) return null;
    var layout = function () {
      var s = typeof spec === 'function' ? spec() : spec;
      window.CasaSteam.place(img, canvas, s);
    };
    if (img.complete) layout(); else img.addEventListener('load', layout);
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(img);
    else window.addEventListener('resize', layout);
    return steam;
  }

  /* ---------- 6. Escenas de scroll ---------- */

  function initScenes(ritualSteam) {
    if (!motionOK || !window.gsap || !window.ScrollTrigger) return;
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ ignoreMobileResize: true });
    var mm = gsap.matchMedia();

    // El ritual: enfocar, acercarse al vertido, llenar la taza, dejar subir el vapor
    var ritual = $('[data-ritual]');
    if (ritual) {
      mm.add({ isMobile: '(max-width: 760px)', isDesktop: '(min-width: 761px)' }, function (ctx) {
        var isMobile = ctx.conditions.isMobile;
        var stage = $('.ritual__stage', ritual);
        var pour = $('[data-layer="pour"]', ritual);
        var soft = $('[data-layer="soft"]', ritual);
        var cup = $('[data-layer="cup"]', ritual);
        var veil = $('.ritual__veil', ritual);
        var steps = $$('.step', ritual);
        var bar = $('[data-progress]', ritual);
        var active = -1;
        ritual.classList.add('is-scrubbed');

        function setStep(i) {
          if (i === active) return;
          active = i;
          steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
        }

        function onUpdate(self) {
          var p = self.progress;
          bar.style.transform = 'scaleY(' + p.toFixed(4) + ')';
          setStep(p < 0.2 ? 0 : p < 0.46 ? 1 : p < 0.72 ? 2 : 3);
          if (ritualSteam) {
            var amt = Math.min(1, Math.max(0, (p - 0.74) / 0.16));
            ritualSteam.setAmount(amt * 0.95);
            if (amt > 0 && !ritualSteam.running) ritualSteam.start();
            else if (amt === 0 && ritualSteam.running) ritualSteam.stop();
          }
        }

        var tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: function () { return '+=' + Math.round(window.innerHeight * (isMobile ? 2.4 : 3.2)); },
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: onUpdate,
            onRefresh: onUpdate
          }
        });
        tl.set(pour, { transformOrigin: '59% 46%' }, 0)
          .fromTo(pour, { scale: 1 }, { scale: 1.2, duration: 0.45 }, 0)
          .to(soft, { opacity: 0, duration: 0.16 }, 0.12)
          .to(pour, { scale: 1.5, transformOrigin: '59% 78%', duration: 0.27 }, 0.45)
          .fromTo(cup, { opacity: 0, scale: 1.16 }, { opacity: 1, scale: 1.03, duration: 0.14, ease: 'power1.out' }, 0.7)
          .to(cup, { scale: 1, duration: 0.16 }, 0.84)
          .to(pour, { opacity: 0, duration: 0.08 }, 0.82)
          .to(veil, { opacity: 0.82, duration: 0.2 }, 0.76);

        return function () {
          ritual.classList.remove('is-scrubbed');
          steps.forEach(function (s, j) { s.classList.toggle('is-active', j === 0); });
          if (ritualSteam) ritualSteam.stop();
        };
      });
    }

    // El croissant: la cámara se acerca al hojaldre mientras una luz cruza las capas
    var macro = $('[data-macro]');
    if (macro) {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: macro, start: 'top 85%', end: 'bottom 20%', scrub: 0.6 }
      })
        .fromTo($('.macro__img', macro), { scale: 1.02 }, { scale: 1.3, duration: 1 }, 0)
        .fromTo($('.macro__light', macro), { xPercent: -32, opacity: 0 }, { xPercent: 32, opacity: 1, duration: 0.55 }, 0.12)
        .to($('.macro__light', macro), { opacity: 0, duration: 0.25 }, 0.72);
    }

    // Nuestra casa: un paralaje mínimo dentro del marco
    var house = $('[data-parallax]');
    if (house) {
      gsap.fromTo(house, { yPercent: -5 }, {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: house.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    // El sello gira despacio mientras el hero se aleja
    var seal = $('.hero__seal');
    if (seal) {
      gsap.to(seal, { rotate: 50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }

  /* ---------- Arranque ---------- */

  applyConfig();
  initHeader();
  initMenu();
  initReveals();
  initTabs();

  var heroImg = $('.hero__img');
  var heroSteam = makeSteam($('[data-steam="hero"]'), heroImg, function () {
    return /hero-mobile/.test(heroImg.currentSrc) ? STEAM_HERO_MOBILE : STEAM_HERO;
  }, { amount: 0.55, seed: 3.7 });
  if (heroSteam) {
    heroSteam.setAmount(0.55);
    setTimeout(function () { heroSteam.start(); }, 1300);
  }

  var cupImg = $('[data-layer="cup"] img');
  var ritualSteam = makeSteam($('[data-steam="ritual"]'), cupImg, function () {
    return /hero-mobile/.test(cupImg.currentSrc) ? STEAM_HERO_MOBILE : STEAM_CUP;
  }, { amount: 0, seed: 11.2 });

  initScenes(ritualSteam);
})();
