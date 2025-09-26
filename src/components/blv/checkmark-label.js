// Checkmark Label Component JavaScript - Replicating BaselineVisitCheckMarkLabel behavior

/**
 * Initialize checkmark label functionality
 */
function initializeCheckmarkLabel() {
    console.log('Checkmark Label component initialized');
    
    // Basic initialization for demo purposes
    const checkmarkLabels = document.querySelectorAll('.checkmark-label');
    checkmarkLabels.forEach(label => {
        setupCheckmarkLabel(label);
    });
}

/**
 * Set up individual checkmark label
 * @param {HTMLElement} label - The checkmark label container
 */
function setupCheckmarkLabel(label) {
    // Add ARIA attributes for accessibility
    label.setAttribute('role', 'status');
    label.setAttribute('aria-label', 'Completion status');
    
    const statusElement = label.querySelector('.checkmark-label__status');
    if (statusElement) {
        statusElement.setAttribute('aria-live', 'polite');
    }
}

/**
 * Create a checkmark label programmatically
 * @param {string} labelText - The main label text
 * @param {string} statusText - The status text (default: "Complete")
 * @returns {HTMLElement} The created checkmark label element
 */
function createCheckmarkLabel(labelText, statusText = 'Complete') {
    const labelContainer = document.createElement('div');
    labelContainer.className = 'checkmark-label';
    labelContainer.setAttribute('role', 'status');
    labelContainer.setAttribute('aria-label', 'Completion status');
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'checkmark-label__icon';
    
    // Create SVG icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('fill', 'none');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M10 3L4.5 8.5L2 6');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(path);
    iconContainer.appendChild(svg);
    
    // Create text container
    const textContainer = document.createElement('p');
    textContainer.className = 'checkmark-label__text';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'checkmark-label__label';
    labelSpan.textContent = labelText;
    
    const statusSpan = document.createElement('span');
    statusSpan.className = 'checkmark-label__status';
    statusSpan.textContent = statusText;
    statusSpan.setAttribute('aria-live', 'polite');
    
    textContainer.appendChild(labelSpan);
    textContainer.appendChild(document.createTextNode(': '));
    textContainer.appendChild(statusSpan);
    
    // Assemble the component
    labelContainer.appendChild(iconContainer);
    labelContainer.appendChild(textContainer);
    
    return labelContainer;
}

/**
 * Update the label text of an existing checkmark label
 * @param {HTMLElement|string} target - Label element or selector
 * @param {string} newLabelText - The new label text
 */
function updateCheckmarkLabelText(target, newLabelText) {
    const label = typeof target === 'string' ? document.querySelector(target) : target;
    if (!label) return;
    
    const labelElement = label.querySelector('.checkmark-label__label');
    if (labelElement) {
        labelElement.textContent = newLabelText;
    }
}

/**
 * Update the status text of an existing checkmark label
 * @param {HTMLElement|string} target - Label element or selector
 * @param {string} newStatusText - The new status text
 */
function updateCheckmarkStatus(target, newStatusText) {
    const label = typeof target === 'string' ? document.querySelector(target) : target;
    if (!label) return;
    
    const statusElement = label.querySelector('.checkmark-label__status');
    if (statusElement) {
        statusElement.textContent = newStatusText;
    }
}

/**
 * Demo function to update the dynamic label example
 */
function updateCheckmarkLabel() {
    const labels = [
        'Part 1 of your Baseline Visit',
        'Health Information Collection',
        'Provider Selection Process',
        'Appointment Scheduling',
        'Insurance Verification',
        'Medical History Review'
    ];
    
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    updateCheckmarkLabelText('#dynamic-label', randomLabel);
}

/**
 * Get the current label and status text from a checkmark label
 * @param {HTMLElement|string} target - Label element or selector
 * @returns {Object} Object with labelText and statusText properties
 */
function getCheckmarkLabelContent(target) {
    const label = typeof target === 'string' ? document.querySelector(target) : target;
    if (!label) return { labelText: null, statusText: null };
    
    const labelElement = label.querySelector('.checkmark-label__label');
    const statusElement = label.querySelector('.checkmark-label__status');
    
    return {
        labelText: labelElement ? labelElement.textContent : null,
        statusText: statusElement ? statusElement.textContent : null
    };
}

/**
 * Add a checkmark label to a container
 * @param {HTMLElement|string} container - Container element or selector
 * @param {string} labelText - The label text
 * @param {string} statusText - The status text (default: "Complete")
 */
function addCheckmarkLabel(container, labelText, statusText = 'Complete') {
    const containerElement = typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerElement) return;
    
    const label = createCheckmarkLabel(labelText, statusText);
    containerElement.appendChild(label);
    setupCheckmarkLabel(label);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckmarkLabel);
} else {
    initializeCheckmarkLabel();
}
