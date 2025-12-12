console.log('Health Services page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Helper functions to work with health services data
function getHealthServices() {
    const data = window.dataManager.getData();
    return data.healthServices || [];
}

function saveServiceData(id, date) {
    const data = window.dataManager.getData();
    const service = data.healthServices.find(s => s.id === id);
    if (service) {
        service.date = date;
        window.dataManager.saveData(data);
    }
}

// Render health services list
function renderHealthServices() {
    const container = document.getElementById('health-services-list');
    if (!container) {
        console.error('Container #health-services-list not found');
        return;
    }
    
    const services = getHealthServices();
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

// Update service data (called from HTML onchange)
function updateService(id, value) {
    saveServiceData(id, value);
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    renderHealthServices();
});

