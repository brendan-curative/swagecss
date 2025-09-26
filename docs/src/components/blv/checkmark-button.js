// Checkmark Button Component JavaScript - Replicating BaselineVisitCheckMarkButton behavior

/**
 * Initialize checkmark button functionality
 */
function initializeCheckmarkButton() {
    console.log('Checkmark Button component initialized');
    
    // Basic initialization for demo purposes
    const checkmarkButtons = document.querySelectorAll('.checkmark-button');
    checkmarkButtons.forEach(button => {
        updateAriaAttributes(button);
    });
}

/**
 * Toggle the checked state of a checkmark button - Basic demo functionality
 * @param {HTMLElement} button - The button element to toggle
 */
function toggleCheckmarkButton(button) {
    const isCurrentlyChecked = button.dataset.checked === 'true';
    const newCheckedState = !isCurrentlyChecked;
    
    setCheckmarkButtonState(button, newCheckedState);
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
}


// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckmarkButton);
} else {
    initializeCheckmarkButton();
}

