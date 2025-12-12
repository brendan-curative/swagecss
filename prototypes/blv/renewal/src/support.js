console.log('Support page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Helper function to update support data
function updateSupportData(category, field, checked) {
    const data = window.dataManager.getData();
    if (!data.support) {
        data.support = window.dataManager.getDefaultData().support;
    }

    if (category === 'other') {
        // 'other' is a flat boolean, not nested
        data.support.other = checked;
    } else {
        // Other categories are nested objects
        if (!data.support[category]) {
            data.support[category] = {};
        }
        data.support[category][field] = checked;
    }

    window.dataManager.saveData(data);
}

// Handle checkbox changes
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const checkboxId = checkbox.id;

    // Map checkbox IDs to category and field
    const checkboxMap = {
        // Metabolic and Cardiovascular Conditions
        'blood-pressure': { category: 'metabolic', field: 'bloodPressure' },
        'diabetes': { category: 'metabolic', field: 'diabetes' },
        'heart-disease': { category: 'metabolic', field: 'heartDisease' },

        // Respiratory Conditions
        'asthma': { category: 'respiratory', field: 'asthma' },
        'copd': { category: 'respiratory', field: 'copd' },

        // Behavioral Health and Wellness
        'weight-management': { category: 'behavioral', field: 'weightManagement' },
        'substance-use': { category: 'behavioral', field: 'substanceUse' },
        'mental-health': { category: 'behavioral', field: 'mentalHealth' },

        // Specialized and Preventive Services
        'pregnancy': { category: 'specialized', field: 'pregnancy' },
        'cancer-screening': { category: 'specialized', field: 'cancerScreening' },

        // Other
        'other': { category: 'other', field: null }
    };

    const mapping = checkboxMap[checkboxId];
    if (mapping) {
        if (mapping.category === 'other') {
            updateSupportData('other', null, checkbox.checked);
        } else {
            updateSupportData(mapping.category, mapping.field, checkbox.checked);
        }
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const support = window.dataManager.getData().support;

    // Map of checkbox IDs to their data paths
    const checkboxes = {
        // Metabolic and Cardiovascular
        'blood-pressure': support.metabolic.bloodPressure,
        'diabetes': support.metabolic.diabetes,
        'heart-disease': support.metabolic.heartDisease,

        // Respiratory
        'asthma': support.respiratory.asthma,
        'copd': support.respiratory.copd,

        // Behavioral
        'weight-management': support.behavioral.weightManagement,
        'substance-use': support.behavioral.substanceUse,
        'mental-health': support.behavioral.mentalHealth,

        // Specialized
        'pregnancy': support.specialized.pregnancy,
        'cancer-screening': support.specialized.cancerScreening,

        // Other
        'other': support.other
    };

    // Restore checkbox states
    Object.keys(checkboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checkboxes[id];
            // Add event listener
            checkbox.addEventListener('change', handleCheckboxChange);
        }
    });
});
