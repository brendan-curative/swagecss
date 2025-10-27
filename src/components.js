/**
 * Swage.CSS Components JavaScript
 * Consolidated JavaScript functionality for all components
 */

// ============================================================================
// ACCORDION COMPONENT
// ============================================================================

function initializeAccordion() {
    // Handle dismissible accordions  
    const toggleButtons = document.querySelectorAll('.accordion__toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.accordion__item');
            const panel = item.querySelector('.accordion__panel');
            const icon = item.querySelector('.accordion__toggle-icon .heroicon');
            const isOpen = button.getAttribute('aria-expanded') === 'true';
            
            if (isOpen) {
                // Close
                button.setAttribute('aria-expanded', 'false');
                panel.classList.remove('accordion__panel--visible');
                panel.classList.add('accordion__panel--hidden');
                icon.classList.remove('heroicon-chevron-down');
                icon.classList.add('heroicon-chevron-right');
                item.classList.remove('accordion__item--open');
            } else {
                // Open
                button.setAttribute('aria-expanded', 'true');
                panel.classList.remove('accordion__panel--hidden');
                panel.classList.add('accordion__panel--visible');
                icon.classList.remove('heroicon-chevron-right');
                icon.classList.add('heroicon-chevron-down');
                item.classList.add('accordion__item--open');
            }
        });
    });

    // Keyboard navigation for accordions
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('accordion__toggle')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });
}

// ============================================================================
// ALERT COMPONENT
// ============================================================================

function initializeAlert() {
    // Handle dismissible alerts
    const dismissButtons = document.querySelectorAll('.alert__close-button');
    dismissButtons.forEach(button => {
        button.addEventListener('click', () => {
            const alert = button.closest('.alert');
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                alert.remove();
            }, 200);
        });
    });

    // Toggle alert demo
    const toggleButton = document.getElementById('toggleAlert');
    const dynamicContainer = document.getElementById('dynamicAlertContainer');
    let isAlertVisible = false;

    if (toggleButton && dynamicContainer) {
        toggleButton.addEventListener('click', () => {
            if (isAlertVisible) {
                // Remove alert
                const alert = dynamicContainer.querySelector('.alert');
                if (alert) {
                    alert.style.opacity = '0';
                    alert.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        dynamicContainer.innerHTML = '';
                        isAlertVisible = false;
                        toggleButton.textContent = 'Show Alert';
                    }, 200);
                }
            } else {
                // Add alert
                dynamicContainer.innerHTML = `
                    <div class="alert alert--success alert--animated" tabindex="-1">
                        <div class="alert__icon">
                            <div class="heroicon heroicon-24 heroicon-check-circle"></div>
                        </div>
                        <div class="alert__content alert__content--with-close">
                            <div class="alert__title">Dynamic Alert</div>
                            <div class="alert__message">This alert was created dynamically and can be dismissed.</div>
                        </div>
                        <button class="alert__close-button" type="button" aria-label="Close dynamic alert">
                            <div class="heroicon heroicon-24 heroicon-x-mark"></div>
                            <span class="alert__sr-only">Close dynamic alert</span>
                        </button>
                    </div>
                `;
                
                // Add dismiss handler to new alert
                const newAlert = dynamicContainer.querySelector('.alert');
                const newDismissButton = newAlert.querySelector('.alert__close-button');
                newDismissButton.addEventListener('click', () => {
                    newAlert.style.opacity = '0';
                    newAlert.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        dynamicContainer.innerHTML = '';
                        isAlertVisible = false;
                        toggleButton.textContent = 'Show Alert';
                    }, 200);
                });
                
                isAlertVisible = true;
                toggleButton.textContent = 'Hide Alert';
            }
        });
    }

    // Focus management demos
    const showFocusableButton = document.getElementById('showFocusableAlert');
    const showFocusableDismissibleButton = document.getElementById('showFocusableDismissible');
    const focusContainer = document.getElementById('focusAlertContainer');

    if (showFocusableButton && focusContainer) {
        showFocusableButton.addEventListener('click', () => {
            focusContainer.innerHTML = `
                <div class="alert alert--success alert--animated" tabindex="-1" role="alert" aria-live="polite">
                    <div class="alert__icon">
                        <div class="heroicon heroicon-24 heroicon-check-circle"></div>
                    </div>
                    <div class="alert__content">
                        <div class="alert__title">This alert received focus</div>
                        <div class="alert__message">When this alert appeared, it received keyboard focus automatically.</div>
                    </div>
                </div>
            `;
            
            // Focus the alert
            const alert = focusContainer.querySelector('.alert');
            setTimeout(() => {
                alert.focus();
            }, 100);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.opacity = '0';
                    alert.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        focusContainer.innerHTML = '';
                    }, 200);
                }
            }, 5000);
        });
    }

    if (showFocusableDismissibleButton && focusContainer) {
        showFocusableDismissibleButton.addEventListener('click', () => {
            focusContainer.innerHTML = `
                <div class="alert alert--info alert--animated" tabindex="-1" role="alert" aria-live="polite">
                    <div class="alert__icon">
                        <div class="heroicon heroicon-24 heroicon-exclamation-circle"></div>
                    </div>
                    <div class="alert__content alert__content--with-close">
                        <div class="alert__title">This alert received focus</div>
                        <div class="alert__message">When this alert appeared, the close button received keyboard focus automatically.</div>
                    </div>
                    <button class="alert__close-button" type="button" aria-label="Close focusable alert">
                        <div class="heroicon heroicon-24 heroicon-x-mark"></div>
                        <span class="alert__sr-only">Close focusable alert</span>
                    </button>
                </div>
            `;
            
            // Focus the close button
            const alert = focusContainer.querySelector('.alert');
            const closeButton = alert.querySelector('.alert__close-button');
            
            setTimeout(() => {
                closeButton.focus();
            }, 100);

            // Add close handler
            closeButton.addEventListener('click', () => {
                alert.style.opacity = '0';
                alert.style.transform = 'translateY(-8px)';
                setTimeout(() => {
                    focusContainer.innerHTML = '';
                }, 200);
            });
        });
    }

    // Handle link clicks in alerts
    const alertLinks = document.querySelectorAll('.alert__message-link');
    alertLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Alert link clicked:', link.textContent);
            // In a real application, this would navigate or perform an action
        });
    });

    // Keyboard navigation for alerts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any visible dismissible alerts when pressing Escape
            const visibleAlerts = document.querySelectorAll('.alert .alert__close-button');
            visibleAlerts.forEach(button => {
                const alert = button.closest('.alert');
                if (alert === document.activeElement || alert.contains(document.activeElement)) {
                    button.click();
                }
            });
        }
    });
}

// ============================================================================
// BANNER COMPONENT
// ============================================================================

function initializeBanner() {
    // Handle banner toggles
    const bannerToggles = document.querySelectorAll('.banner__toggle');
    bannerToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const banner = toggle.closest('.banner');
            const panel = banner.querySelector('.banner__panel');
            const chevron = toggle.querySelector('.banner__toggle-chevron .heroicon');
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Collapse
                toggle.setAttribute('aria-expanded', 'false');
                panel.classList.remove('banner__panel--visible');
                panel.classList.add('banner__panel--hidden');
                chevron.classList.remove('heroicon-chevron-up');
                chevron.classList.add('heroicon-chevron-down');
            } else {
                // Expand
                toggle.setAttribute('aria-expanded', 'true');
                panel.classList.remove('banner__panel--hidden');
                panel.classList.add('banner__panel--visible');
                chevron.classList.remove('heroicon-chevron-down');
                chevron.classList.add('heroicon-chevron-up');
            }
        });
    });

    // Handle link clicks in banners
    const bannerLinks = document.querySelectorAll('.banner .primary-link');
    bannerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Banner link clicked:', link.textContent);
            // In a real application, this would navigate or perform an action
        });
    });

    // Keyboard navigation for banners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('banner__toggle')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

// Click handler demo
function updateClickTime() {
    const now = new Date();
    const clickTimeElement = document.getElementById('click-time');
    if (clickTimeElement) {
        clickTimeElement.textContent = now.toLocaleString();
    }
}

function resetClickTime() {
    const clickTimeElement = document.getElementById('click-time');
    if (clickTimeElement) {
        clickTimeElement.textContent = 'null';
    }
}

// Form handling
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    alert(`Form submitted with data: ${JSON.stringify(data, null, 2)}`);
}

function clearForm() {
    const nameField = document.getElementById('demo-name');
    const emailField = document.getElementById('demo-email');
    if (nameField) nameField.value = '';
    if (emailField) emailField.value = '';
}

function initializeButton() {
    // Loading state demo (for demonstration)
    const loadingButtons = document.querySelectorAll('.button--loading .button__spinner');
    loadingButtons.forEach(spinner => {
        // Add rotation animation using CSS transforms
        let rotation = 0;
        setInterval(() => {
            rotation += 30;
            spinner.style.transform = `rotate(${rotation}deg)`;
        }, 100);
    });
}

// ============================================================================
// CARD COMPONENT
// ============================================================================

function initializeCard() {
    // Add click handlers for interactive demonstrations
    const interactiveCards = document.querySelectorAll('.card--interactive');
    
    interactiveCards.forEach(card => {
        card.addEventListener('click', () => {
            const heading = card.querySelector('.card__heading');
            console.log('Card clicked:', heading ? heading.textContent : 'Unknown card');
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const heading = card.querySelector('.card__heading');
                console.log('Card activated:', heading ? heading.textContent : 'Unknown card');
            }
        });
    });

    // Demo button handlers
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Button clicked:', button.textContent.trim());
        });
    });
}

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

// Track selected services
function updateSelectedServices() {
    const checkboxes = document.querySelectorAll('input[name="services"]:checked');
    const selectedDiv = document.getElementById('selected-services');
    
    if (selectedDiv) {
        if (checkboxes.length === 0) {
            selectedDiv.textContent = 'None selected';
            selectedDiv.className = 'body-sm text-gray-600';
        } else {
            const services = Array.from(checkboxes).map(cb => {
                const label = cb.closest('.checkbox').querySelector('.checkbox__label-title');
                return label ? label.textContent : cb.value;
            });
            selectedDiv.textContent = services.join(', ');
            selectedDiv.className = 'body-sm text-foundation-primary';
        }
    }
}

// Handle form submission
function handleCheckboxFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const services = formData.getAll('services');
    
    if (services.length === 0) {
        alert('Please select at least one service.');
        return;
    }
    
    alert(`Services selected: ${services.join(', ')}`);
}

function initializeCheckbox() {
    // Add event listeners to service checkboxes
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedServices);
    });

    // Handle control-short variant checked class
    const controlShortCheckboxes = document.querySelectorAll('.checkbox--control-short input[type="checkbox"]');
    controlShortCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.checkbox');
            if (this.checked) {
                label.classList.add('checkbox--checked');
            } else {
                label.classList.remove('checkbox--checked');
            }
        });
    });

    // Initialize selected services display
    updateSelectedServices();
}

// ============================================================================
// LOGO COMPONENT
// ============================================================================

function initializeLogo() {
    console.log('Logo component demo loaded');
    
    // Simple responsive size indicator
    function updateResponsiveInfo() {
        const currentSize = window.innerWidth >= 768 ? '32px' : '24px';
        console.log(`Current responsive logo size: ${currentSize}`);
    }
    
    window.addEventListener('resize', updateResponsiveInfo);
    updateResponsiveInfo();
}

// ============================================================================
// MIN MAX PROGRESS BAR COMPONENT
// ============================================================================

// Function to update progress with animation
function updateProgress(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (!progressBar) return;
    
    const fillElement = progressBar.querySelector('.min-max-progress-bar__fill');
    const trackContainer = progressBar.querySelector('.min-max-progress-bar__track-container');
    const textContainer = progressBar.querySelector('.min-max-progress-bar__text-container');
    
    if (!fillElement || !trackContainer || !textContainer) return;
    
    // Calculate amounts based on $4,000 total
    const maxAmount = 4000;
    const spentAmount = (percentage * maxAmount) / 100;
    const remainingAmount = maxAmount - spentAmount;
    
    // Update progress bar width
    fillElement.style.width = percentage + '%';
    
    // Update ARIA values
    trackContainer.setAttribute('aria-valuenow', percentage);
    
    // Update classes based on state
    if (percentage > 0) {
        progressBar.classList.add('min-max-progress-bar--active');
    } else {
        progressBar.classList.remove('min-max-progress-bar--active');
    }
    
    // Update text content
    if (percentage >= 100) {
        // Show max met text
        textContainer.innerHTML = '<span class="min-max-progress-bar__max-met-text">Your Deductible has been met!</span>';
    } else {
        // Show start and end text
        textContainer.innerHTML = `
            <span class="min-max-progress-bar__start-text">$${spentAmount.toLocaleString()} spent</span>
            <span class="min-max-progress-bar__end-text">$${remainingAmount.toLocaleString()} remaining</span>
        `;
    }
    
    console.log(`Progress updated to ${percentage}% for ${elementId}`);
}

// Function to update work progress
function updateWorkProgress(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (!progressBar) return;
    
    const fillElement = progressBar.querySelector('.min-max-progress-bar__fill');
    const trackContainer = progressBar.querySelector('.min-max-progress-bar__track-container');
    const textContainer = progressBar.querySelector('.min-max-progress-bar__text-container');
    
    if (!fillElement || !trackContainer || !textContainer) return;
    
    // Calculate hours based on 40 hour total
    const maxHours = 40;
    const workedHours = (percentage * maxHours) / 100;
    const remainingHours = maxHours - workedHours;
    
    // Update progress bar width
    fillElement.style.width = percentage + '%';
    
    // Update ARIA values
    trackContainer.setAttribute('aria-valuenow', percentage);
    
    // Update classes based on state
    if (percentage > 0) {
        progressBar.classList.add('min-max-progress-bar--active');
    } else {
        progressBar.classList.remove('min-max-progress-bar--active');
    }
    
    // Update text content
    if (percentage >= 100) {
        // Show max met text
        textContainer.innerHTML = '<span class="min-max-progress-bar__max-met-text">Full work week completed!</span>';
    } else {
        // Show start and end text
        textContainer.innerHTML = `
            <span class="min-max-progress-bar__start-text">${workedHours} hours worked</span>
            <span class="min-max-progress-bar__end-text">${remainingHours} hours remaining</span>
        `;
    }
    
    console.log(`Work progress updated to ${percentage}% for ${elementId}`);
}

function initializeMinMaxProgressBar() {
    console.log('MinMaxProgressBar demo page loaded');
    
    // Log all progress bars for debugging
    const progressBars = document.querySelectorAll('.min-max-progress-bar');
    console.log(`Found ${progressBars.length} progress bars on the page`);
    
    // Accessibility enhancement: Add keyboard support for interactive progress bars
    const interactiveButtons = document.querySelectorAll('button[onclick]');
    interactiveButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

// ============================================================================
// MODAL COMPONENT
// ============================================================================

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('modal--open');
        document.body.classList.add('modal-open');
        
        // Focus management for accessibility
        const firstFocusableElement = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
        
        console.log(`Opened modal: ${modalId}`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('modal--open');
        document.body.classList.remove('modal-open');
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
        
        console.log(`Closed modal: ${modalId}`);
    }
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal--open');
        if (openModal && !openModal.classList.contains('modal--no-close')) {
            closeModal(openModal.id);
        }
    }
}

// Specific action handlers
function confirmAction(modalId) {
    alert('Action confirmed!');
    closeModal(modalId);
}

function submitForm(modalId) {
    const form = document.getElementById('userForm');
    if (!form) return;
    
    const formData = new FormData(form);
    
    // Simple form validation
    const name = document.getElementById('userName');
    const email = document.getElementById('userEmail');
    
    if (!name || !email || !name.value || !email.value) {
        alert('Please fill in all required fields.');
        return;
    }
    
    alert('User information saved successfully!');
    closeModal(modalId);
    
    // Reset form
    form.reset();
}

function deleteItem(modalId) {
    alert('Item deleted successfully!');
    closeModal(modalId);
}

function initializeModal() {
    console.log('Modal component initialized');
    
    // Enhanced click outside to close functionality
    document.addEventListener('click', (event) => {
        // Check if clicked on backdrop element
        if (event.target.classList.contains('modal__backdrop')) {
            const modal = event.target.closest('.modal');
            if (modal && !modal.classList.contains('modal--no-close')) {
                closeModal(modal.id);
                return;
            }
        }
        
        // Check if clicked on modal overlay (outside modal content)
        if (event.target.classList.contains('modal') && event.target.classList.contains('modal--open')) {
            const modal = event.target;
            if (modal && !modal.classList.contains('modal--no-close')) {
                closeModal(modal.id);
                return;
            }
        }
        
        // Check if clicked on modal container (between content and edges)
        if (event.target.classList.contains('modal__container')) {
            const modal = event.target.closest('.modal');
            if (modal && !modal.classList.contains('modal--no-close')) {
                closeModal(modal.id);
                return;
            }
        }
    });
    
    // Trap focus within modal when open
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            const openModal = document.querySelector('.modal--open');
            if (openModal) {
                const focusableElements = openModal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });
}

// ============================================================================
// RADIO COMPONENT
// ============================================================================

// Reset form function
function resetForm() {
    const surveyForm = document.getElementById('surveyForm');
    const formResults = document.getElementById('formResults');
    
    if (surveyForm) {
        surveyForm.reset();
    }
    if (formResults) {
        formResults.style.display = 'none';
    }
    
    console.log('Form reset');
}

function initializeRadio() {
    console.log('Radio demo page loaded');
    
    // Theme group interaction
    const themeInputs = document.querySelectorAll('input[name="themeGroup"]');
    const themeOutput = document.getElementById('themeOutput');
    
    themeInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked && themeOutput) {
                const themeNames = {
                    'light': 'Light Theme',
                    'dark': 'Dark Theme',
                    'auto': 'Auto (System)'
                };
                themeOutput.textContent = `Selected: ${themeNames[input.value]}`;
                console.log(`Theme changed to: ${input.value}`);
            }
        });
    });
    
    // Notification group interaction
    const notificationInputs = document.querySelectorAll('input[name="notificationGroup"]');
    const notificationOutput = document.getElementById('notificationOutput');
    
    notificationInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked && notificationOutput) {
                const notificationNames = {
                    'all': 'All Notifications',
                    'important': 'Important Only',
                    'none': 'No Notifications'
                };
                notificationOutput.textContent = `Selected: ${notificationNames[input.value]}`;
                console.log(`Notification preference changed to: ${input.value}`);
            }
        });
    });
    
    // Survey form submission
    const surveyForm = document.getElementById('surveyForm');
    const formResults = document.getElementById('formResults');
    const resultsContent = document.getElementById('resultsContent');
    
    if (surveyForm && formResults && resultsContent) {
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(surveyForm);
            const rating = formData.get('rating');
            const recommend = formData.get('recommend');
            
            if (!rating || !recommend) {
                alert('Please answer all questions before submitting.');
                return;
            }
            
            resultsContent.innerHTML = `
                <p><strong>Service Rating:</strong> ${rating}</p>
                <p><strong>Would Recommend:</strong> ${recommend}</p>
            `;
            
            formResults.style.display = 'block';
            console.log('Survey submitted:', { rating, recommend });
        });
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.type === 'radio') {
                const radioGroup = document.querySelectorAll(`input[name="${activeElement.name}"]`);
                const currentIndex = Array.from(radioGroup).indexOf(activeElement);
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % radioGroup.length;
                } else {
                    nextIndex = (currentIndex - 1 + radioGroup.length) % radioGroup.length;
                }
                
                radioGroup[nextIndex].focus();
                radioGroup[nextIndex].checked = true;
                radioGroup[nextIndex].dispatchEvent(new Event('change'));
                
                e.preventDefault();
            }
        }
    });
}

// ============================================================================
// SELECT COMPONENT
// ============================================================================

// Country data for dependent select example
const countryData = {
    'north-america': [
        { value: 'us', text: 'United States' },
        { value: 'ca', text: 'Canada' },
        { value: 'mx', text: 'Mexico' }
    ],
    'europe': [
        { value: 'uk', text: 'United Kingdom' },
        { value: 'de', text: 'Germany' },
        { value: 'fr', text: 'France' },
        { value: 'it', text: 'Italy' },
        { value: 'es', text: 'Spain' }
    ],
    'asia': [
        { value: 'jp', text: 'Japan' },
        { value: 'cn', text: 'China' },
        { value: 'in', text: 'India' },
        { value: 'kr', text: 'South Korea' }
    ],
    'south-america': [
        { value: 'br', text: 'Brazil' },
        { value: 'ar', text: 'Argentina' },
        { value: 'cl', text: 'Chile' },
        { value: 'co', text: 'Colombia' }
    ]
};

function setupDependentSelects() {
    const regionSelect = document.getElementById('regionSelect');
    const countrySelect = document.getElementById('countryDependentSelect');
    const selectionOutput = document.getElementById('selectionOutput');
    
    if (!regionSelect || !countrySelect || !selectionOutput) return;
    
    regionSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        
        // Clear country select
        countrySelect.innerHTML = '';
        
        if (selectedRegion) {
            // Enable country select and populate with countries
            countrySelect.disabled = false;
            countrySelect.innerHTML = '<option value="">Select country...</option>';
            
            const countries = countryData[selectedRegion] || [];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.value;
                option.textContent = country.text;
                countrySelect.appendChild(option);
            });
        } else {
            // Disable country select
            countrySelect.disabled = true;
            countrySelect.innerHTML = '<option value="">First select a region...</option>';
        }
        
        updateSelectionOutput();
    });
    
    countrySelect.addEventListener('change', updateSelectionOutput);
    
    function updateSelectionOutput() {
        const regionText = regionSelect.options[regionSelect.selectedIndex]?.text || 'None selected';
        const countryText = countrySelect.options[countrySelect.selectedIndex]?.text || 'None selected';
        
        selectionOutput.innerHTML = `
            Region: ${regionText === 'Select region...' ? 'None selected' : regionText}<br>
            Country: ${countryText.includes('select') ? 'None selected' : countryText}
        `;
    }
}

function setupFormValidation() {
    const profileForm = document.getElementById('profileForm');
    const industrySelect = document.getElementById('industrySelect');
    const industryWrapper = document.getElementById('industrySelectWrapper');
    const industryError = document.getElementById('industryError');
    
    if (!profileForm || !industrySelect || !industryWrapper || !industryError) return;
    
    // Real-time validation for industry select
    industrySelect.addEventListener('change', () => {
        if (industrySelect.value) {
            industryWrapper.classList.remove('select--error');
            industryWrapper.classList.add('select--success');
            industryError.style.display = 'none';
        } else {
            industryWrapper.classList.remove('select--success');
        }
    });
    
    // Form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate required industry field
        if (!industrySelect.value) {
            industryWrapper.classList.add('select--error');
            industryError.style.display = 'block';
            isValid = false;
        }
        
        if (isValid) {
            // Show results
            const formData = new FormData(profileForm);
            const results = document.getElementById('profileResults');
            const resultsContent = document.getElementById('profileResultsContent');
            
            if (results && resultsContent) {
                let resultHTML = '';
                for (let [key, value] of formData.entries()) {
                    if (value) {
                        const label = document.querySelector(`label[for="${key}Select"]`)?.textContent || key;
                        const selectedOption = document.querySelector(`#${key}Select option[value="${value}"]`)?.textContent || value;
                        resultHTML += `<p><strong>${label}:</strong> ${selectedOption}</p>`;
                    }
                }
                
                resultsContent.innerHTML = resultHTML || '<p>No data selected</p>';
                results.style.display = 'block';
                
                console.log('Profile form submitted successfully');
            }
        }
    });
}

function setupChangeListeners() {
    // Add change listeners to demonstrate functionality
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            console.log(`Select changed: ${e.target.id || 'unnamed'} = ${e.target.value}`);
        });
    });
}

function resetProfileForm() {
    const profileForm = document.getElementById('profileForm');
    const results = document.getElementById('profileResults');
    const industryWrapper = document.getElementById('industrySelectWrapper');
    const industryError = document.getElementById('industryError');
    
    if (profileForm) {
        profileForm.reset();
    }
    if (results) {
        results.style.display = 'none';
    }
    
    // Reset validation states
    if (industryWrapper) {
        industryWrapper.classList.remove('select--error', 'select--success');
    }
    if (industryError) {
        industryError.style.display = 'none';
    }
    
    console.log('Profile form reset');
}

// Custom select enhancement (optional future enhancement)
function enhanceSelectAccessibility() {
    const selects = document.querySelectorAll('.select__control');
    selects.forEach(select => {
        // Add ARIA attributes for better screen reader support
        if (!select.hasAttribute('aria-label') && !select.hasAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${select.id}"]`);
            if (label) {
                select.setAttribute('aria-labelledby', label.id || 'label-' + select.id);
                if (!label.id) {
                    label.id = 'label-' + select.id;
                }
            }
        }
    });
}

function initializeSelect() {
    console.log('Select demo page loaded');
    
    // Set up dependent select functionality
    setupDependentSelects();
    
    // Set up form validation
    setupFormValidation();
    
    // Add change listeners for demonstration
    setupChangeListeners();

    // Add keyboard support for better accessibility
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT' && (e.key === 'Enter' || e.key === ' ')) {
            // Enhanced keyboard interaction could be added here
            // For now, rely on native select behavior
        }
    });

    // Call accessibility enhancement
    enhanceSelectAccessibility();
}

// ============================================================================
// TABLE COMPONENT
// ============================================================================

// Table sorting functionality
class TableSorter {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        if (!this.table) return;
        
        this.headers = this.table.querySelectorAll('.table__header-cell--sortable');
        this.tbody = this.table.querySelector('.table__body');
        this.currentSort = { column: null, direction: null };
        
        this.init();
    }
    
    init() {
        this.headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sort(column, header);
            });
        });
    }
    
    sort(column, header) {
        const rows = Array.from(this.tbody.querySelectorAll('.table__row'));
        const isCurrentColumn = this.currentSort.column === column;
        const direction = isCurrentColumn && this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        
        // Update sort state
        this.currentSort = { column, direction };
        
        // Clear all sort indicators
        this.headers.forEach(h => {
            h.classList.remove('table__header-cell--sorted-asc', 'table__header-cell--sorted-desc');
            const icon = h.querySelector('.heroicon');
            if (icon) {
                icon.className = 'heroicon heroicon-16 heroicon-chevron-up-down';
            }
        });
        
        // Set current sort indicator
        header.classList.add(`table__header-cell--sorted-${direction}`);
        const icon = header.querySelector('.heroicon');
        if (icon) {
            icon.className = `heroicon heroicon-16 heroicon-chevron-${direction === 'asc' ? 'up' : 'down'}`;
        }
        
        // Sort rows
        rows.sort((a, b) => {
            const aValue = this.getCellValue(a, column);
            const bValue = this.getCellValue(b, column);
            
            return this.compareValues(aValue, bValue, direction);
        });
        
        // Reorder rows in DOM
        rows.forEach(row => this.tbody.appendChild(row));
        
        console.log(`Table sorted by ${column} in ${direction} order`);
    }
    
    getCellValue(row, column) {
        const cell = row.querySelector(`[data-label="${this.capitalizeFirst(column)}"]`);
        return cell ? cell.textContent.trim() : '';
    }
    
    compareValues(a, b, direction) {
        // Try to parse as numbers
        const aNum = parseFloat(a.replace(/[$,]/g, ''));
        const bNum = parseFloat(b.replace(/[$,]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison
        return direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Table selection functionality
class TableSelector {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        if (!this.table) return;
        
        this.selectAllCheckbox = document.getElementById('selectAll');
        this.rowCheckboxes = this.table.querySelectorAll('.row-checkbox');
        this.selectionCount = document.getElementById('selectionCount');
        this.deleteButton = document.getElementById('deleteSelected');
        this.downloadButton = document.getElementById('downloadSelected');
        
        if (!this.selectAllCheckbox || !this.selectionCount || !this.deleteButton || !this.downloadButton) return;
        
        this.init();
    }
    
    init() {
        // Select all functionality
        this.selectAllCheckbox.addEventListener('change', () => {
            const isChecked = this.selectAllCheckbox.checked;
            this.rowCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                this.updateRowSelection(checkbox);
            });
            this.updateSelectionUI();
        });
        
        // Individual row selection
        this.rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRowSelection(checkbox);
                this.updateSelectAllState();
                this.updateSelectionUI();
            });
        });
        
        // Action buttons
        this.deleteButton.addEventListener('click', () => this.deleteSelected());
        this.downloadButton.addEventListener('click', () => this.downloadSelected());
    }
    
    updateRowSelection(checkbox) {
        const row = checkbox.closest('.table__row');
        if (checkbox.checked) {
            row.classList.add('table__row--selected');
        } else {
            row.classList.remove('table__row--selected');
        }
    }
    
    updateSelectAllState() {
        const checkedCount = Array.from(this.rowCheckboxes).filter(cb => cb.checked).length;
        const totalCount = this.rowCheckboxes.length;
        
        if (checkedCount === 0) {
            this.selectAllCheckbox.checked = false;
            this.selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === totalCount) {
            this.selectAllCheckbox.checked = true;
            this.selectAllCheckbox.indeterminate = false;
        } else {
            this.selectAllCheckbox.checked = false;
            this.selectAllCheckbox.indeterminate = true;
        }
    }
    
    updateSelectionUI() {
        const selectedCount = Array.from(this.rowCheckboxes).filter(cb => cb.checked).length;
        
        this.selectionCount.textContent = `${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected`;
        
        const hasSelection = selectedCount > 0;
        this.deleteButton.disabled = !hasSelection;
        this.downloadButton.disabled = !hasSelection;
    }
    
    deleteSelected() {
        const selectedRows = Array.from(this.rowCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.closest('.table__row'));
        
        if (selectedRows.length > 0) {
            const confirm = window.confirm(`Delete ${selectedRows.length} selected item(s)?`);
            if (confirm) {
                selectedRows.forEach(row => row.remove());
                this.updateSelectionUI();
                console.log(`Deleted ${selectedRows.length} items`);
            }
        }
    }
    
    downloadSelected() {
        const selectedFiles = Array.from(this.rowCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => {
                const row = cb.closest('.table__row');
                const fileName = row.querySelector('[data-label="File Name"]');
                return fileName ? fileName.textContent : 'Unknown file';
            });
        
        alert(`Downloaded: ${selectedFiles.join(', ')}`);
        console.log('Downloaded files:', selectedFiles);
    }
}

function addResponsiveDemo() {
    const responsiveTable = document.querySelector('.table--responsive');
    if (responsiveTable) {
        // Add a button to toggle responsive mode for demonstration
        const container = responsiveTable.closest('.demo-item');
        if (container) {
            const button = document.createElement('button');
            button.className = 'button button--outline';
            button.textContent = 'Toggle Mobile View';
            button.style.marginBottom = '16px';
            
            button.addEventListener('click', () => {
                responsiveTable.classList.toggle('table--force-responsive');
            });
            
            container.insertBefore(button, container.firstChild);
        }
    }
}

// Utility function for table actions
function editTableRow(button) {
    const row = button.closest('.table__row');
    const cells = row.querySelectorAll('.table__cell:not(:last-child)');
    
    // Simple inline editing simulation
    cells.forEach(cell => {
        const currentText = cell.textContent;
        cell.innerHTML = `<input type="text" value="${currentText}" style="border: 1px solid #ccc; padding: 4px; width: 100%;">`;
    });
    
    button.textContent = 'Save';
    button.onclick = () => saveTableRow(button);
}

function saveTableRow(button) {
    const row = button.closest('.table__row');
    const inputs = row.querySelectorAll('input[type="text"]');
    
    inputs.forEach(input => {
        const cell = input.parentElement;
        cell.textContent = input.value;
    });
    
    button.textContent = 'Edit';
    button.onclick = () => editTableRow(button);
    
    console.log('Row saved');
}

function initializeTable() {
    console.log('Table demo page loaded');
    
    // Initialize sortable table
    if (document.getElementById('sortableTable')) {
        new TableSorter('sortableTable');
    }
    
    // Initialize selectable table
    if (document.getElementById('selectableTable')) {
        new TableSelector('selectableTable');
    }
    
    // Add responsive behavior demonstration
    addResponsiveDemo();
}

// ============================================================================
// TOGGLE COMPONENT
// ============================================================================

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleText = document.getElementById('themeToggleText');
    const themeOutput = document.getElementById('themeOutput');
    
    if (themeToggle && themeToggleText && themeOutput) {
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            themeToggleText.textContent = isDark ? 'Dark theme' : 'Light theme';
            themeOutput.textContent = `Current theme: ${isDark ? 'Dark' : 'Light'}`;
            
            // Optional: Apply theme changes to demo
            if (isDark) {
                document.documentElement.style.setProperty('--demo-bg', '#1a1a1a');
                document.documentElement.style.setProperty('--demo-text', '#ffffff');
            } else {
                document.documentElement.style.removeProperty('--demo-bg');
                document.documentElement.style.removeProperty('--demo-text');
            }
            
            console.log(`Theme changed to: ${isDark ? 'dark' : 'light'}`);
        });
    }
}

function setupAutosaveToggle() {
    const autosaveToggle = document.getElementById('autosaveToggle');
    const autosaveOutput = document.getElementById('autosaveOutput');
    
    if (autosaveToggle && autosaveOutput) {
        autosaveToggle.addEventListener('change', () => {
            const isEnabled = autosaveToggle.checked;
            autosaveOutput.textContent = `Auto-save: ${isEnabled ? 'Enabled' : 'Disabled'}`;
            
            console.log(`Auto-save ${isEnabled ? 'enabled' : 'disabled'}`);
        });
    }
}

function setupToggleFormHandling() {
    const settingsForm = document.getElementById('settingsForm');
    const settingsResults = document.getElementById('settingsResults');
    const settingsResultsContent = document.getElementById('settingsResultsContent');
    
    if (settingsForm && settingsResults && settingsResultsContent) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(settingsForm);
            const settings = {};
            
            // Get all toggle states
            const toggles = settingsForm.querySelectorAll('.toggle__input');
            toggles.forEach(toggle => {
                const name = toggle.name || toggle.id;
                const label = settingsForm.querySelector(`label[for="${toggle.id}"] .toggle__text`);
                const labelText = label ? label.textContent : name;
                
                settings[labelText] = toggle.checked ? 'Enabled' : 'Disabled';
            });
            
            // Display results
            let resultHTML = '';
            Object.entries(settings).forEach(([key, value]) => {
                resultHTML += `<p><strong>${key}:</strong> ${value}</p>`;
            });
            
            settingsResultsContent.innerHTML = resultHTML;
            settingsResults.style.display = 'block';
            
            console.log('Settings saved:', settings);
        });
    }
}

function resetSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');
    const settingsResults = document.getElementById('settingsResults');
    
    if (settingsForm) {
        // Reset to default values
        const defaults = {
            'emailNotifications': true,
            'pushNotifications': false,
            'highContrast': false,
            'largeText': false
        };
        
        Object.entries(defaults).forEach(([name, checked]) => {
            const toggle = settingsForm.querySelector(`[name="${name}"]`);
            if (toggle) {
                toggle.checked = checked;
            }
        });
        
        if (settingsResults) {
            settingsResults.style.display = 'none';
        }
        console.log('Settings reset to defaults');
    }
}

function enhanceToggleAccessibility() {
    const toggles = document.querySelectorAll('.toggle__input');
    
    toggles.forEach(toggle => {
        // Add keyboard support for space bar (native checkbox behavior)
        toggle.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                // Let native checkbox behavior handle space key
                // Just add visual feedback
                const toggleWrapper = toggle.closest('.toggle');
                if (toggleWrapper) {
                    toggleWrapper.classList.add('toggle--focused');
                }
            }
        });
        
        // Add focus indicators
        toggle.addEventListener('focus', () => {
            const toggleWrapper = toggle.closest('.toggle');
            if (toggleWrapper) {
                toggleWrapper.classList.add('toggle--focused');
            }
        });
        
        toggle.addEventListener('blur', () => {
            const toggleWrapper = toggle.closest('.toggle');
            if (toggleWrapper) {
                toggleWrapper.classList.remove('toggle--focused');
            }
        });
        
        // Add change event logging and animation
        toggle.addEventListener('change', () => {
            const label = document.querySelector(`label[for="${toggle.id}"] .toggle__text`);
            const labelText = label ? label.textContent : toggle.id;
            console.log(`Toggle changed: ${labelText} = ${toggle.checked ? 'on' : 'off'}`);
            
            // Add animation feedback
            const slider = toggle.nextElementSibling?.querySelector('.toggle__slider');
            if (slider) {
                slider.classList.add('toggle__slider--animating');
                setTimeout(() => {
                    slider.classList.remove('toggle__slider--animating');
                }, 300);
            }
        });
    });
}

// Utility function to programmatically control toggles
function setToggleState(toggleId, state) {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        toggle.checked = state;
        toggle.dispatchEvent(new Event('change'));
    }
}

// Utility function to get all toggle states
function getAllToggleStates() {
    const toggles = document.querySelectorAll('.toggle__input');
    const states = {};
    
    toggles.forEach(toggle => {
        const label = document.querySelector(`label[for="${toggle.id}"] .toggle__text`);
        const labelText = label ? label.textContent : toggle.id;
        states[labelText] = toggle.checked;
    });
    
    return states;
}

// Add animation support for toggles
function addToggleAnimations() {
    const toggleSliders = document.querySelectorAll('.toggle__slider');
    
    toggleSliders.forEach(slider => {
        const toggle = slider.closest('.toggle').querySelector('.toggle__input');
        
        if (toggle) {
            toggle.addEventListener('change', () => {
                // Add a subtle animation class
                slider.classList.add('toggle__slider--animating');
                
                setTimeout(() => {
                    slider.classList.remove('toggle__slider--animating');
                }, 300);
            });
        }
    });
}

// Demonstrate toggle group interactions
function setupToggleGroups() {
    const privacyToggles = document.querySelectorAll('[id^="privacy"]');
    
    privacyToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const enabledCount = Array.from(privacyToggles).filter(t => t.checked).length;
            console.log(`Privacy settings enabled: ${enabledCount}/${privacyToggles.length}`);
        });
    });
}

function initializeToggle() {
    console.log('Toggle demo page loaded');
    
    // Theme toggle functionality
    setupThemeToggle();
    
    // Auto-save toggle functionality
    setupAutosaveToggle();
    
    // Form handling
    setupToggleFormHandling();
    
    // Add keyboard accessibility enhancements
    enhanceToggleAccessibility();

    // Initialize animations
    addToggleAnimations();

    setupToggleGroups();
}

// ============================================================================
// TEXTFIELD COMPONENT
// ============================================================================

function initializeTextfield() {
    // Character count functionality
    const charCountInput = document.getElementById('input-char-count');
    const charCountDisplay = charCountInput?.parentElement.parentElement.querySelector('.textfield__char-count');

    if (charCountInput && charCountDisplay) {
        const maxLength = charCountInput.getAttribute('maxlength');
        charCountInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCountDisplay.textContent = `${currentLength}/${maxLength}`;
        });
    }

    // Clear button functionality
    const clearButtons = document.querySelectorAll('.textfield__button[aria-label="Clear input"]');
    clearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.textfield__input');
            if (input) {
                input.value = '';
                input.focus();
            }
        });
    });

    // Demo form submission prevention
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('This is a demo - form submission prevented');
        });
    });
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Swage.CSS Components JavaScript loaded');
    
    // Initialize all components
    initializeAccordion();
    initializeAlert();
    initializeBanner();
    initializeButton();
    initializeCard();
    initializeCheckbox();
    initializeLogo();
    initializeMinMaxProgressBar();
    initializeModal();
    initializeRadio();
    initializeSelect();
    initializeTable();
    initializeToggle();
    initializeTextfield();
    
    // BLV Components
    if (typeof initializeHorizontalStepper === 'function') {
        initializeHorizontalStepper();
    }
    if (typeof initializeCheckmarkButton === 'function') {
        initializeCheckmarkButton();
    }
    if (typeof initializeRatingPicker === 'function') {
        initializeRatingPicker();
    }
    if (typeof initializeCheckmarkLabel === 'function') {
        initializeCheckmarkLabel();
    }
    if (typeof initializeOrderedList === 'function') {
        initializeOrderedList();
    }
    if (typeof initializeRadioSelectionList === 'function') {
        initializeRadioSelectionList();
    }
    if (typeof initializeCarousel === 'function') {
        initializeCarousel();
    }
});
