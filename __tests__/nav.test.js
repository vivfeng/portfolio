/**
 * @jest-environment jsdom
 */

const { initNavScroll } = require('../js/nav');

describe('initNavScroll', () => {
  let navElement;

  beforeEach(() => {
    document.body.innerHTML = '<nav id="nav"></nav>';
    navElement = document.getElementById('nav');
  });

  it('adds "scrolled" class when scrollY exceeds the default threshold', () => {
    initNavScroll(navElement);

    Object.defineProperty(window, 'scrollY', { value: 21, writable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(navElement.classList.contains('scrolled')).toBe(true);
  });

  it('removes "scrolled" class when scrollY is at or below the threshold', () => {
    navElement.classList.add('scrolled');
    initNavScroll(navElement);

    Object.defineProperty(window, 'scrollY', { value: 20, writable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(navElement.classList.contains('scrolled')).toBe(false);
  });

  it('removes "scrolled" class when scrollY is 0', () => {
    navElement.classList.add('scrolled');
    initNavScroll(navElement);

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(navElement.classList.contains('scrolled')).toBe(false);
  });

  it('respects a custom threshold', () => {
    initNavScroll(navElement, 50);

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(navElement.classList.contains('scrolled')).toBe(false);

    Object.defineProperty(window, 'scrollY', { value: 51, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(navElement.classList.contains('scrolled')).toBe(true);
  });

  it('returns the scroll handler function', () => {
    const handler = initNavScroll(navElement);

    expect(typeof handler).toBe('function');
  });

  it('can be invoked manually to update the class', () => {
    const handler = initNavScroll(navElement);

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    handler();

    expect(navElement.classList.contains('scrolled')).toBe(true);
  });
});
