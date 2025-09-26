// Radio Selection List Component JavaScript - Replicating RadioSelectionList behavior

/**
 * Initialize radio selection list functionality
 */
function initializeRadioSelectionList() {
    console.log('Radio Selection List component initialized');
    
    // Basic initialization for demo purposes
    const radioSelectionLists = document.querySelectorAll('.radio-selection-list');
    radioSelectionLists.forEach(list => {
        setupRadioSelectionList(list);
    });
}

/**
 * Set up individual radio selection list
 * @param {HTMLElement} list - The radio selection list container
 */
function setupRadioSelectionList(list) {
    // Add ARIA attributes for accessibility
    list.setAttribute('role', 'radiogroup');
    
    const radios = list.querySelectorAll('.radio-selection-list__radio');
    radios.forEach((radio, index) => {
        radio.setAttribute('tabindex', index === 0 ? '0' : '-1');
        
        // Add keyboard support
        radio.addEventListener('keydown', handleRadioSelectionKeydown);
        radio.addEventListener('change', handleRadioSelectionChange);
    });
    
    // Update results count
    updateResultsCount(list);
}

/**
 * Handle radio selection change - replicating toggle behavior from original
 * @param {Event} event - The change event
 */
function handleRadioChange(radio) {
    const list = radio.closest('.radio-selection-list');
    const name = radio.name;
    const value = radio.value;
    
    // Get all radios in the same group
    const allRadios = document.querySelectorAll(`input[name="${name}"]`);
    
    // Check if this radio was already selected (toggle behavior)
    const wasSelected = radio.dataset.wasSelected === 'true';
    
    if (wasSelected) {
        // Uncheck if clicking the same radio (toggle off)
        radio.checked = false;
        radio.dataset.wasSelected = 'false';
        
        // Update tabindex
        allRadios.forEach(r => r.setAttribute('tabindex', '-1'));
        radio.setAttribute('tabindex', '0');
        
        // Dispatch custom event
        const event = new CustomEvent('radioSelectionChange', {
            detail: {
                name: name,
                value: null,
                previousValue: value,
                list: list
            },
            bubbles: true
        });
        list.dispatchEvent(event);
    } else {
        // Clear all selections first
        allRadios.forEach(r => {
            r.dataset.wasSelected = 'false';
            r.setAttribute('tabindex', '-1');
        });
        
        // Set this radio as selected
        radio.checked = true;
        radio.dataset.wasSelected = 'true';
        radio.setAttribute('tabindex', '0');
        
        // Handle special "none" option behavior
        if (value === 'none') {
            handleNoneSelection(list);
        } else {
            clearNoneSelection(list);
        }
        
        // Dispatch custom event
        const event = new CustomEvent('radioSelectionChange', {
            detail: {
                name: name,
                value: value,
                previousValue: null,
                list: list
            },
            bubbles: true
        });
        list.dispatchEvent(event);
    }
}

/**
 * Handle keyboard navigation for radio selection
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleRadioSelectionKeydown(event) {
    const list = event.target.closest('.radio-selection-list');
    const radios = Array.from(list.querySelectorAll('.radio-selection-list__radio'));
    const currentIndex = radios.indexOf(event.target);
    
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1;
            focusRadio(radios[prevIndex], radios);
            break;
            
        case 'ArrowDown':
        case 'ArrowRight':
            event.preventDefault();
            const nextIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0;
            focusRadio(radios[nextIndex], radios);
            break;
            
        case 'Home':
            event.preventDefault();
            focusRadio(radios[0], radios);
            break;
            
        case 'End':
            event.preventDefault();
            focusRadio(radios[radios.length - 1], radios);
            break;
            
        case ' ':
        case 'Enter':
            event.preventDefault();
            handleRadioChange(event.target);
            break;
    }
}

/**
 * Focus a radio button and update tabindex
 * @param {HTMLElement} radio - The radio to focus
 * @param {Array} allRadios - All radios in the group
 */
function focusRadio(radio, allRadios) {
    allRadios.forEach(r => r.setAttribute('tabindex', '-1'));
    radio.setAttribute('tabindex', '0');
    radio.focus();
}

/**
 * Handle "none" option selection - adds blur overlay
 * @param {HTMLElement} list - The radio selection list
 */
function handleNoneSelection(list) {
    const container = list.querySelector('.radio-selection-list__container');
    const options = list.querySelector('.radio-selection-list__options');
    
    if (container && options && !container.querySelector('.radio-selection-list__null-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'radio-selection-list__null-overlay';
        overlay.innerHTML = '<p>You selected "None of these work for me"</p>';
        container.appendChild(overlay);
    }
}

/**
 * Clear "none" selection overlay
 * @param {HTMLElement} list - The radio selection list
 */
function clearNoneSelection(list) {
    const overlay = list.querySelector('.radio-selection-list__null-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Update results count in header
 * @param {HTMLElement} list - The radio selection list
 */
function updateResultsCount(list) {
    const resultsElement = list.querySelector('.radio-selection-list__results');
    const options = list.querySelectorAll('.radio-selection-list__option:not(.radio-selection-list__missing-option .radio-selection-list__option)');
    
    if (resultsElement) {
        const count = options.length;
        resultsElement.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
    }
}

/**
 * Add an option to the radio selection list
 * @param {HTMLElement|string} target - List element or selector
 * @param {Object} optionData - Option data {value, title, description}
 */
function addRadioSelectionOption(target, optionData) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    const fieldset = list.querySelector('.radio-selection-list__fieldset');
    if (!fieldset) return;
    
    const name = list.getAttribute('data-name') || 'radio-options';
    
    const label = document.createElement('label');
    label.className = 'radio-selection-list__option';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = name;
    radio.value = optionData.value;
    radio.className = 'radio-selection-list__radio';
    radio.addEventListener('change', () => handleRadioChange(radio));
    radio.addEventListener('keydown', handleRadioSelectionKeydown);
    
    const content = document.createElement('div');
    content.className = 'radio-selection-list__content';
    
    if (optionData.title) {
        const title = document.createElement('h3');
        title.className = 'radio-selection-list__title';
        title.textContent = optionData.title;
        content.appendChild(title);
    }
    
    if (optionData.description) {
        const description = document.createElement('p');
        description.className = 'radio-selection-list__description';
        description.textContent = optionData.description;
        content.appendChild(description);
    }
    
    if (!optionData.title && !optionData.description) {
        const span = document.createElement('span');
        span.className = 'radio-selection-list__label';
        span.textContent = optionData.value;
        content.appendChild(span);
    }
    
    label.appendChild(radio);
    label.appendChild(content);
    fieldset.appendChild(label);
    
    // Update results count
    updateResultsCount(list);
}

/**
 * Remove an option from the radio selection list
 * @param {HTMLElement|string} target - List element or selector
 * @param {string} value - The value of the option to remove
 */
function removeRadioSelectionOption(target, value) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    const radio = list.querySelector(`input[value="${value}"]`);
    if (radio) {
        const option = radio.closest('.radio-selection-list__option');
        if (option) {
            option.remove();
            updateResultsCount(list);
        }
    }
}

/**
 * Clear all options from the radio selection list
 * @param {HTMLElement|string} target - List element or selector
 */
function clearRadioSelectionOptions(target) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    const fieldset = list.querySelector('.radio-selection-list__fieldset');
    if (fieldset) {
        fieldset.innerHTML = '';
        updateResultsCount(list);
    }
}

/**
 * Get the selected value from a radio selection list
 * @param {HTMLElement|string} target - List element or selector
 * @returns {string|null} The selected value or null
 */
function getSelectedRadioValue(target) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return null;
    
    const selectedRadio = list.querySelector('.radio-selection-list__radio:checked');
    return selectedRadio ? selectedRadio.value : null;
}

/**
 * Set the selected value in a radio selection list
 * @param {HTMLElement|string} target - List element or selector
 * @param {string} value - The value to select
 */
function setSelectedRadioValue(target, value) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    const radios = list.querySelectorAll('.radio-selection-list__radio');
    radios.forEach(radio => {
        radio.checked = radio.value === value;
        radio.dataset.wasSelected = radio.value === value ? 'true' : 'false';
        radio.setAttribute('tabindex', radio.value === value ? '0' : '-1');
    });
    
    // Handle special "none" behavior
    if (value === 'none') {
        handleNoneSelection(list);
    } else {
        clearNoneSelection(list);
    }
}

/**
 * Show loading state
 * @param {HTMLElement|string} target - List element or selector
 */
function showRadioSelectionLoading(target) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    list.classList.add('radio-selection-list--loading');
    list.innerHTML = `
        <div class="radio-selection-list__container">
            <div class="radio-selection-list__backdrop"></div>
            <div class="radio-selection-list__loading">
                <div class="radio-selection-list__spinner"></div>
            </div>
        </div>
    `;
}

/**
 * Show error state
 * @param {HTMLElement|string} target - List element or selector
 * @param {string} message - Error message
 */
function showRadioSelectionError(target, message = 'Something went wrong. Please try again later.') {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    list.classList.add('radio-selection-list--error');
    list.innerHTML = `
        <div class="radio-selection-list__container">
            <div class="radio-selection-list__backdrop"></div>
            <div class="radio-selection-list__error">
                <p>${message}</p>
            </div>
        </div>
    `;
}

/**
 * Demo function for map button
 */
function showMap() {
    alert('Map view would open here');
}

/**
 * Demo function for radio selection change handling
 */
function handleRadioSelectionChange(event) {
    console.log('Radio selection changed:', event.detail);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRadioSelectionList);
} else {
    initializeRadioSelectionList();
}

// Add event listener for demo
document.addEventListener('radioSelectionChange', handleRadioSelectionChange);
