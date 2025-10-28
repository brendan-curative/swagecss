// Carousel Component JavaScript

/**
 * Initialize carousel functionality
 */
function initializeCarousel() {
    console.log('Carousel component initialized');
    
    // Find all carousels on the page
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel__track');
        const slides = carousel.querySelectorAll('.carousel__slide');
        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');
        const indicators = carousel.querySelectorAll('.carousel__indicator');
        const counter = carousel.querySelector('.carousel__counter');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Track viewed slides feature
        const trackViews = carousel.hasAttribute('data-carousel-track-views');
        const controlledButtonId = carousel.getAttribute('data-carousel-controlled-button');
        const controlledButton = controlledButtonId ? document.getElementById(controlledButtonId) : null;
        const viewedSlides = new Set();
        
        // Mark first slide as viewed
        if (trackViews) {
            viewedSlides.add(0);
        }
        
        // Update carousel display
        function updateCarousel() {
            // Move track
            const offset = -currentIndex * 100;
            track.style.transform = `translateX(${offset}%)`;
            
            // Update button states
            if (prevButton) {
                prevButton.disabled = currentIndex === 0;
            }
            if (nextButton) {
                nextButton.disabled = currentIndex === totalSlides - 1;
            }
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('carousel__indicator--active');
                    indicator.setAttribute('aria-current', 'true');
                } else {
                    indicator.classList.remove('carousel__indicator--active');
                    indicator.setAttribute('aria-current', 'false');
                }
            });
            
            // Update counter
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
            }
            
            // Update ARIA attributes
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.setAttribute('aria-hidden', 'false');
                } else {
                    slide.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Track viewed slides
            if (trackViews) {
                viewedSlides.add(currentIndex);
                updateControlledButton();
            }
            
            console.log(`Carousel moved to slide ${currentIndex + 1} of ${totalSlides}`);
        }
        
        // Update controlled button state
        function updateControlledButton() {
            if (!controlledButton) return;
            
            const allSlidesViewed = viewedSlides.size === totalSlides;
            controlledButton.disabled = !allSlidesViewed;
            
            if (allSlidesViewed) {
                console.log('All slides viewed - button enabled');
            } else {
                console.log(`Viewed ${viewedSlides.size} of ${totalSlides} slides`);
            }
        }
        
        // Go to previous slide
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
        
        // Go to next slide
        function nextSlide() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        }
        
        // Go to specific slide
        function goToSlide(index) {
            if (index >= 0 && index < totalSlides) {
                currentIndex = index;
                updateCarousel();
            }
        }
        
        // Event listeners for navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Initialize display
        updateCarousel();
        
        // Add ARIA attributes to carousel
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'Carousel');
        carousel.setAttribute('aria-roledescription', 'carousel');
        
        // Store functions on carousel element for external access
        carousel.carouselAPI = {
            next: nextSlide,
            prev: prevSlide,
            goTo: goToSlide,
            getCurrentIndex: () => currentIndex,
            getTotalSlides: () => totalSlides,
            getViewedSlides: () => Array.from(viewedSlides),
            areAllSlidesViewed: () => viewedSlides.size === totalSlides
        };
    });
}

/**
 * Global function to control a specific carousel by ID
 */
function carouselNext(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (carousel && carousel.carouselAPI) {
        carousel.carouselAPI.next();
    }
}

function carouselPrev(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (carousel && carousel.carouselAPI) {
        carousel.carouselAPI.prev();
    }
}

function carouselGoTo(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (carousel && carousel.carouselAPI) {
        carousel.carouselAPI.goTo(index);
    }
}

