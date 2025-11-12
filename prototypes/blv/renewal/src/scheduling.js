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

// Resource Manager - loads selected resources from localStorage
class ResourceLoader {
    constructor() {
        this.storageKey = 'selectedResources';
        this.resourcesData = null;
    }

    async loadResourcesData() {
        try {
            const response = await fetch('/swagecss/src/themes/blv/data/resources.json');
            this.resourcesData = await response.json();
            return this.resourcesData;
        } catch (error) {
            console.error('Error loading resources.json:', error);
            return [];
        }
    }

    getSelectedTopics() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    getResourcesByTopics(topics) {
        if (!this.resourcesData) return [];

        const resources = [];
        topics.forEach(topic => {
            const matchingResources = this.resourcesData.filter(resource =>
                resource.topic && resource.topic.includes(topic)
            );
            resources.push(...matchingResources);
        });

        // Remove duplicates based on URL
        return resources.filter((resource, index, self) =>
            index === self.findIndex(r => r.url === resource.url)
        );
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();
const resourceLoader = new ResourceLoader();

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

// Populate resource list with selected resources
async function populateResourceList() {
    const resourceList = document.querySelector('.resource-list');
    if (!resourceList) return;

    // Load resources data
    await resourceLoader.loadResourcesData();

    // Get selected topics
    const selectedTopics = resourceLoader.getSelectedTopics();

    if (selectedTopics.length === 0) {
        // Hide the entire card if no resources are selected
        const resourceCard = resourceList.closest('.card');
        if (resourceCard) {
            resourceCard.style.display = 'none';
        }
        return;
    }

    // Get matching resources
    const resources = resourceLoader.getResourcesByTopics(selectedTopics);

    if (resources.length === 0) {
        resourceList.innerHTML = '<li class="mb-8">No resources found for selected topics.</li>';
        return;
    }

    // Populate the list
    resourceList.innerHTML = resources.map(resource =>
        `<li class="mb-8"><a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.title}</a></li>`
    ).join('');
}

// Reset prototype - now uses global function from layout
// (function is available globally as restartPrototype/resetPrototype)

// Initialize page on load
document.addEventListener('DOMContentLoaded', async function() {
    const appointmentType = prototype.getAppointmentType();

    if (appointmentType) {
        selectAppointmentType(appointmentType);
    }

    // Populate resource list
    await populateResourceList();

    // Initialize interactive confetti button
    const interactiveButton = document.getElementById('interactive-confetti');
    if (interactiveButton && typeof createInteractiveConfetti === 'function') {
        createInteractiveConfetti(interactiveButton);
    }
});

