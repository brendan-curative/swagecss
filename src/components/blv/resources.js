// Resources Component JavaScript - BLV Component for managing resource selections
console.log('Resources component loaded');

/**
 * Resources Component
 * Manages user-selected topics and displays relevant resources from resources.json
 *
 * Usage:
 * 1. Add data-resource-action="toggle" and data-topic="topic-name" to buttons to track selections
 * 2. Add data-resource-action="display" to containers to display selected resources
 *
 * localStorage key: 'selectedResources' (array of topic strings)
 */

class ResourcesComponent {
    constructor() {
        this.storageKey = 'selectedResources';
        this.resourcesData = null;
        this.selectedTopics = this.loadSelectedTopics();
    }

    // Load selected topics from localStorage
    loadSelectedTopics() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save selected topics to localStorage
    saveSelectedTopics() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.selectedTopics));
    }

    // Add a topic to selections
    addTopic(topic) {
        if (!this.selectedTopics.includes(topic)) {
            this.selectedTopics.push(topic);
            this.saveSelectedTopics();
            return true;
        }
        return false;
    }

    // Remove a topic from selections
    removeTopic(topic) {
        const index = this.selectedTopics.indexOf(topic);
        if (index > -1) {
            this.selectedTopics.splice(index, 1);
            this.saveSelectedTopics();
            return true;
        }
        return false;
    }

    // Check if topic is selected
    hasTopic(topic) {
        return this.selectedTopics.includes(topic);
    }

    // Get all selected topics
    getSelectedTopics() {
        return [...this.selectedTopics];
    }

    // Load resources data from JSON
    async loadResourcesData() {
        if (this.resourcesData) return this.resourcesData;

        try {
            const response = await fetch('/swagecss/src/themes/blv/data/resources.json');
            this.resourcesData = await response.json();
            return this.resourcesData;
        } catch (error) {
            console.error('Error loading resources.json:', error);
            return [];
        }
    }

    // Get resources matching the given topics
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

    // Clear all selected topics
    clearAllTopics() {
        this.selectedTopics = [];
        this.saveSelectedTopics();
    }
}

// Global instance
let resourcesComponent = null;

/**
 * Initialize Resources component
 */
function initializeResources() {
    console.log('Resources component initialized');

    // Create global instance
    resourcesComponent = new ResourcesComponent();

    // Initialize toggle buttons (for selecting topics)
    initializeResourceToggleButtons();

    // Initialize display containers (for showing selected resources)
    initializeResourceDisplays();
}

/**
 * Initialize toggle buttons for selecting topics
 */
function initializeResourceToggleButtons() {
    const toggleButtons = document.querySelectorAll('[data-resource-action="toggle"]');

    toggleButtons.forEach(button => {
        const topic = button.dataset.topic;
        if (!topic) {
            console.warn('Toggle button missing data-topic attribute:', button);
            return;
        }

        // Restore state from localStorage
        if (resourcesComponent.hasTopic(topic)) {
            setCheckmarkButtonState(button, true);
        }

        // Add click handler
        button.addEventListener('click', function(event) {
            handleResourceToggle(this, event);
        });
    });
}

/**
 * Handle toggle button click
 */
function handleResourceToggle(button, event) {
    const topic = button.dataset.topic;
    if (!topic) return;

    // Toggle the checkmark button state
    toggleCheckmarkButton(button);

    // Update resource selections
    const isChecked = button.dataset.checked === 'true';
    if (isChecked) {
        resourcesComponent.addTopic(topic);
        console.log(`Added resource topic: ${topic}`);
    } else {
        resourcesComponent.removeTopic(topic);
        console.log(`Removed resource topic: ${topic}`);
    }
}

/**
 * Initialize resource display containers
 */
async function initializeResourceDisplays() {
    const displayContainers = document.querySelectorAll('[data-resource-action="display"]');

    if (displayContainers.length === 0) return;

    // Load resources data
    await resourcesComponent.loadResourcesData();

    displayContainers.forEach(container => {
        populateResourceDisplay(container);
    });
}

/**
 * Populate a resource display container
 * @param {HTMLElement} container - The container element to populate
 */
function populateResourceDisplay(container) {
    const selectedTopics = resourcesComponent.getSelectedTopics();

    // Check if we should hide empty state
    const hideIfEmpty = container.dataset.hideIfEmpty === 'true';

    if (selectedTopics.length === 0) {
        if (hideIfEmpty) {
            // Hide the entire parent card or container
            const parentCard = container.closest('.card') || container.parentElement;
            if (parentCard) {
                parentCard.style.display = 'none';
            }
        } else {
            container.innerHTML = '<li class="mb-8">No resources selected.</li>';
        }
        return;
    }

    // Get matching resources
    const resources = resourcesComponent.getResourcesByTopics(selectedTopics);

    if (resources.length === 0) {
        container.innerHTML = '<li class="mb-8">No resources found for selected topics.</li>';
        return;
    }

    // Get display format from data attribute (default: 'list')
    const format = container.dataset.resourceFormat || 'list';

    if (format === 'list') {
        // Populate as list items
        container.innerHTML = resources.map(resource =>
            `<li class="mb-8"><a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.title}</a></li>`
        ).join('');
    } else if (format === 'cards') {
        // Future: could support card format
        container.innerHTML = resources.map(resource =>
            `<div class="card p-16 mb-16">
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.title}</a>
            </div>`
        ).join('');
    }
}

/**
 * Get the resources component instance
 * @returns {ResourcesComponent} The global resources component instance
 */
function getResourcesComponent() {
    return resourcesComponent;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeResources);
} else {
    initializeResources();
}
