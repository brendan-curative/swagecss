console.log('Support page JavaScript loaded - v1.0');

// Data persistence using localStorage
class BaselineVisitPrototype {
    constructor() {
        this.storageKey = 'baselineVisitData';
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : this.getDefaultData();
    }

    getDefaultData() {
        return {
            support: {
                metabolic: {
                    bloodPressure: false,
                    diabetes: false,
                    heartDisease: false
                },
                respiratory: {
                    asthma: false,
                    copd: false
                },
                behavioral: {
                    weightManagement: false,
                    substanceUse: false,
                    mentalHealth: false
                },
                specialized: {
                    pregnancy: false,
                    cancerScreening: false
                },
                other: false,
                otherText: ''
            }
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getSupport() {
        return this.data.support || this.getDefaultData().support;
    }

    updateSupport(category, field, checked) {
        if (!this.data.support) {
            this.data.support = this.getDefaultData().support;
        }

        if (category === 'other') {
            // 'other' is a flat boolean, not nested
            this.data.support.other = checked;
        } else {
            // Other categories are nested objects
            if (!this.data.support[category]) {
                this.data.support[category] = {};
            }
            this.data.support[category][field] = checked;
        }

        this.saveData();
    }

    updateOtherText(text) {
        if (!this.data.support) {
            this.data.support = this.getDefaultData().support;
        }
        this.data.support.otherText = text;
        this.saveData();
    }

    getOtherText() {
        return this.data.support?.otherText || '';
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

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
            prototype.updateSupport('other', null, checkbox.checked);
            handleOtherCheckbox(checkbox.checked);
        } else {
            prototype.updateSupport(mapping.category, mapping.field, checkbox.checked);
        }
    }
}

// Handle "other" checkbox - show/hide text input with fade animation
function handleOtherCheckbox(isChecked) {
    const otherInput = document.getElementById('other-input');
    const otherText = document.getElementById('other-text');

    if (isChecked) {
        if (otherInput) {
            otherInput.classList.remove('fade-out');
            otherInput.classList.add('fade-in');
        }
        // Focus after animation starts
        if (otherText) {
            setTimeout(() => otherText.focus(), 100);
        }
    } else {
        if (otherInput) {
            otherInput.classList.remove('fade-in');
            otherInput.classList.add('fade-out');
        }
        if (otherText) {
            otherText.value = '';
            prototype.updateOtherText('');
        }
    }
}

// Handle "other" text input changes
function handleOtherTextChange(event) {
    prototype.updateOtherText(event.target.value);
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const support = prototype.getSupport();

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

    // Restore "other" text and visibility
    const otherText = prototype.getOtherText();
    const otherTextInput = document.getElementById('other-text');
    const otherInputDiv = document.getElementById('other-input');

    if (otherTextInput && otherText) {
        otherTextInput.value = otherText;
    }

    if (otherInputDiv) {
        if (support.other) {
            otherInputDiv.classList.add('fade-in');
            otherInputDiv.classList.remove('fade-out');
        } else {
            otherInputDiv.classList.add('fade-out');
            otherInputDiv.classList.remove('fade-in');
        }
    }

    // Add event listener to "other" text input
    if (otherTextInput) {
        otherTextInput.addEventListener('input', handleOtherTextChange);
    }
});
