console.log('Cash Card page JavaScript loaded - v1.0');

// Data persistence using localStorage
class ResourceManager {
    constructor() {
        this.storageKey = 'selectedResources';
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    addResource(topic) {
        if (!this.data.includes(topic)) {
            this.data.push(topic);
            this.saveData();
        }
    }

    removeResource(topic) {
        const index = this.data.indexOf(topic);
        if (index > -1) {
            this.data.splice(index, 1);
            this.saveData();
        }
    }

    hasResource(topic) {
        return this.data.includes(topic);
    }

    getResources() {
        return [...this.data];
    }
}

// Initialize resource manager
const resourceManager = new ResourceManager();

// Initialize checkmark buttons with resource tracking
function initializeResourceButtons() {
    const resourceButtons = document.querySelectorAll('.add-resource');

    resourceButtons.forEach(button => {
        const topic = button.dataset.topic;

        // Restore state from localStorage
        if (topic && resourceManager.hasResource(topic)) {
            setCheckmarkButtonState(button, true);
        }

        // Add click handler
        button.addEventListener('click', function() {
            handleResourceButtonClick(this);
        });
    });
}

// Handle resource button click
function handleResourceButtonClick(button) {
    const topic = button.dataset.topic;
    if (!topic) return;

    // Toggle the button state
    toggleCheckmarkButton(button);

    // Update resource manager
    const isChecked = button.dataset.checked === 'true';
    if (isChecked) {
        resourceManager.addResource(topic);
        console.log(`Added resource topic: ${topic}`);
    } else {
        resourceManager.removeResource(topic);
        console.log(`Removed resource topic: ${topic}`);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeResourceButtons();
    console.log('Resource tracking initialized');
});
