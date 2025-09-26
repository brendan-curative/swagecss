// Checkmark Button Component JavaScript

/**
 * Initialize checkmark button functionality
 */
function initializeCheckmarkButton() {
    console.log('Checkmark Button component initialized');
    
    // Set up ARIA attributes for all checkmark buttons
    const checkmarkButtons = document.querySelectorAll('.checkmark-button');
    checkmarkButtons.forEach(button => {
        // Add ARIA attributes for accessibility
        updateAriaAttributes(button);
        
        // Add keyboard event handling
        button.addEventListener('keydown', handleCheckmarkButtonKeydown);
        
        // Add click event handling for buttons without onclick
        if (!button.hasAttribute('onclick')) {
            button.addEventListener('click', () => toggleCheckmarkButton(button));
        }
    });
}

/**
 * Toggle the checked state of a checkmark button
 * @param {HTMLElement} button - The button element to toggle
 */
function toggleCheckmarkButton(button) {
    if (button.disabled) return;
    
    const isCurrentlyChecked = button.dataset.checked === 'true';
    const newCheckedState = !isCurrentlyChecked;
    
    setCheckmarkButtonState(button, newCheckedState);
    
    // Dispatch custom event
    const event = new CustomEvent('checkmarkButtonToggle', {
        detail: {
            button: button,
            checked: newCheckedState,
            value: button.dataset.value || button.querySelector('.checkmark-button__text')?.textContent
        }
    });
    button.dispatchEvent(event);
}

/**
 * Set the checked state of a checkmark button
 * @param {HTMLElement} button - The button element
 * @param {boolean} checked - Whether the button should be checked
 */
function setCheckmarkButtonState(button, checked) {
    // Update data attribute
    button.dataset.checked = checked.toString();
    
    // Update CSS class
    if (checked) {
        button.classList.add('checkmark-button--checked');
    } else {
        button.classList.remove('checkmark-button--checked');
    }
    
    // Update icon
    updateCheckmarkIcon(button, checked);
    
    // Update ARIA attributes
    updateAriaAttributes(button);
}

/**
 * Update the checkmark icon based on checked state
 * @param {HTMLElement} button - The button element
 * @param {boolean} checked - Whether the button is checked
 */
function updateCheckmarkIcon(button, checked) {
    const svg = button.querySelector('.checkmark-button__icon');
    if (!svg) return;
    
    const circle = svg.querySelector('circle');
    const checkPath = svg.querySelector('path');
    
    if (checked) {
        // Show filled circle with checkmark
        if (circle) {
            circle.setAttribute('fill', 'currentColor');
            circle.removeAttribute('stroke');
            circle.removeAttribute('stroke-width');
        }
        
        // Add checkmark path if it doesn't exist
        if (!checkPath) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M13.9226 8.61029C14.248 8.93573 14.248 9.46336 13.9226 9.7888L10.5893 13.1221C10.2638 13.4476 9.73618 13.4476 9.41074 13.1221L7.74408 11.4555C7.41864 11.13 7.41864 10.6024 7.74408 10.277C8.06951 9.95152 8.59715 9.95152 8.92259 10.277L10 11.3544L12.7441 8.61029C13.0695 8.28485 13.5972 8.28485 13.9226 8.61029Z');
            path.setAttribute('fill', 'white');
            svg.appendChild(path);
        } else {
            checkPath.setAttribute('fill', 'white');
        }
    } else {
        // Show outline circle without checkmark
        if (circle) {
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', 'currentColor');
            circle.setAttribute('stroke-width', '2');
        }
        
        // Remove checkmark path
        if (checkPath) {
            checkPath.remove();
        }
    }
}

/**
 * Update ARIA attributes for accessibility
 * @param {HTMLElement} button - The button element
 */
function updateAriaAttributes(button) {
    const isChecked = button.dataset.checked === 'true';
    
    button.setAttribute('aria-pressed', isChecked.toString());
    button.setAttribute('role', 'button');
    
    // Add aria-label if not present
    if (!button.hasAttribute('aria-label')) {
        const text = button.querySelector('.checkmark-button__text')?.textContent;
        if (text) {
            button.setAttribute('aria-label', text);
        }
    }
}

/**
 * Handle keyboard events for checkmark buttons
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleCheckmarkButtonKeydown(event) {
    // Handle Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCheckmarkButton(event.target);
    }
}

/**
 * Toggle single select mode (radio button behavior)
 * @param {HTMLElement} button - The clicked button
 */
function toggleSingleSelect(button) {
    if (button.disabled) return;
    
    const group = button.dataset.group;
    if (!group) {
        toggleCheckmarkButton(button);
        return;
    }
    
    // Uncheck all buttons in the same group
    const groupButtons = document.querySelectorAll(`[data-group="${group}"]`);
    groupButtons.forEach(groupButton => {
        setCheckmarkButtonState(groupButton, false);
    });
    
    // Check the clicked button
    setCheckmarkButtonState(button, true);
    
    // Dispatch custom event for single select
    const event = new CustomEvent('checkmarkButtonSingleSelect', {
        detail: {
            button: button,
            group: group,
            value: button.dataset.value || button.querySelector('.checkmark-button__text')?.textContent
        }
    });
    button.dispatchEvent(event);
}

/**
 * Toggle form option (used in form contexts)
 * @param {HTMLElement} button - The clicked button
 */
function toggleFormOption(button) {
    if (button.disabled) return;
    
    const name = button.dataset.name;
    if (!name) {
        toggleCheckmarkButton(button);
        return;
    }
    
    // For single-select form options, uncheck others with same name
    const sameNameButtons = document.querySelectorAll(`[data-name="${name}"]`);
    sameNameButtons.forEach(sameNameButton => {
        if (sameNameButton !== button) {
            setCheckmarkButtonState(sameNameButton, false);
        }
    });
    
    // Check the clicked button
    setCheckmarkButtonState(button, true);
    
    // Update hidden form input if it exists
    updateFormInput(name, button.dataset.value);
    
    // Dispatch form option event
    const event = new CustomEvent('checkmarkButtonFormOption', {
        detail: {
            button: button,
            name: name,
            value: button.dataset.value || button.querySelector('.checkmark-button__text')?.textContent
        }
    });
    button.dispatchEvent(event);
}

/**
 * Update hidden form input with selected value
 * @param {string} name - The input name
 * @param {string} value - The selected value
 */
function updateFormInput(name, value) {
    let input = document.querySelector(`input[name="${name}"]`);
    
    if (!input) {
        // Create hidden input if it doesn't exist
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        
        // Find the form and append the input
        const form = document.querySelector('form');
        if (form) {
            form.appendChild(input);
        }
    }
    
    input.value = value || '';
}

/**
 * Handle form submission
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const statusDiv = document.getElementById('form-status');
    
    if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Form submitted with: ' + Array.from(formData.entries()).map(([key, value]) => `${key}: ${value}`).join(', ');
        statusDiv.className = 'mt-16 text-sm text-green-600';
    }
    
    console.log('Form data:', Object.fromEntries(formData));
}

/**
 * Reset form and all checkmark buttons
 */
function resetForm() {
    const form = document.querySelector('form');
    if (form) {
        form.reset();
        
        // Reset all checkmark buttons in the form
        const checkmarkButtons = form.querySelectorAll('.checkmark-button');
        checkmarkButtons.forEach(button => {
            setCheckmarkButtonState(button, false);
        });
        
        // Hide status message
        const statusDiv = document.getElementById('form-status');
        if (statusDiv) {
            statusDiv.style.display = 'none';
        }
    }
}

/**
 * Get all checked values from checkmark buttons with a specific name
 * @param {string} name - The name attribute to filter by
 * @returns {Array<string>} Array of checked values
 */
function getCheckedValues(name) {
    const buttons = document.querySelectorAll(`[data-name="${name}"]`);
    return Array.from(buttons)
        .filter(button => button.dataset.checked === 'true')
        .map(button => button.dataset.value || button.querySelector('.checkmark-button__text')?.textContent);
}

/**
 * Set validation state for checkmark buttons
 * @param {HTMLElement|string} target - Button element or selector
 * @param {string} state - Validation state: 'error', 'success', 'warning', or 'default'
 */
function setCheckmarkButtonValidation(target, state) {
    const button = typeof target === 'string' ? document.querySelector(target) : target;
    if (!button) return;
    
    // Remove existing validation classes
    button.classList.remove('checkmark-button--error', 'checkmark-button--success', 'checkmark-button--warning');
    
    // Add new validation class
    if (state !== 'default') {
        button.classList.add(`checkmark-button--${state}`);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckmarkButton);
} else {
    initializeCheckmarkButton();
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.CheckmarkButton = {
        toggle: toggleCheckmarkButton,
        setState: setCheckmarkButtonState,
        getCheckedValues: getCheckedValues,
        setValidation: setCheckmarkButtonValidation,
        toggleSingleSelect,
        toggleFormOption,
        handleFormSubmit,
        resetForm
    };
}
