console.log('Procedures page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Helper function to update procedure data
function updateProcedureData(procedureKey, checked) {
    const data = window.dataManager.getData();
    if (!data.procedures) {
        data.procedures = {
            major: false,
            outpatient: false,
            diagnostic: false,
            preventive: false,
            other: false,
            none: false
        };
    }
    data.procedures[procedureKey] = checked;
    window.dataManager.saveData(data);
}

// Handle radio button changes (Yes/No for procedures planned)
function handleRadioChange() {
    const yesRadio = document.getElementById('procedures-yes');
    const noRadio = document.getElementById('procedures-no');
    const upcomingProceduresSection = document.querySelector('.upcoming-procedures');

    if (yesRadio && yesRadio.checked) {
        // User selected "Yes" - show the procedures list with fade-in
        window.dataManager.updateData('proceduresPlanned',true);
        if (upcomingProceduresSection) {
            upcomingProceduresSection.classList.remove('fade-out');
            upcomingProceduresSection.classList.add('fade-in');
        }
    } else if (noRadio && noRadio.checked) {
        // User selected "No" - hide the procedures list with fade-out and clear selections
        window.dataManager.updateData('proceduresPlanned',false);
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
            updateProcedureData(procedureKey, false);
        }
    });
    // Also clear "other" text
    const otherText = document.getElementById('procedure-other-text');
    if (otherText) {
        otherText.value = '';
        window.dataManager.updateData('otherText','');
    }
    // Hide "other" text input with fade
    const otherInput = document.getElementById('procedure-other-input');
    if (otherInput) {
        otherInput.classList.remove('fade-in');
        otherInput.classList.add('fade-out');
    }
}

// Handle checkbox changes
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const procedureKey = checkbox.id.replace('surgery-', '').replace('procedure-', '');
    updateProcedureData(procedureKey, checkbox.checked);

    // Handle "other" checkbox specially
    if (checkbox.id === 'procedure-other') {
        handleOtherCheckbox(checkbox.checked);
    }
}

// Handle "other" checkbox - show/hide text input with fade animation
function handleOtherCheckbox(isChecked) {
    const otherInput = document.getElementById('procedure-other-input');
    const otherText = document.getElementById('procedure-other-text');

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
            window.dataManager.updateData('otherText','');
        }
    }
}

// Handle "other" text input changes
function handleOtherTextChange(event) {
    window.dataManager.updateData('otherText',event.target.value);
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
    if (majorEl) updateProcedureData('major', majorEl.checked);
    if (outpatientEl) updateProcedureData('outpatient', outpatientEl.checked);
    if (diagnosticEl) updateProcedureData('diagnostic', diagnosticEl.checked);
    if (preventiveEl) updateProcedureData('preventive', preventiveEl.checked);
    if (noneEl) updateProcedureData('none', noneEl.checked);

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
            updateProcedureData('major', false);
        }
        if (outpatientEl) {
            outpatientEl.checked = false;
            updateProcedureData('outpatient', false);
        }
        if (diagnosticEl) {
            diagnosticEl.checked = false;
            updateProcedureData('diagnostic', false);
        }
        if (preventiveEl) {
            preventiveEl.checked = false;
            updateProcedureData('preventive', false);
        }
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const procedures = window.dataManager.getData().procedures;
    const radioSelection = window.dataManager.getData().proceduresPlanned;
    const otherText = window.dataManager.getData().otherText;

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
    if (otherInputDiv) {
        if (procedures.other) {
            otherInputDiv.classList.add('fade-in');
            otherInputDiv.classList.remove('fade-out');
        } else {
            otherInputDiv.classList.add('fade-out');
            otherInputDiv.classList.remove('fade-in');
        }
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

