/**
 * @jest-environment jsdom
 */

const { toggleProject } = require('../js/projects');

describe('toggleProject', () => {
  let card;

  beforeEach(() => {
    global.trackEvent = jest.fn();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    delete global.trackEvent;
  });

  it('adds "open" class to a closed card', () => {
    document.body.innerHTML =
      '<div class="side-project-card" data-project-name="routa"></div>';
    card = document.querySelector('.side-project-card');

    toggleProject(card);

    expect(card.classList.contains('open')).toBe(true);
  });

  it('removes "open" class from an already-open card', () => {
    document.body.innerHTML =
      '<div class="side-project-card open" data-project-name="routa"></div>';
    card = document.querySelector('.side-project-card');

    toggleProject(card);

    expect(card.classList.contains('open')).toBe(false);
  });

  it('fires a trackEvent when opening a card that has a project name', () => {
    document.body.innerHTML =
      '<div class="side-project-card" data-project-name="findmyski"></div>';
    card = document.querySelector('.side-project-card');

    toggleProject(card);

    expect(global.trackEvent).toHaveBeenCalledTimes(1);
    expect(global.trackEvent).toHaveBeenCalledWith('project_opened', {
      project: 'findmyski',
    });
  });

  it('does not fire trackEvent when closing a card', () => {
    document.body.innerHTML =
      '<div class="side-project-card open" data-project-name="findmyski"></div>';
    card = document.querySelector('.side-project-card');

    toggleProject(card);

    expect(global.trackEvent).not.toHaveBeenCalled();
  });

  it('does not fire trackEvent when opening a card with no project name', () => {
    document.body.innerHTML =
      '<div class="side-project-card"></div>';
    card = document.querySelector('.side-project-card');

    toggleProject(card);

    expect(card.classList.contains('open')).toBe(true);
    expect(global.trackEvent).not.toHaveBeenCalled();
  });

  it('toggles correctly across multiple open/close cycles', () => {
    document.body.innerHTML =
      '<div class="side-project-card" data-project-name="emissions"></div>';
    card = document.querySelector('.side-project-card');

    toggleProject(card);
    expect(card.classList.contains('open')).toBe(true);

    toggleProject(card);
    expect(card.classList.contains('open')).toBe(false);

    toggleProject(card);
    expect(card.classList.contains('open')).toBe(true);

    expect(global.trackEvent).toHaveBeenCalledTimes(2);
  });

  it('works without trackEvent defined globally', () => {
    delete global.trackEvent;

    document.body.innerHTML =
      '<div class="side-project-card" data-project-name="routa"></div>';
    card = document.querySelector('.side-project-card');

    expect(() => toggleProject(card)).not.toThrow();
    expect(card.classList.contains('open')).toBe(true);
  });

  it('warns and returns early when called with null', () => {
    var warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    toggleProject(null);

    expect(warnSpy).toHaveBeenCalledWith(
      '[UI] toggleProject called with an invalid element:',
      null,
    );
    warnSpy.mockRestore();
  });

  it('warns and returns early when called with an object lacking classList', () => {
    var warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    toggleProject({});

    expect(warnSpy).toHaveBeenCalledWith(
      '[UI] toggleProject called with an invalid element:',
      {},
    );
    warnSpy.mockRestore();
  });
});
