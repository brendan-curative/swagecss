/**
 * Banner Component JavaScript
 * Provides responsive banner with mobile disclosure functionality
 * Matches Curative UI Banner component using Headless UI Disclosure pattern
 */

(function() {
    'use strict';

    // Initialize banner functionality when DOM is ready
    function initializeBanners() {
        const banners = document.querySelectorAll('.banner');
        
        banners.forEach(banner => {
            const toggle = banner.querySelector('.banner__toggle');
            const panel = banner.querySelector('.banner__panel');
            const chevron = banner.querySelector('.banner__toggle-chevron .heroicon');
            
            if (!toggle || !panel || !chevron) return;
            
            // Handle toggle click
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggleBannerPanel(toggle, panel, chevron);
                
                // Simulate onButtonClick callback
                console.log(`Banner toggle clicked: ${toggle.getAttribute('data-testid')}`);
            });
            
            // Handle keyboard navigation
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle.click();
                }
            });
        });
    }

    // Toggle banner panel state
    function toggleBannerPanel(toggle, panel, chevron) {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        const newState = !isOpen;
        
        // Update aria-expanded
        toggle.setAttribute('aria-expanded', newState.toString());
        
        // Update panel visibility
        if (newState) {
            panel.classList.remove('banner__panel--hidden');
            panel.classList.add('banner__panel--visible');
            
            // Change icon to chevron-up
            chevron.className = chevron.className.replace('heroicon-chevron-down', 'heroicon-chevron-up');
        } else {
            panel.classList.remove('banner__panel--visible');
            panel.classList.add('banner__panel--hidden');
            
            // Change icon to chevron-down
            chevron.className = chevron.className.replace('heroicon-chevron-up', 'heroicon-chevron-down');
        }
        
        console.log(`Banner panel ${newState ? 'opened' : 'closed'}`);
    }

    // Utility function to toggle specific banner (for demo/testing purposes)
    function toggleBannerByTestId(testId) {
        const banner = document.querySelector(`[data-testid="${testId}"]`);
        if (banner) {
            const toggle = banner.querySelector('.banner__toggle');
            if (toggle) {
                toggle.click();
            }
        }
    }

    // Responsive behavior detection utility
    function updateResponsiveInfo() {
        const width = window.innerWidth;
        const isDesktop = width >= 768;
        console.log(`Viewport: ${width}px - ${isDesktop ? 'Desktop' : 'Mobile'} view`);
    }

    // Public API
    window.BannerComponent = {
        init: initializeBanners,
        toggleByTestId: toggleBannerByTestId,
        updateResponsiveInfo: updateResponsiveInfo
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeBanners();
            updateResponsiveInfo();
            
            // Update responsive info on resize
            window.addEventListener('resize', updateResponsiveInfo);
        });
    } else {
        initializeBanners();
        updateResponsiveInfo();
        
        // Update responsive info on resize
        window.addEventListener('resize', updateResponsiveInfo);
    }

    console.log('Banner component JavaScript loaded');
})();
