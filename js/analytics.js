/**
 * Analytics helper — wraps the Vercel Web Analytics `va()` call.
 *
 * Provides:
 *   trackEvent(name, properties)  – fire an analytics event
 *   initAnalyticsListeners()      – wire up [data-analytics-event] clicks
 */

function trackEvent(name, properties) {
  try {
    if (typeof name !== 'string' || !name) {
      console.warn('[Analytics] trackEvent called without a valid event name:', name);
      return;
    }
    if (typeof properties !== 'object' || properties === null) {
      properties = {};
    }
    window.va('event', { name: name, data: properties });
  } catch (err) {
    console.warn('[Analytics] Failed to track event:', name, err);
  }
}

function initAnalyticsListeners() {
  document.querySelectorAll('[data-analytics-event]').forEach(function (element) {
    element.addEventListener('click', function () {
      try {
        var dataset = element.dataset;
        var properties = {};

        if (dataset.analyticsChannel)  properties.channel  = dataset.analyticsChannel;
        if (dataset.analyticsLocation) properties.location  = dataset.analyticsLocation;
        if (dataset.analyticsProject)  properties.project   = dataset.analyticsProject;
        if (dataset.analyticsTarget)   properties.target    = dataset.analyticsTarget;

        trackEvent(dataset.analyticsEvent, properties);
      } catch (err) {
        console.warn('[Analytics] Error in click handler:', err);
      }
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { trackEvent: trackEvent, initAnalyticsListeners: initAnalyticsListeners };
}
