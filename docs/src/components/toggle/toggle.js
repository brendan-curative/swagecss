/**
 * Toggle Component JavaScript
 * Provides switch toggle functionality for binary state control
 * Matches Curative UI Toggle component using Headless UI Switch pattern
 */

(function() {
    'use strict';

    // Initialize toggle functionality when DOM is ready
    function initializeToggles() {
        const toggles = document.querySelectorAll('.toggle');

        toggles.forEach(toggle => {
            if (!toggle.disabled) {
                // Handle toggle click
                toggle.addEventListener('click', () => {
                    handleToggleClick(toggle);
                });

                // Handle keyboard navigation
                toggle.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle.click();
                    }
                });
            }
        });

        // Handle label clicks for accessibility
        document.querySelectorAll('.toggle-with-label').forEach(label => {
            label.addEventListener('click', (event) => {
                // If the click target is the label itself, and not the button inside it,
                // then trigger the button's click. This prevents double-toggling.
                if (event.target === label || event.target.classList.contains('toggle-with-label__label')) {
                    const button = label.querySelector('.toggle');
                    if (button && !button.disabled) {
                        button.click();
                    }
                }
            });
        });
    }

    // Handle individual toggle click
    function handleToggleClick(toggle) {
        const isChecked = toggle.getAttribute('aria-pressed') === 'true';
        const newState = !isChecked;
        
        // Update aria-pressed
        toggle.setAttribute('aria-pressed', newState.toString());
        
        // Update visual classes
        if (newState) {
            toggle.classList.remove('toggle--unchecked');
            toggle.classList.add('toggle--checked');
        } else {
            toggle.classList.remove('toggle--checked');
            toggle.classList.add('toggle--unchecked');
        }
        
        // Update screen reader text
        const srText = toggle.querySelector('.toggle__sr-only');
        const size = toggle.dataset.size || 'large';
        const sizeText = size.charAt(0).toUpperCase() + size.slice(1);
        if (srText) {
            srText.textContent = `${sizeText} Toggle`;
        }
        
        console.log(`Toggle ${size} changed to: ${newState}`);
        
        // Simulate onRequestChangeValue callback
        if (window.onToggleChange) {
            window.onToggleChange(newState);
        }
    }

    // Utility function to get toggle state
    function getToggleState(toggle) {
        return toggle.getAttribute('aria-pressed') === 'true';
    }

    // Utility function to set toggle state
    function setToggleState(toggle, checked) {
        if (toggle.disabled) return;
        
        const currentState = getToggleState(toggle);
        if (currentState !== checked) {
            toggle.click();
        }
    }

    // Utility function to toggle by ID
    function toggleById(toggleId) {
        const toggle = document.getElementById(toggleId);
        if (toggle && !toggle.disabled) {
            toggle.click();
        }
    }

    // Public API
    window.ToggleComponent = {
        init: initializeToggles,
        getState: getToggleState,
        setState: setToggleState,
        toggleById: toggleById
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeToggles);
    } else {
        initializeToggles();
    }

    console.log('Toggle component JavaScript loaded');
})();
