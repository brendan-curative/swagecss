/**
 * Flippy Card Component JavaScript
 * Provides flip interaction for touch/tap devices
 * On hover/focus the card flips via CSS, on tap it toggles the flipped state
 */

(function() {
    'use strict';

    /**
     * Initialize all flippy card components on the page
     */
    function initializeFlippyCards() {
        const cards = document.querySelectorAll('.flippy-card');

        cards.forEach(card => {
            setupEventListeners(card);

            // Make card focusable for keyboard accessibility
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }

            // Add ARIA attributes for accessibility
            if (!card.hasAttribute('role')) {
                card.setAttribute('role', 'button');
            }

            if (!card.hasAttribute('aria-label')) {
                card.setAttribute('aria-label', 'Flip card to reveal more information');
            }
        });
    }

    /**
     * Set up event listeners for a flippy card
     * @param {HTMLElement} card - The flippy card element
     */
    function setupEventListeners(card) {
        // Handle click/tap events to toggle flip state
        card.addEventListener('click', handleCardClick);

        // Handle keyboard interaction
        card.addEventListener('keydown', handleKeyDown);

        // Prevent double-tap zoom on mobile
        card.addEventListener('touchend', handleTouchEnd);
    }

    /**
     * Handle card click to toggle flip state
     * @param {Event} event - The click event
     */
    function handleCardClick(event) {
        const card = event.currentTarget;
        toggleFlip(card);
    }

    /**
     * Handle keyboard navigation (Enter or Space to flip)
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeyDown(event) {
        // Enter or Space key
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const card = event.currentTarget;
            toggleFlip(card);
        }
    }

    /**
     * Handle touch end to prevent default behavior
     * @param {TouchEvent} event - The touch event
     */
    function handleTouchEnd(event) {
        // Prevent double-tap zoom on mobile devices
        event.preventDefault();
        const card = event.currentTarget;
        toggleFlip(card);
    }

    /**
     * Toggle the flip state of a card
     * @param {HTMLElement} card - The card element to flip
     */
    function toggleFlip(card) {
        const isFlipped = card.classList.contains('flippy-card--flipped');

        if (isFlipped) {
            card.classList.remove('flippy-card--flipped');
            card.setAttribute('aria-label', 'Flip card to reveal more information');
        } else {
            card.classList.add('flippy-card--flipped');
            card.setAttribute('aria-label', 'Flip card back to front');
        }

        // Dispatch custom event for external listeners
        const flipEvent = new CustomEvent('flippyCardFlip', {
            detail: {
                card: card,
                isFlipped: !isFlipped
            }
        });
        card.dispatchEvent(flipEvent);
    }

    /**
     * Programmatically flip a card to front or back
     * @param {HTMLElement} card - The card element
     * @param {boolean} showBack - True to show back, false to show front
     */
    function flipTo(card, showBack) {
        if (showBack) {
            card.classList.add('flippy-card--flipped');
            card.setAttribute('aria-label', 'Flip card back to front');
        } else {
            card.classList.remove('flippy-card--flipped');
            card.setAttribute('aria-label', 'Flip card to reveal more information');
        }
    }

    /**
     * Flip all cards to the same side
     * @param {boolean} showBack - True to show back, false to show front
     */
    function flipAll(showBack) {
        const cards = document.querySelectorAll('.flippy-card');
        cards.forEach(card => flipTo(card, showBack));
    }

    /**
     * Get the current flip state of a card
     * @param {HTMLElement} card - The card element
     * @returns {boolean} True if card is flipped to back, false if showing front
     */
    function isFlipped(card) {
        return card.classList.contains('flippy-card--flipped');
    }

    // Public API
    window.FlippyCardComponent = {
        init: initializeFlippyCards,
        flipTo: flipTo,
        flipAll: flipAll,
        isFlipped: isFlipped,
        toggle: toggleFlip
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFlippyCards);
    } else {
        initializeFlippyCards();
    }

    console.log('Flippy Card component JavaScript loaded');
})();
