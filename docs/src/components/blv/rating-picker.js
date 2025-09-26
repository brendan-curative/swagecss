// Rating Picker Component JavaScript - Replicating BaselineVisitRatingPicker behavior

/**
 * Initialize rating picker functionality
 */
function initializeRatingPicker() {
    console.log('Rating Picker component initialized');
    
    // Basic initialization for demo purposes
    const ratingPickers = document.querySelectorAll('.rating-picker');
    ratingPickers.forEach(picker => {
        setupRatingPicker(picker);
    });
}

/**
 * Set up individual rating picker
 * @param {HTMLElement} picker - The rating picker container
 */
function setupRatingPicker(picker) {
    const options = picker.querySelectorAll('.rating-picker__option');
    
    // Add ARIA attributes for accessibility
    picker.setAttribute('role', 'radiogroup');
    picker.setAttribute('aria-label', 'Rating selection');
    
    options.forEach((option, index) => {
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', 'false');
        option.setAttribute('tabindex', index === 0 ? '0' : '-1');
        
        // Add keyboard support
        option.addEventListener('keydown', handleRatingKeydown);
    });
}

/**
 * Select a rating option - replicating onRequestChangeValue behavior
 * @param {HTMLElement} selectedOption - The clicked option
 */
function selectRating(selectedOption) {
    const picker = selectedOption.closest('.rating-picker');
    const allOptions = picker.querySelectorAll('.rating-picker__option');
    const value = selectedOption.dataset.value;
    
    // Clear all selections
    allOptions.forEach(option => {
        option.classList.remove('rating-picker__option--selected');
        option.setAttribute('aria-checked', 'false');
        option.setAttribute('tabindex', '-1');
    });
    
    // Select the clicked option
    selectedOption.classList.add('rating-picker__option--selected');
    selectedOption.setAttribute('aria-checked', 'true');
    selectedOption.setAttribute('tabindex', '0');
    selectedOption.focus();
    
    // Add has-selection class to picker for opacity styling
    picker.classList.add('rating-picker--has-selection');
    
    // Update demo display if it exists
    const selectedDisplay = document.getElementById('selected-rating');
    if (selectedDisplay) {
        const labels = {
            'negative': 'I am confused',
            'neutral': 'I somewhat understand', 
            'positive': 'I completely understand'
        };
        selectedDisplay.textContent = labels[value] || value;
    }
    
    // Dispatch custom event for external handling
    const event = new CustomEvent('ratingChange', {
        detail: {
            value: value,
            picker: picker,
            option: selectedOption
        },
        bubbles: true
    });
    picker.dispatchEvent(event);
}

/**
 * Handle keyboard navigation for rating picker
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleRatingKeydown(event) {
    const picker = event.target.closest('.rating-picker');
    const options = Array.from(picker.querySelectorAll('.rating-picker__option'));
    const currentIndex = options.indexOf(event.target);
    
    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            focusOption(options[prevIndex]);
            break;
            
        case 'ArrowRight':
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
            focusOption(options[nextIndex]);
            break;
            
        case 'Enter':
        case ' ':
            event.preventDefault();
            selectRating(event.target);
            break;
    }
}

/**
 * Focus a rating option and update tabindex
 * @param {HTMLElement} option - The option to focus
 */
function focusOption(option) {
    const picker = option.closest('.rating-picker');
    const allOptions = picker.querySelectorAll('.rating-picker__option');
    
    // Update tabindex
    allOptions.forEach(opt => opt.setAttribute('tabindex', '-1'));
    option.setAttribute('tabindex', '0');
    option.focus();
}

/**
 * Get the current rating value from a picker
 * @param {HTMLElement|string} target - Picker element or selector
 * @returns {string|null} The selected rating value or null
 */
function getRatingValue(target) {
    const picker = typeof target === 'string' ? document.querySelector(target) : target;
    if (!picker) return null;
    
    const selectedOption = picker.querySelector('.rating-picker__option--selected');
    return selectedOption ? selectedOption.dataset.value : null;
}

/**
 * Set the rating value programmatically
 * @param {HTMLElement|string} target - Picker element or selector
 * @param {string} value - The rating value to set ('negative', 'neutral', 'positive')
 */
function setRatingValue(target, value) {
    const picker = typeof target === 'string' ? document.querySelector(target) : target;
    if (!picker) return;
    
    const option = picker.querySelector(`[data-value="${value}"]`);
    if (option) {
        selectRating(option);
    }
}

/**
 * Clear the rating selection
 * @param {HTMLElement|string} target - Picker element or selector
 */
function clearRating(target) {
    const picker = typeof target === 'string' ? document.querySelector(target) : target;
    if (!picker) return;
    
    const allOptions = picker.querySelectorAll('.rating-picker__option');
    allOptions.forEach((option, index) => {
        option.classList.remove('rating-picker__option--selected');
        option.setAttribute('aria-checked', 'false');
        option.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    
    picker.classList.remove('rating-picker--has-selection');
    
    // Update demo display if it exists
    const selectedDisplay = document.getElementById('selected-rating');
    if (selectedDisplay) {
        selectedDisplay.textContent = 'None';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRatingPicker);
} else {
    initializeRatingPicker();
}
