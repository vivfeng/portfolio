/* Vercel Analytics stub — must run before /_vercel/insights/script.js */
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

document.addEventListener('DOMContentLoaded', function () {
  /* Initialize analytics click listeners (from js/analytics.js) */
  initAnalyticsListeners();

  /* Initialize nav scroll effect (from js/nav.js) */
  initNavScroll(document.getElementById('nav'));

  /* Side-project expand/collapse via event delegation (replaces inline onclick) */
  document.querySelectorAll('.side-project-card[data-project-name]').forEach(function (card) {
    card.addEventListener('click', function () {
      toggleProject(card);
    });
  });

  /* Prevent project-body links from toggling the card */
  document.querySelectorAll('.side-project-card a').forEach(function (link) {
    link.addEventListener('click', function (e) { e.stopPropagation(); });
  });
});
