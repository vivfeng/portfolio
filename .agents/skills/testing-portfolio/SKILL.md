---
name: testing-portfolio
description: Test the vivfeng/portfolio static site end-to-end. Use when verifying HTML/CSS/JS changes, CSP policies, or interactive features like project card expand/collapse.
---

# Testing the Portfolio Site

## Local Server Setup

This is a static HTML site with no build step or package manager. Serve it locally:

```bash
cd /home/ubuntu/repos/portfolio
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in Chrome.

## Key Test Areas

### 1. Content-Security-Policy (CSP)

The site uses a CSP meta tag in `index.html`. When testing CSP changes:

- Open Chrome DevTools Console before loading the page
- Look for `Refused to load` errors -- these indicate CSP violations
- Allowed sources: `script-src 'self'`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`, `img-src 'self'`
- A 404 for `/_vercel/insights/script.js` is expected on local server (Vercel Analytics)
- Verify Google Fonts render correctly (Cormorant Garamond for headings, DM Mono for labels, DM Sans for body)

### 2. Interactive JavaScript (`scripts.js`)

All JS is in `scripts.js` (no inline scripts, to comply with CSP). Key behaviors:

- **Project card expand/collapse**: Click a `.side-project-card` header to toggle `.open` class. The card body slides open/closed. The expand icon rotates between "+" and "x".
- **Link stopPropagation**: Links inside project cards (e.g., "Visit riderouta.org") should navigate without toggling the card. This uses `stopPropagation()` on anchor clicks.
- **Nav scroll effect**: Scrolling past 20px adds `.scrolled` class to `<nav>`, showing a bottom border.
- **Analytics**: `trackEvent()` wraps Vercel Analytics calls in try/catch. Will warn in console if analytics isn't loaded (expected on local server).

### 3. Visual Verification

- All images should render (headshot photo, demo GIFs for RideRouta and FindMySki)
- External links should have `target="_blank"` and `rel="noopener noreferrer"`
- No stray/orphan HTML tags (previously had a stray `</div>` after #contact)

## Test Procedure

1. Start local server and open the site
2. Check DevTools Console for CSP violations (should be clean except Vercel Analytics 404)
3. Verify fonts and images load
4. Scroll down -- check nav border appears
5. Expand/collapse all 3 project cards (RideRouta, Emission Factor Comparator, FindMySki)
6. Click an external link inside an expanded card -- card should stay open
7. Check console for zero JS errors after all interactions

## Common Issues

- If CSP blocks inline scripts: check that no `<script>` blocks or `onclick` handlers were added to `index.html` -- all JS must go in `scripts.js`
- If cards don't expand: check that `scripts.js` is loaded and `DOMContentLoaded` event fires. The event listeners are attached to `.side-project-card` elements.
- If fonts look wrong: verify `style-src` in CSP includes `https://fonts.googleapis.com` and `font-src` includes `https://fonts.gstatic.com`
- Merge conflicts with other PRs (e.g., error handling PRs) may require re-integrating changes into `scripts.js` after rebase

## Devin Secrets Needed

None -- this is a static site with no API keys or authentication required for local testing.
