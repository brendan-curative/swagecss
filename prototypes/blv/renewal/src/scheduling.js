console.log('Clinical Scheduling page JavaScript loaded - v1.0');

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
            appointmentType: ''
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getAppointmentType() {
        return this.data.appointmentType || '';
    }

    setAppointmentType(type) {
        this.data.appointmentType = type;
        this.saveData();
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Select appointment type
function selectAppointmentType(type) {
    prototype.setAppointmentType(type);
    
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
    const appointmentType = prototype.getAppointmentType();
    
    if (appointmentType) {
        selectAppointmentType(appointmentType);
    }
});

