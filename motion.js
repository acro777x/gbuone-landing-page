<script>
/* GBU One — motion behaviours (paste before </body>, no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Scroll progress bar */
  if (!reduce) {
    var progress = document.createElement('div');
    progress.id = 'gbu-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
  }

  /* 2. Reveal on scroll — PERFORMS: brings content into view, never idles. */
  var targets = document.querySelectorAll(
    'section, .card, .feature-card, .school-chip, .avatar-card, .faq-item, .reveal'
  );
  if (!reduce && 'IntersectionObserver' in window) {
    targets.forEach(function (el, i) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (i % 6) * 60 + 'ms');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { observer.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* 3. Stagger children of grids/lists. */
  document.querySelectorAll('.reveal-group, [class*="grid"], [class*="chips"]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', i);
    });
    group.classList.add('reveal-group');
  });

  /* 4. Hero wordmark split: wrap each character for a staggered rise.
        Only the element marked data-split is touched. */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var text = el.textContent || '';
    el.textContent = '';
    Array.prototype.forEach.call(text, function (char, i) {
      var span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00a0' : char;
      span.style.setProperty('--i', i);
      el.appendChild(span);
    });
    el.classList.add('gbu-rise');
  });

  /* 5. Header condense + progress on scroll (rAF-throttled). */
  var header = document.querySelector('.site-header, header[class*="header"]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    if (header) header.classList.toggle('is-condensed', y > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* 6. Count-up for numeric stats. Runs once when visible. */
  if (!reduce && 'IntersectionObserver' in window) {
    var counters = document.querySelectorAll('[data-count]');
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = Number(el.getAttribute('data-count')) || 0;
        var start = performance.now();
        var duration = 1100;
        function step(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-IN');
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }
})();
</script>
