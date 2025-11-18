/**
 * Carousel Component JavaScript
 * Provides horizontal scrolling functionality with navigation controls
 * Works with BLV theme carousel component
 */

(function() {
    'use strict';

    // Store active carousels and their states
    const carouselStates = new Map();

    /**
     * Initialize all carousel components on the page
     */
    function initializeCarousels() {
        const carousels = document.querySelectorAll('ul.carousel');

        carousels.forEach(carousel => {
            if (!carouselStates.has(carousel)) {
                setupCarousel(carousel);
            }
        });
    }

    /**
     * Setup a single carousel with navigation and scroll handling
     */
    function setupCarousel(carousel) {
        const items = Array.from(carousel.querySelectorAll('li'));

        if (items.length === 0) return;

        // Initialize carousel state
        const state = {
            currentIndex: 0,
            itemCount: items.length,
            navButtons: null,
            dots: null
        };

        carouselStates.set(carousel, state);

        // Create navigation if data-carousel-nav attribute is present
        if (carousel.hasAttribute('data-carousel-nav')) {
            createNavigationButtons(carousel, state);
        }

        // Create dots navigation if data-carousel-dots attribute is present
        if (carousel.hasAttribute('data-carousel-dots')) {
            createDotsNavigation(carousel, state);
        }

        // Setup scroll event listener to update active item
        setupScrollListener(carousel, state);

        // Setup intersection observer for item visibility
        setupIntersectionObserver(carousel, items);

        // Initial update
        updateVisibleItems(carousel, state);
    }

    /**
     * Create previous/next navigation buttons
     */
    function createNavigationButtons(carousel, state) {
        const navContainer = document.createElement('div');
        navContainer.className = 'carousel-nav';

        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-nav__button';
        prevButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        `;
        prevButton.setAttribute('aria-label', 'Previous item');

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-nav__button';
        nextButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        `;
        nextButton.setAttribute('aria-label', 'Next item');

        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);

        carousel.parentNode.insertBefore(navContainer, carousel.nextSibling);

        state.navButtons = { prev: prevButton, next: nextButton };

        // Setup event listeners
        prevButton.addEventListener('click', () => scrollToPrevious(carousel, state));
        nextButton.addEventListener('click', () => scrollToNext(carousel, state));

        // Initial button state
        updateNavigationButtons(carousel, state);
    }

    /**
     * Create dots navigation
     */
    function createDotsNavigation(carousel, state) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        const items = carousel.querySelectorAll('li');

        items.forEach((item, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dots__dot';
            dot.setAttribute('aria-label', `Go to item ${index + 1}`);

            if (index === 0) {
                dot.classList.add('carousel-dots__dot--active');
            }

            dot.addEventListener('click', () => scrollToIndex(carousel, state, index));
            dotsContainer.appendChild(dot);
        });

        carousel.parentNode.insertBefore(dotsContainer, carousel.nextSibling);
        state.dots = dotsContainer;
    }

    /**
     * Setup scroll event listener to track current position
     */
    function setupScrollListener(carousel, state) {
        let scrollTimeout;

        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateVisibleItems(carousel, state);
            }, 150);
        });
    }

    /**
     * Setup intersection observer for item visibility
     */
    function setupIntersectionObserver(carousel, items) {
        const options = {
            root: carousel,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('carousel-item--visible');
                } else {
                    entry.target.classList.remove('carousel-item--visible');
                }
            });
        }, options);

        items.forEach(item => observer.observe(item));
    }

    /**
     * Update which items are visible and update navigation
     */
    function updateVisibleItems(carousel, state) {
        const items = carousel.querySelectorAll('li');
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = items[0]?.offsetWidth || 0;
        const gap = parseInt(getComputedStyle(carousel).gap) || 0;

        // Calculate current index based on scroll position
        state.currentIndex = Math.round(scrollLeft / (itemWidth + gap));

        updateNavigationButtons(carousel, state);
        updateDots(state);
    }

    /**
     * Update navigation button states
     */
    function updateNavigationButtons(carousel, state) {
        if (!state.navButtons) return;

        const { prev, next } = state.navButtons;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        // Disable prev button at start
        prev.disabled = carousel.scrollLeft <= 0;

        // Disable next button at end
        next.disabled = carousel.scrollLeft >= maxScroll - 1;
    }

    /**
     * Update active dot
     */
    function updateDots(state) {
        if (!state.dots) return;

        const dots = state.dots.querySelectorAll('.carousel-dots__dot');
        dots.forEach((dot, index) => {
            if (index === state.currentIndex) {
                dot.classList.add('carousel-dots__dot--active');
            } else {
                dot.classList.remove('carousel-dots__dot--active');
            }
        });
    }

    /**
     * Scroll to previous item
     */
    function scrollToPrevious(carousel, state) {
        const items = carousel.querySelectorAll('li');
        if (state.currentIndex > 0) {
            scrollToIndex(carousel, state, state.currentIndex - 1);
        }
    }

    /**
     * Scroll to next item
     */
    function scrollToNext(carousel, state) {
        const items = carousel.querySelectorAll('li');
        if (state.currentIndex < state.itemCount - 1) {
            scrollToIndex(carousel, state, state.currentIndex + 1);
        }
    }

    /**
     * Scroll to specific index
     */
    function scrollToIndex(carousel, state, index) {
        const items = carousel.querySelectorAll('li');
        if (items[index]) {
            items[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            state.currentIndex = index;
        }
    }

    /**
     * Public API
     */
    window.CarouselComponent = {
        init: initializeCarousels,
        scrollToIndex: function(carousel, index) {
            const state = carouselStates.get(carousel);
            if (state) {
                scrollToIndex(carousel, state, index);
            }
        },
        getCurrentIndex: function(carousel) {
            const state = carouselStates.get(carousel);
            return state ? state.currentIndex : 0;
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCarousels);
    } else {
        initializeCarousels();
    }

    console.log('Carousel component JavaScript loaded');
})();
