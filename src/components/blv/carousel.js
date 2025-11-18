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

        const totalSlides = slides.length;

        // Generate bottom indicators if carousel--show-indicators is present
        let indicatorsBottom = carousel.querySelector('.carousel__indicators-bottom');
        let counterBottom = carousel.querySelector('.carousel__counter-bottom');

        if (carousel.classList.contains('carousel--show-indicators') && !indicatorsBottom) {
            // Create indicators container
            indicatorsBottom = document.createElement('div');
            indicatorsBottom.className = 'carousel__indicators-bottom';
            indicatorsBottom.setAttribute('role', 'tablist');
            indicatorsBottom.setAttribute('aria-label', 'Slide indicators');

            // Create indicator buttons
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.className = 'carousel__indicator';
                indicator.setAttribute('role', 'tab');
                indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
                indicatorsBottom.appendChild(indicator);
            }

            // Create counter
            counterBottom = document.createElement('div');
            counterBottom.className = 'carousel__counter-bottom';
            counterBottom.setAttribute('aria-live', 'polite');
            counterBottom.setAttribute('aria-atomic', 'true');
            counterBottom.textContent = `1 / ${totalSlides}`;

            // Append to carousel
            carousel.appendChild(indicatorsBottom);
            carousel.appendChild(counterBottom);
        }

        // Get bottom indicators after potential generation
        const bottomIndicators = indicatorsBottom ? indicatorsBottom.querySelectorAll('.carousel__indicator') : [];

        let currentIndex = 0;
        let isInitializing = true;
        
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
            // Animate slides
            slides.forEach((slide, index) => {
                // Remove all animation classes first
                slide.classList.remove('carousel__slide--exiting', 'carousel__slide--entering', 'carousel__slide--active');
                
                if (index === currentIndex) {
                    // Current slide - entering
                    if (!isInitializing) {
                        slide.classList.add('carousel__slide--entering');
                        // After animation completes (300ms delay + 400ms animation = 700ms total)
                        setTimeout(() => {
                            slide.classList.remove('carousel__slide--entering');
                            slide.classList.add('carousel__slide--active');
                        }, 700);
                    } else {
                        slide.classList.add('carousel__slide--active');
                    }
                } else if (Math.abs(index - currentIndex) === 1) {
                    // Adjacent slides - exiting
                    if (!isInitializing) {
                        slide.classList.add('carousel__slide--exiting');
                    }
                }
            });
            
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
            
            // Update bottom indicators (for side nav variant)
            bottomIndicators.forEach((indicator, index) => {
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
            
            // Update bottom counter (for side nav variant)
            if (counterBottom) {
                counterBottom.textContent = `${currentIndex + 1} / ${totalSlides}`;
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
            
            // Handle differently for <a> vs <button> elements
            if (controlledButton.tagName.toLowerCase() === 'a') {
                // For anchor tags, use class instead of disabled attribute
                // Detect which button variant to apply the correct disabled class
                let disabledClass = 'button--primary-disabled';
                if (controlledButton.classList.contains('button--big-primary')) {
                    disabledClass = 'button--big-primary-disabled';
                } else if (controlledButton.classList.contains('button--small-primary')) {
                    disabledClass = 'button--small-primary-disabled';
                }
                
                if (allSlidesViewed) {
                    controlledButton.classList.remove(disabledClass);
                    controlledButton.style.pointerEvents = '';
                } else {
                    controlledButton.classList.add(disabledClass);
                    controlledButton.style.pointerEvents = 'none';
                }
            } else {
                // For button tags, use disabled attribute
                controlledButton.disabled = !allSlidesViewed;
            }
            
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
        
        // Event listeners for bottom indicators (side nav variant)
        bottomIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Click handlers for in-slide navigation elements
        carousel.addEventListener('click', (e) => {
            // Ignore clicks on carousel controls (buttons, indicators)
            const isControlClick = e.target.closest('.carousel__controls');
            if (isControlClick) {
                return;
            }
            
            const nextSlideElement = e.target.closest('[data-carousel-next-slide]');
            const prevSlideElement = e.target.closest('[data-carousel-prev-slide]');
            const goToSlideElement = e.target.closest('[data-carousel-goto-slide]');
            
            if (nextSlideElement) {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
            } else if (prevSlideElement) {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
            } else if (goToSlideElement) {
                e.preventDefault();
                e.stopPropagation();
                const slideIndex = parseInt(goToSlideElement.getAttribute('data-carousel-goto-slide'), 10);
                if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < totalSlides) {
                    goToSlide(slideIndex);
                }
            }
        }, true);
        
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
        
        // Mark initialization complete
        isInitializing = false;
        
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

