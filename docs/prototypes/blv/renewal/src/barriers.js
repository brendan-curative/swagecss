console.log('Barriers to Care page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Update barrier selection
function updateBarrierSelect(value) {
    const data = window.dataManager.getData();
    if (!data.barriers) {
        data.barriers = { selected: '', comments: '' };
    }
    data.barriers.selected = value;
    window.dataManager.saveData(data);
}

// Update barrier comments
function updateBarrierComments(value) {
    const data = window.dataManager.getData();
    if (!data.barriers) {
        data.barriers = { selected: '', comments: '' };
    }
    data.barriers.comments = value;
    window.dataManager.saveData(data);
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const barriers = window.dataManager.getData().barriers || { selected: '', comments: '' };
    
    const selectEl = document.getElementById('barrier-select');
    const commentsEl = document.getElementById('barrier-comments');
    
    if (selectEl && barriers.selected) {
        selectEl.value = barriers.selected;
    }
    
    if (commentsEl && barriers.comments) {
        commentsEl.value = barriers.comments;
    }
});

