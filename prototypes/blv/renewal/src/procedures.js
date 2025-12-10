console.log('Procedures page JavaScript loaded - v1.0');

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
            proceduresPlanned: null, // null = not answered, true = yes, false = no
            procedures: {
                major: false,
                outpatient: false,
                diagnostic: false,
                preventive: false,
                other: false,
                none: false
            },
            otherText: '' // Free text for "other" option
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getProcedures() {
        return this.data.procedures || {
            major: false,
            outpatient: false,
            diagnostic: false,
            preventive: false,
            other: false,
            none: false
        };
    }

    updateProcedure(id, checked) {
        if (!this.data.procedures) {
            this.data.procedures = {
                major: false,
                outpatient: false,
                diagnostic: false,
                preventive: false,
                other: false,
                none: false
            };
        }
        this.data.procedures[id] = checked;
        this.saveData();
    }

    updateRadioSelection(value) {
        this.data.proceduresPlanned = value;
        this.saveData();
    }

    updateOtherText(text) {
        this.data.otherText = text;
        this.saveData();
    }

    getRadioSelection() {
        return this.data.proceduresPlanned;
    }

    getOtherText() {
        return this.data.otherText || '';
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Handle radio button changes (Yes/No for procedures planned)
function handleRadioChange() {
    const yesRadio = document.getElementById('procedures-yes');
    const noRadio = document.getElementById('procedures-no');
    const upcomingProceduresSection = document.querySelector('.upcoming-procedures');

    if (yesRadio && yesRadio.checked) {
        // User selected "Yes" - show the procedures list with fade-in
        prototype.updateRadioSelection(true);
        if (upcomingProceduresSection) {
            upcomingProceduresSection.classList.remove('fade-out');
            upcomingProceduresSection.classList.add('fade-in');
        }
    } else if (noRadio && noRadio.checked) {
        // User selected "No" - hide the procedures list with fade-out and clear selections
        prototype.updateRadioSelection(false);
        if (upcomingProceduresSection) {
            upcomingProceduresSection.classList.remove('fade-in');
            upcomingProceduresSection.classList.add('fade-out');
        }
        // Clear all checkbox selections
        clearAllProcedures();
    }
}

// Clear all procedure selections
function clearAllProcedures() {
    const checkboxes = ['surgery-major', 'surgery-outpatient', 'procedure-diagnostic', 'procedure-preventive', 'procedure-other'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = false;
            const procedureKey = id.replace('surgery-', '').replace('procedure-', '');
            prototype.updateProcedure(procedureKey, false);
        }
    });
    // Also clear "other" text
    const otherText = document.getElementById('procedure-other-text');
    if (otherText) {
        otherText.value = '';
        prototype.updateOtherText('');
    }
    // Hide "other" text input
    const otherInput = document.getElementById('procedure-other-input');
    if (otherInput) {
        otherInput.style.display = 'none';
    }
}

// Handle checkbox changes
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const procedureKey = checkbox.id.replace('surgery-', '').replace('procedure-', '');
    prototype.updateProcedure(procedureKey, checkbox.checked);

    // Handle "other" checkbox specially
    if (checkbox.id === 'procedure-other') {
        handleOtherCheckbox(checkbox.checked);
    }
}

// Handle "other" checkbox - show/hide text input
function handleOtherCheckbox(isChecked) {
    const otherInput = document.getElementById('procedure-other-input');
    const otherText = document.getElementById('procedure-other-text');

    if (isChecked) {
        if (otherInput) {
            otherInput.style.display = 'block';
        }
        if (otherText) {
            otherText.focus();
        }
    } else {
        if (otherInput) {
            otherInput.style.display = 'none';
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

// Toggle preparation info based on selections (for procedures.html compatibility)
function togglePreparationInfo() {
    const majorEl = document.getElementById('surgery-major');
    const outpatientEl = document.getElementById('surgery-outpatient');
    const diagnosticEl = document.getElementById('procedure-diagnostic');
    const preventiveEl = document.getElementById('procedure-preventive');
    const noneEl = document.getElementById('none-planned');
    const preparationInfo = document.getElementById('preparation-info');

    // Save states
    if (majorEl) prototype.updateProcedure('major', majorEl.checked);
    if (outpatientEl) prototype.updateProcedure('outpatient', outpatientEl.checked);
    if (diagnosticEl) prototype.updateProcedure('diagnostic', diagnosticEl.checked);
    if (preventiveEl) prototype.updateProcedure('preventive', preventiveEl.checked);
    if (noneEl) prototype.updateProcedure('none', noneEl.checked);

    // Check if any procedure is selected (excluding "none planned")
    const anySelected = (majorEl && majorEl.checked) ||
                       (outpatientEl && outpatientEl.checked) ||
                       (diagnosticEl && diagnosticEl.checked) ||
                       (preventiveEl && preventiveEl.checked);

    // Show/hide preparation info based on selections
    if (anySelected && noneEl && !noneEl.checked) {
        if (preparationInfo) preparationInfo.style.display = 'block';
    } else {
        if (preparationInfo) preparationInfo.style.display = 'none';
    }

    // If "none planned" is checked, uncheck all others
    if (noneEl && noneEl.checked) {
        if (majorEl) {
            majorEl.checked = false;
            prototype.updateProcedure('major', false);
        }
        if (outpatientEl) {
            outpatientEl.checked = false;
            prototype.updateProcedure('outpatient', false);
        }
        if (diagnosticEl) {
            diagnosticEl.checked = false;
            prototype.updateProcedure('diagnostic', false);
        }
        if (preventiveEl) {
            preventiveEl.checked = false;
            prototype.updateProcedure('preventive', false);
        }
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const procedures = prototype.getProcedures();
    const radioSelection = prototype.getRadioSelection();
    const otherText = prototype.getOtherText();

    // Get elements
    const yesRadio = document.getElementById('procedures-yes');
    const noRadio = document.getElementById('procedures-no');
    const upcomingProceduresSection = document.querySelector('.upcoming-procedures');
    const majorEl = document.getElementById('surgery-major');
    const outpatientEl = document.getElementById('surgery-outpatient');
    const diagnosticEl = document.getElementById('procedure-diagnostic');
    const preventiveEl = document.getElementById('procedure-preventive');
    const otherEl = document.getElementById('procedure-other');
    const noneEl = document.getElementById('none-planned');
    const otherTextInput = document.getElementById('procedure-other-text');
    const otherInputDiv = document.getElementById('procedure-other-input');

    // Restore radio button state
    if (radioSelection === true && yesRadio) {
        yesRadio.checked = true;
        if (upcomingProceduresSection) {
            upcomingProceduresSection.classList.add('fade-in');
            upcomingProceduresSection.classList.remove('fade-out');
        }
    } else if (radioSelection === false && noRadio) {
        noRadio.checked = true;
        if (upcomingProceduresSection) {
            upcomingProceduresSection.classList.add('fade-out');
            upcomingProceduresSection.classList.remove('fade-in');
        }
    } else {
        // No selection made yet - hide the procedures section
        if (upcomingProceduresSection) {
            upcomingProceduresSection.classList.add('fade-out');
            upcomingProceduresSection.classList.remove('fade-in');
        }
    }

    // Restore checkbox states
    if (majorEl) majorEl.checked = procedures.major;
    if (outpatientEl) outpatientEl.checked = procedures.outpatient;
    if (diagnosticEl) diagnosticEl.checked = procedures.diagnostic;
    if (preventiveEl) preventiveEl.checked = procedures.preventive;
    if (otherEl) otherEl.checked = procedures.other;
    if (noneEl) noneEl.checked = procedures.none;

    // Restore "other" text and visibility
    if (otherTextInput && otherText) {
        otherTextInput.value = otherText;
    }
    if (otherInputDiv && procedures.other) {
        otherInputDiv.style.display = 'block';
    }

    // Add event listeners to radio buttons
    if (yesRadio) {
        yesRadio.addEventListener('change', handleRadioChange);
    }
    if (noRadio) {
        noRadio.addEventListener('change', handleRadioChange);
    }

    // Add event listeners to checkboxes
    const checkboxes = [majorEl, outpatientEl, diagnosticEl, preventiveEl, otherEl];
    checkboxes.forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', handleCheckboxChange);
        }
    });

    // Add event listener to "other" text input
    if (otherTextInput) {
        otherTextInput.addEventListener('input', handleOtherTextChange);
    }

    // Show preparation info if needed (for procedures.html compatibility)
    if (typeof togglePreparationInfo === 'function') {
        togglePreparationInfo();
    }
});

