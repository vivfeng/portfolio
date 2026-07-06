/**
 * Side-project expand / collapse behaviour.
 *
 *   toggleProject(card) – toggles the `open` class on a card element and fires
 *                          an analytics event when a card is opened.
 */

function toggleProject(card) {
  if (!card || !card.classList) {
    console.warn('[UI] toggleProject called with an invalid element:', card);
    return;
  }
  try {
    var wasOpen = card.classList.contains('open');
    card.classList.toggle('open');

    if (!wasOpen && card.dataset.projectName) {
      if (typeof trackEvent === 'function') {
        trackEvent('project_opened', { project: card.dataset.projectName });
      }
    }
  } catch (err) {
    console.warn('[UI] Error toggling project card:', err);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleProject: toggleProject };
}
