/**
 * ScrollTo Component
 * Manages progressive reveal of sections with fade in/out animations
 * Enabled via front matter: scrollto-enabled: true
 */

function initializeScrollTo() {
    // Only run if scrollto is enabled
    const html = document.documentElement;
    if (!html.hasAttribute('data-scrollto-enabled')) {
        return;
    }

    const sections = Array.from(document.querySelectorAll('.scrollto'));
    
    if (sections.length === 0) {
        return;
    }

    let currentIndex = 0;
    let isScrolling = false;
    const viewedSections = new Set([0]); // Track which sections have been viewed (first is viewed on load)

    // Initialize global state object
    window.blvComponentState = window.blvComponentState || {};

    // Get footer button and disable it initially
    const footerButton = document.getElementById('continue-button');
    if (footerButton) {
        footerButton.classList.add('button--big-primary-disabled');
        footerButton.setAttribute('aria-disabled', 'true');
        // Prevent clicks when disabled
        footerButton.addEventListener('click', function(e) {
            if (this.classList.contains('button--big-primary-disabled')) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Function to check if all sections have been viewed
    function areAllSectionsViewed() {
        return viewedSections.size === sections.length;
    }

    // Expose state to global coordinator
    window.blvComponentState.areAllSectionsViewed = areAllSectionsViewed;
    window.blvComponentState.scrolltoEnabled = true;

    // Function to update footer button based on all component states
    function updateFooterButton() {
        if (!footerButton) return;

        // Check if agreement is also enabled
        const agreementEnabled = window.blvComponentState.agreementEnabled;
        const sectionsViewed = areAllSectionsViewed();
        const agreementsChecked = !agreementEnabled || (window.blvComponentState.areAllAgreementsChecked && window.blvComponentState.areAllAgreementsChecked());

        // Only enable button if all conditions are met
        if (sectionsViewed && agreementsChecked) {
            const wasDisabled = footerButton.classList.contains('button--big-primary-disabled');
            footerButton.classList.remove('button--big-primary-disabled');
            footerButton.removeAttribute('aria-disabled');
            
            // Only animate if this was the scrollto component that enabled it
            if (wasDisabled && sectionsViewed) {
                footerButton.classList.add('scrollto-button-enabled');
                setTimeout(() => {
                    footerButton.classList.remove('scrollto-button-enabled');
                }, 500);
            }
        } else {
            footerButton.classList.add('button--big-primary-disabled');
            footerButton.setAttribute('aria-disabled', 'true');
        }
    }

    // Expose update function for other components to call
    if (!window.blvComponentState.updateFooterButton) {
        window.blvComponentState.updateFooterButton = updateFooterButton;
    }

    // Initialize: show first section
    sections[0].classList.add('scrollto-active');

    // Function to activate a section
    function activateSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        // Remove active from all sections
        sections.forEach(section => section.classList.remove('scrollto-active'));
        
        // Add active to target section
        sections[index].classList.add('scrollto-active');
        
        // Mark section as viewed
        viewedSections.add(index);
        
        // Update footer button based on all component states
        updateFooterButton();
        
        currentIndex = index;
    }

    // Function to navigate to next section
    function goToNextSection() {
        if (currentIndex < sections.length - 1) {
            currentIndex++;
            activateSection(currentIndex);
            sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Function to navigate to previous section
    function goToPreviousSection() {
        if (currentIndex > 0) {
            currentIndex--;
            activateSection(currentIndex);
            sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Use Intersection Observer for scroll detection
    const observerOptions = {
        root: null, // Use viewport
        rootMargin: '-30% 0px -30% 0px', // Trigger when section is 30% into viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        if (isScrolling) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionIndex = sections.indexOf(entry.target);
                if (sectionIndex !== -1 && sectionIndex !== currentIndex) {
                    activateSection(sectionIndex);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Down arrow or Page Down
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            goToNextSection();
        }
        // Up arrow or Page Up
        else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToPreviousSection();
        }
    });

    // Handle anchor links to scrollto sections
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection && targetSection.classList.contains('scrollto')) {
            e.preventDefault();
            const targetIndex = sections.indexOf(targetSection);
            
            if (targetIndex !== -1) {
                isScrolling = true;
                activateSection(targetIndex);
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        }
    });

    // Optional: Add navigation dots indicator
    // createNavigationDots(); // Disabled - dots removed per user request

    function createNavigationDots() {
        const article = document.querySelector('article');
        if (!article) return;
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'scrollto-dots';
        dotsContainer.innerHTML = sections.map((_, index) => 
            `<button class="scrollto-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to section ${index + 1}"></button>`
        ).join('');
        
        article.appendChild(dotsContainer);

        // Dot click handler
        dotsContainer.addEventListener('click', function(e) {
            const dot = e.target.closest('.scrollto-dot');
            if (!dot) return;
            
            const targetIndex = parseInt(dot.getAttribute('data-index'));
            isScrolling = true;
            activateSection(targetIndex);
            sections[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update dots
            dotsContainer.querySelectorAll('.scrollto-dot').forEach((d, i) => {
                d.classList.toggle('active', i === targetIndex);
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        });

        // Update dots on section change
        const originalActivate = activateSection;
        activateSection = function(index) {
            originalActivate(index);
            dotsContainer.querySelectorAll('.scrollto-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        };
    }

    console.log('ScrollTo component initialized with', sections.length, 'sections');
}

