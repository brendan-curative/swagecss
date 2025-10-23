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
            procedures: {
                major: false,
                outpatient: false,
                diagnostic: false,
                preventive: false,
                none: false
            }
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
                none: false
            };
        }
        this.data.procedures[id] = checked;
        this.saveData();
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Toggle preparation info based on selections
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
        preparationInfo.style.display = 'block';
    } else {
        preparationInfo.style.display = 'none';
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
    
    const majorEl = document.getElementById('surgery-major');
    const outpatientEl = document.getElementById('surgery-outpatient');
    const diagnosticEl = document.getElementById('procedure-diagnostic');
    const preventiveEl = document.getElementById('procedure-preventive');
    const noneEl = document.getElementById('none-planned');
    
    if (majorEl) majorEl.checked = procedures.major;
    if (outpatientEl) outpatientEl.checked = procedures.outpatient;
    if (diagnosticEl) diagnosticEl.checked = procedures.diagnostic;
    if (preventiveEl) preventiveEl.checked = procedures.preventive;
    if (noneEl) noneEl.checked = procedures.none;
    
    // Show preparation info if needed
    togglePreparationInfo();
});

