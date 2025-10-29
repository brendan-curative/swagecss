/**
 * Accordion Component JavaScript
 * Provides collapsible content sections with toggle functionality
 * Matches Curative UI Accordion component using Headless UI Disclosure pattern
 */

(function() {
    'use strict';

    // Initialize accordion functionality when DOM is ready
    function initializeAccordions() {
        const accordions = document.querySelectorAll('.accordion');
        
        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.accordion__item');
            
            items.forEach(item => {
                const toggle = item.querySelector('.accordion__toggle');
                const panel = item.querySelector('.accordion__panel');
                const icon = item.querySelector('.accordion__toggle-icon .heroicon');
                
                if (!toggle || !panel || !icon) return;
                
                // Handle toggle click
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleAccordionItem(item, toggle, panel, icon);
                    
                    // Simulate onButtonClick callback
                    console.log(`Accordion item toggled: ${toggle.getAttribute('data-testid')}`);
                });
                
                // Handle keyboard navigation
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle.click();
                    }
                });
            });
        });
    }

    // Toggle accordion item state
    function toggleAccordionItem(item, toggle, panel, icon) {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        const newState = !isOpen;
        
        // Update aria-expanded
        toggle.setAttribute('aria-expanded', newState.toString());
        
        // Update item visual state
        if (newState) {
            item.classList.add('accordion__item--open');
            panel.classList.remove('accordion__panel--hidden');
            panel.classList.add('accordion__panel--visible');
            
            // Change icon to chevron-down
            icon.className = icon.className.replace('heroicon-chevron-right', 'heroicon-chevron-down');
        } else {
            item.classList.remove('accordion__item--open');
            panel.classList.remove('accordion__panel--visible');
            panel.classList.add('accordion__panel--hidden');
            
            // Change icon to chevron-right
            icon.className = icon.className.replace('heroicon-chevron-down', 'heroicon-chevron-right');
        }
        
        console.log(`Accordion item ${newState ? 'opened' : 'closed'}`);
    }

    // Utility function to toggle specific accordion item (for demo/testing purposes)
    function toggleAccordionByTestId(testId) {
        const item = document.querySelector(`[data-testid="${testId}"]`);
        if (item) {
            const toggle = item.querySelector('.accordion__toggle');
            if (toggle) {
                toggle.click();
            }
        }
    }

    // Public API
    window.AccordionComponent = {
        init: initializeAccordions,
        toggleByTestId: toggleAccordionByTestId
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAccordions);
    } else {
        initializeAccordions();
    }

    console.log('Accordion component JavaScript loaded');
})();
