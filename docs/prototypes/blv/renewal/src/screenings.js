console.log('Screenings page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Helper functions to work with screenings data
function getScreenings() {
    const data = window.dataManager.getData();
    return data.screenings || [];
}

function saveScreeningData(id, updates) {
    const data = window.dataManager.getData();
    const screening = data.screenings.find(s => s.id === id);
    if (screening) {
        Object.assign(screening, updates);
        window.dataManager.saveData(data);
    }
}

// Render screenings list
function renderScreenings() {
    const container = document.getElementById('screenings-list');
    const screenings = getScreenings();
    container.innerHTML = '';
    
    screenings.forEach(screening => {
        const borderClass = screening.isDue ? 'border-left border-4x' : '';
        const badgeHTML = screening.isDue ? 
            '<span class="bg-gray-600 text-white px-8 py-4 text-xs font-semibold" style="border-radius: 8px;">DUE</span>' : '';
        
        const placeholder = screening.lastCompleted ? screening.lastCompleted : 'Enter year';
        const marginBottom = screening.isDue ? 'mb-8' : 'mb-0';
        
        const screeningHTML = `
            <div class="card p-16 mb-16 ${borderClass}">
                <div class="flex-row flex-justify-between flex-align-start ${marginBottom}">
                    <h5 class="text-md font-semibold">${screening.name}</h5>
                    ${badgeHTML}
                </div>
                <div class="flex-row flex-items-center gap-16">
                    <span class="text-sm text-gray-600">Last completed:</span>
                    <div class="textfield">
                        <input 
                            type="text" 
                            id="screening-${screening.id}"
                            value="${screening.lastCompleted}" 
                            placeholder="${placeholder}"
                            onchange="updateScreening('${screening.id}', this.value)"
                            class="textfield__input"
                            style="width: 150px; text-align: center;"
                        >
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', screeningHTML);
    });
}

// Update screening data (called from HTML onchange)
function updateScreening(id, value) {
    saveScreeningData(id, { lastCompleted: value });
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    renderScreenings();
});

