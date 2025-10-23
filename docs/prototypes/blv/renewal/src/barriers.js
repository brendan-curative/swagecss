console.log('Barriers to Care page JavaScript loaded - v1.0');

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
            barriers: {
                selected: '',
                comments: ''
            }
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getBarriers() {
        return this.data.barriers || { selected: '', comments: '' };
    }

    updateBarrier(field, value) {
        if (!this.data.barriers) {
            this.data.barriers = { selected: '', comments: '' };
        }
        this.data.barriers[field] = value;
        this.saveData();
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Update barrier selection
function updateBarrierSelect(value) {
    prototype.updateBarrier('selected', value);
}

// Update barrier comments
function updateBarrierComments(value) {
    prototype.updateBarrier('comments', value);
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const barriers = prototype.getBarriers();
    
    const selectEl = document.getElementById('barrier-select');
    const commentsEl = document.getElementById('barrier-comments');
    
    if (selectEl && barriers.selected) {
        selectEl.value = barriers.selected;
    }
    
    if (commentsEl && barriers.comments) {
        commentsEl.value = barriers.comments;
    }
});

