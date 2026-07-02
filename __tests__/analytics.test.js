/**
 * @jest-environment jsdom
 */

const { trackEvent, initAnalyticsListeners } = require('../js/analytics');

beforeEach(() => {
  window.va = jest.fn();
});

describe('trackEvent', () => {
  it('sends an event with name and properties to window.va', () => {
    trackEvent('page_viewed', { section: 'hero' });

    expect(window.va).toHaveBeenCalledTimes(1);
    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'page_viewed',
      data: { section: 'hero' },
    });
  });

  it('defaults to an empty properties object when none is provided', () => {
    trackEvent('cta_clicked');

    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'cta_clicked',
      data: {},
    });
  });

  it('defaults to an empty object when properties is null', () => {
    trackEvent('cta_clicked', null);

    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'cta_clicked',
      data: {},
    });
  });

  it('passes multiple properties through correctly', () => {
    trackEvent('contact_link_clicked', { channel: 'linkedin', location: 'footer' });

    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'contact_link_clicked',
      data: { channel: 'linkedin', location: 'footer' },
    });
  });

  it('warns and returns early when name is not a string', () => {
    var warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    trackEvent(123);

    expect(window.va).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      '[Analytics] trackEvent called without a valid event name:',
      123,
    );
    warnSpy.mockRestore();
  });

  it('warns and returns early when name is an empty string', () => {
    var warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    trackEvent('');

    expect(window.va).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('catches and warns if window.va throws', () => {
    window.va = jest.fn(() => { throw new Error('boom'); });
    var warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    trackEvent('test_event');

    expect(warnSpy).toHaveBeenCalledWith(
      '[Analytics] Failed to track event:',
      'test_event',
      expect.any(Error),
    );
    warnSpy.mockRestore();
  });
});

describe('initAnalyticsListeners', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('attaches click listeners to elements with data-analytics-event', () => {
    document.body.innerHTML =
      '<a data-analytics-event="contact_link_clicked" data-analytics-channel="linkedin">LinkedIn</a>';

    initAnalyticsListeners();

    document.querySelector('a').click();

    expect(window.va).toHaveBeenCalledTimes(1);
    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'contact_link_clicked',
      data: { channel: 'linkedin' },
    });
  });

  it('collects all available data-analytics-* attributes', () => {
    document.body.innerHTML =
      '<button ' +
        'data-analytics-event="project_link_clicked" ' +
        'data-analytics-project="routa" ' +
        'data-analytics-target="site" ' +
        'data-analytics-location="projects" ' +
        'data-analytics-channel="web">' +
        'Click' +
      '</button>';

    initAnalyticsListeners();

    document.querySelector('button').click();

    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'project_link_clicked',
      data: {
        channel: 'web',
        location: 'projects',
        project: 'routa',
        target: 'site',
      },
    });
  });

  it('omits properties that have no corresponding data attribute', () => {
    document.body.innerHTML =
      '<span data-analytics-event="nav_click">Nav</span>';

    initAnalyticsListeners();

    document.querySelector('span').click();

    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'nav_click',
      data: {},
    });
  });

  it('does nothing when there are no matching elements', () => {
    document.body.innerHTML = '<div>No analytics</div>';

    initAnalyticsListeners();

    document.querySelector('div').click();

    expect(window.va).not.toHaveBeenCalled();
  });

  it('wires up multiple elements independently', () => {
    document.body.innerHTML =
      '<a data-analytics-event="link_a" data-analytics-channel="a">A</a>' +
      '<a data-analytics-event="link_b" data-analytics-channel="b">B</a>';

    initAnalyticsListeners();

    document.querySelectorAll('a')[1].click();

    expect(window.va).toHaveBeenCalledTimes(1);
    expect(window.va).toHaveBeenCalledWith('event', {
      name: 'link_b',
      data: { channel: 'b' },
    });
  });
});
