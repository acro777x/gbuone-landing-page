<script>
/* GBU One — SAFE motion behaviours. Nothing here hides content. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Scroll progress bar (purely additive). */
  if (!reduce) {
    var progress = document.createElement('div');
    progress.id = 'gbu-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
  }

  /* 2. Header condense on scroll. */
  var header = document.querySelector('.site-header, header[class*="header"]');

  /* 3. Hero wordmark letters: split into spans; CSS animates them to visible.
        If this script fails, the original plain text remains fully visible. */
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

  /* 4. Scroll handler (rAF-throttled). Never touches visibility. */
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

  /* 5. Count-up: progressively enhances a number, never hides it. */
  if (!reduce && 'IntersectionObserver' in window) {
    var counters = document.querySelectorAll('[data-count]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = Number(el.getAttribute('data-count')) || 0;
        var start = performance.now();
        function step(now) {
          var t = Math.min((now - start) / 1100, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-IN');
          if (t < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }
})();
</script>
