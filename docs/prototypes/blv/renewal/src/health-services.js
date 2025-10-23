console.log('Health Services page JavaScript loaded - v1.1 - Fixed healthServices initialization');

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
            healthServices: [
                { id: 'specialist', name: 'Saw a specialist', date: '2024-03-15' },
                { id: 'physical', name: 'Had a routine physical', date: '2023-11-22' },
                { id: 'telemedicine', name: 'Had a telemedicine appointment', date: '' },
                { id: 'outpatient', name: 'Received an out-patient (does not require hospitalization) procedure', date: '2024-01-08' },
                { id: 'inpatient', name: 'Received an in-patient (hospitalization is required) procedure', date: '' },
                { id: 'diagnostic', name: 'Had a diagnostic test (blood work) performed', date: '2024-02-14' },
                { id: 'emergency', name: 'Visited the emergency room/ urgent care facility', date: '' },
                { id: 'hospital', name: 'Admitted to the hospital for other health concerns', date: '' },
                { id: 'mental-health', name: 'Sought mental health care', date: '2023-09-10' }
            ]
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getHealthServices() {
        // Initialize healthServices if it doesn't exist
        if (!this.data.healthServices) {
            this.data.healthServices = this.getDefaultData().healthServices;
            this.saveData();
        }
        return this.data.healthServices;
    }

    updateService(id, date) {
        const service = this.data.healthServices.find(s => s.id === id);
        if (service) {
            service.date = date;
            this.saveData();
        }
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Render health services list
function renderHealthServices() {
    const container = document.getElementById('health-services-list');
    if (!container) {
        console.error('Container #health-services-list not found');
        return;
    }
    
    const services = prototype.getHealthServices();
    console.log('Rendering health services:', services.length, 'services');
    container.innerHTML = '';
    
    services.forEach(service => {
        const serviceHTML = `
            <div class="card p-16 mb-16">
                <div class="flex-row flex-justify-between flex-items-center">
                    <h5 class="text-md font-semibold flex-1">${service.name}</h5>
                    <input 
                        type="date" 
                        id="service-${service.id}"
                        value="${service.date}" 
                        onchange="updateService('${service.id}', this.value)"
                        class="textfield__input"
                        style="width: 160px;"
                    >
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', serviceHTML);
    });
}

// Update service data
function updateService(id, value) {
    prototype.updateService(id, value);
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    renderHealthServices();
});

