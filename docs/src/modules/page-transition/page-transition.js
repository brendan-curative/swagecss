/**
 * Page Transition Module
 * Provides smooth fade transitions between pages
 *
 * Usage:
 * Add data-page-transition attribute to links that should trigger page transitions:
 * <a href="/next-page" data-page-transition>Link</a>
 */

(function() {
  'use strict';

  // Configuration
  const TRANSITION_DURATION = 300; // milliseconds (should match CSS transition duration)
  const FADE_OUT_CLASS = 'page-transition-fade-out';
  const FADE_IN_CLASS = 'page-transition-fade-in';
  const TRIGGER_SELECTOR = '[data-page-transition]';

  /**
   * Initialize page transitions
   */
  function initPageTransitions() {
    const main = document.querySelector('main');

    if (!main) {
      console.warn('Page transition: <main> element not found');
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fade in current page on load
    if (!prefersReducedMotion) {
      main.classList.add(FADE_IN_CLASS);

      // Remove fade-in class after animation completes
      setTimeout(() => {
        main.classList.remove(FADE_IN_CLASS);
      }, TRANSITION_DURATION);
    }

    // Handle clicks on transition trigger links
    document.addEventListener('click', function(event) {
      const link = event.target.closest(TRIGGER_SELECTOR);

      if (!link) return;

      // Check if link is internal and valid
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Check if link opens in new tab
      const target = link.getAttribute('target');
      if (target === '_blank' || target === '_new') {
        return;
      }

      // Check if this is an external link
      try {
        const linkUrl = new URL(href, window.location.origin);
        if (linkUrl.origin !== window.location.origin) {
          return; // External link, don't intercept
        }
      } catch (e) {
        // Invalid URL, let browser handle it
        return;
      }

      // Prevent default navigation
      event.preventDefault();

      // Skip transition if reduced motion is preferred
      if (prefersReducedMotion) {
        window.location.href = href;
        return;
      }

      // Start fade out transition
      main.classList.add(FADE_OUT_CLASS);

      // Navigate to new page after transition completes
      setTimeout(() => {
        window.location.href = href;
      }, TRANSITION_DURATION);
    });

    // Handle back/forward browser navigation
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
        // Page was loaded from cache (back/forward navigation)
        main.classList.remove(FADE_OUT_CLASS);
        if (!prefersReducedMotion) {
          main.classList.add(FADE_IN_CLASS);
          setTimeout(() => {
            main.classList.remove(FADE_IN_CLASS);
          }, TRANSITION_DURATION);
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
  } else {
    initPageTransitions();
  }

})();
