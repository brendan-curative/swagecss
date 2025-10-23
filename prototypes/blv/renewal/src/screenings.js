console.log('Screenings page JavaScript loaded - v1.0');

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
            screenings: [
                { id: 'mammogram', name: 'Mammogram', lastCompleted: '2022', isDue: true },
                { id: 'colonoscopy', name: 'Colonoscopy', lastCompleted: '', isDue: true },
                { id: 'bone-density', name: 'Bone Density Scan', lastCompleted: '2021', isDue: false },
                { id: 'eye-exam', name: 'Eye Exam', lastCompleted: '2023', isDue: false },
                { id: 'skin-cancer', name: 'Skin Cancer Screening', lastCompleted: '', isDue: false }
            ]
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getScreenings() {
        return this.data.screenings || [];
    }

    updateScreening(id, lastCompleted) {
        const screening = this.data.screenings.find(s => s.id === id);
        if (screening) {
            screening.lastCompleted = lastCompleted;
            this.saveData();
        }
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Render screenings list
function renderScreenings() {
    const container = document.getElementById('screenings-list');
    const screenings = prototype.getScreenings();
    container.innerHTML = '';
    
    screenings.forEach(screening => {
        const borderClass = screening.isDue ? 'border-l-4 border-l-gray-600' : '';
        const badgeHTML = screening.isDue ? 
            '<span class="bg-gray-600 text-white px-8 py-4 rounded text-2xs font-semibold">DUE</span>' : '';
        
        const placeholder = screening.lastCompleted ? screening.lastCompleted : 'Enter year';
        
        const screeningHTML = `
            <div class="card p-16 mb-16 ${borderClass}">
                <div class="flex-row flex-justify-between flex-align-start mb-${screening.isDue ? '8' : '0'}">
                    <h5 class="text-md font-semibold">${screening.name}</h5>
                    ${badgeHTML}
                </div>
                <div class="flex-row flex-align-center gap-16">
                    <span class="text-sm text-gray-600">Last completed:</span>
                    <input 
                        type="text" 
                        id="screening-${screening.id}"
                        value="${screening.lastCompleted}" 
                        placeholder="${placeholder}"
                        onchange="updateScreening('${screening.id}', this.value)"
                        class="textfield__input"
                        style="width: 100px; text-align: center; border-style: dashed;"
                    >
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', screeningHTML);
    });
}

// Update screening data
function updateScreening(id, value) {
    prototype.updateScreening(id, value);
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    renderScreenings();
});

