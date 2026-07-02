/**
 * Navigation scroll behaviour — adds/removes the `scrolled` class on the nav
 * element when the page is scrolled past a threshold (20 px).
 */

function initNavScroll(navElement, threshold) {
  if (typeof threshold !== 'number') {
    threshold = 20;
  }

  function onScroll() {
    try {
      navElement.classList.toggle('scrolled', window.scrollY > threshold);
    } catch (err) {
      console.warn('[UI] Error in scroll handler:', err);
    }
  }

  window.addEventListener('scroll', onScroll);

  return onScroll;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initNavScroll: initNavScroll };
}
