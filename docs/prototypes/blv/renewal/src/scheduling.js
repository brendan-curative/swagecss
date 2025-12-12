console.log('Clinical Scheduling page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Select appointment type
function selectAppointmentType(type) {
    window.dataManager.updateData('appointmentType', type);
    
    // Update button states
    const virtualBtn = document.getElementById('appointment-virtual');
    const inPersonBtn = document.getElementById('appointment-inperson');
    
    if (virtualBtn && inPersonBtn) {
        virtualBtn.classList.remove('button--primary');
        virtualBtn.classList.add('button--small-outline');
        inPersonBtn.classList.remove('button--primary');
        inPersonBtn.classList.add('button--small-outline');
        
        if (type === 'virtual') {
            virtualBtn.classList.remove('button--small-outline');
            virtualBtn.classList.add('button--primary');
        } else if (type === 'in-person') {
            inPersonBtn.classList.remove('button--small-outline');
            inPersonBtn.classList.add('button--primary');
        }
    }
}

// Complete prototype
function completePrototype() {
    alert('Baseline Visit Prototype Complete!\n\nIn a real implementation, this would:\n- Schedule the clinical appointment\n- Send notifications to the Care Navigator\n- Redirect to a success page\n\nAll data has been saved to localStorage.');
}

// View saved data
function viewSavedData() {
    const data = localStorage.getItem('baselineVisitData');
    if (data) {
        console.log('Saved Data:', JSON.parse(data));
        alert('Saved data has been logged to the console. Open your browser\'s developer tools to view it.');
    } else {
        alert('No data has been saved yet.');
    }
}

// Reset prototype - now uses global function from layout
// (function is available globally as restartPrototype/resetPrototype)

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const appointmentType = window.dataManager.getData().appointmentType || '';

    if (appointmentType) {
        selectAppointmentType(appointmentType);
    }

    // Resource list population is handled automatically by Resources component
    // (src/components/blv/resources.js) for elements with data-resource-action="display"

    // Initialize interactive confetti button
    const interactiveButton = document.getElementById('interactive-confetti');
    if (interactiveButton && typeof createInteractiveConfetti === 'function') {
        createInteractiveConfetti(interactiveButton);
    }
});

