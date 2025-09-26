// Ordered List Component JavaScript - Replicating OrderedList behavior

/**
 * Initialize ordered list functionality
 */
function initializeOrderedList() {
    console.log('Ordered List component initialized');
    
    // Basic initialization for demo purposes
    const orderedLists = document.querySelectorAll('.ordered-list');
    orderedLists.forEach(list => {
        setupOrderedList(list);
    });
}

/**
 * Set up individual ordered list
 * @param {HTMLElement} list - The ordered list container
 */
function setupOrderedList(list) {
    // Add ARIA attributes for accessibility
    list.setAttribute('role', 'list');
    
    const items = list.querySelectorAll('.ordered-list__item');
    items.forEach((item, index) => {
        item.setAttribute('role', 'listitem');
        item.setAttribute('tabindex', '0');
        
        // Add keyboard support
        item.addEventListener('keydown', handleOrderedListKeydown);
    });
}

/**
 * Create an ordered list item programmatically
 * @param {number} order - The order number to display
 * @param {string} text - The item text content
 * @param {string} color - The color theme ('blue' or 'orange')
 * @returns {HTMLElement} The created list item element
 */
function createOrderedListItem(order, text, color = 'blue') {
    const listItem = document.createElement('li');
    listItem.className = 'ordered-list__item ordered-list__item--animate';
    listItem.setAttribute('data-order', order);
    listItem.setAttribute('data-color', color);
    listItem.setAttribute('role', 'listitem');
    listItem.setAttribute('tabindex', '0');
    
    // Create number container
    const numberContainer = document.createElement('div');
    numberContainer.className = 'ordered-list__number';
    
    const numberSpan = document.createElement('span');
    numberSpan.textContent = order.toString();
    numberContainer.appendChild(numberSpan);
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'ordered-list__content';
    
    const textElement = document.createElement('p');
    textElement.className = 'ordered-list__text';
    textElement.textContent = text;
    contentContainer.appendChild(textElement);
    
    // Assemble the item
    listItem.appendChild(numberContainer);
    listItem.appendChild(contentContainer);
    
    // Add keyboard support
    listItem.addEventListener('keydown', handleOrderedListKeydown);
    
    return listItem;
}

/**
 * Add an item to an ordered list
 * @param {HTMLElement|string} target - List element or selector
 * @param {string} text - The item text content
 * @param {string} color - The color theme ('blue' or 'orange')
 */
function addOrderedListItem(target, text, color = 'blue') {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    const existingItems = list.querySelectorAll('.ordered-list__item');
    const nextOrder = existingItems.length + 1;
    
    // If called from demo button without params, use demo data
    if (arguments.length === 0) {
        const demoTexts = [
            'New Task Added',
            'Additional Step',
            'Extra Process',
            'Bonus Item',
            'Final Step'
        ];
        const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
        const randomColor = Math.random() > 0.5 ? 'blue' : 'orange';
        
        const dynamicList = document.getElementById('dynamic-list');
        if (dynamicList) {
            const item = createOrderedListItem(nextOrder, randomText, randomColor);
            dynamicList.appendChild(item);
        }
        return;
    }
    
    const item = createOrderedListItem(nextOrder, text, color);
    list.appendChild(item);
}

/**
 * Remove the last item from an ordered list
 * @param {HTMLElement|string} target - List element or selector
 */
function removeLastOrderedListItem(target) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    const items = list.querySelectorAll('.ordered-list__item');
    if (items.length > 0) {
        const lastItem = items[items.length - 1];
        lastItem.style.opacity = '0';
        lastItem.style.transform = 'translateY(-10px)';
        lastItem.style.transition = 'all 0.3s ease-out';
        
        setTimeout(() => {
            lastItem.remove();
        }, 300);
    }
}

/**
 * Clear all items from an ordered list
 * @param {HTMLElement|string} target - List element or selector
 */
function clearOrderedList(target) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    // If called from demo button without params, target dynamic list
    if (arguments.length === 0) {
        const dynamicList = document.getElementById('dynamic-list');
        if (dynamicList) {
            clearOrderedList(dynamicList);
        }
        return;
    }
    
    const items = list.querySelectorAll('.ordered-list__item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            item.style.transition = 'all 0.3s ease-out';
            
            setTimeout(() => {
                item.remove();
            }, 300);
        }, index * 100); // Stagger the removal
    });
}

/**
 * Update the text content of an ordered list item
 * @param {HTMLElement|string} target - Item element or selector
 * @param {string} newText - The new text content
 */
function updateOrderedListItemText(target, newText) {
    const item = typeof target === 'string' ? document.querySelector(target) : target;
    if (!item) return;
    
    const textElement = item.querySelector('.ordered-list__text');
    if (textElement) {
        textElement.textContent = newText;
    }
}

/**
 * Change the color theme of an ordered list item
 * @param {HTMLElement|string} target - Item element or selector
 * @param {string} color - The new color theme ('blue' or 'orange')
 */
function updateOrderedListItemColor(target, color) {
    const item = typeof target === 'string' ? document.querySelector(target) : target;
    if (!item) return;
    
    item.setAttribute('data-color', color);
}

/**
 * Demo function to toggle between blue and orange themes
 */
function toggleTheme() {
    const dynamicList = document.getElementById('dynamic-list');
    if (!dynamicList) return;
    
    const items = dynamicList.querySelectorAll('.ordered-list__item');
    items.forEach(item => {
        const currentColor = item.getAttribute('data-color');
        const newColor = currentColor === 'blue' ? 'orange' : 'blue';
        updateOrderedListItemColor(item, newColor);
    });
}

/**
 * Handle keyboard navigation for ordered list items
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleOrderedListKeydown(event) {
    const list = event.target.closest('.ordered-list');
    const items = Array.from(list.querySelectorAll('.ordered-list__item'));
    const currentIndex = items.indexOf(event.target);
    
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prevIndex].focus();
            break;
            
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[nextIndex].focus();
            break;
            
        case 'Home':
            event.preventDefault();
            items[0].focus();
            break;
            
        case 'End':
            event.preventDefault();
            items[items.length - 1].focus();
            break;
    }
}

/**
 * Get all items from an ordered list
 * @param {HTMLElement|string} target - List element or selector
 * @returns {Array} Array of item data objects
 */
function getOrderedListItems(target) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return [];
    
    const items = list.querySelectorAll('.ordered-list__item');
    return Array.from(items).map(item => ({
        order: parseInt(item.getAttribute('data-order')),
        text: item.querySelector('.ordered-list__text')?.textContent || '',
        color: item.getAttribute('data-color') || 'blue'
    }));
}

/**
 * Rebuild an ordered list with new items
 * @param {HTMLElement|string} target - List element or selector
 * @param {Array} items - Array of item data objects
 */
function rebuildOrderedList(target, items) {
    const list = typeof target === 'string' ? document.querySelector(target) : target;
    if (!list) return;
    
    // Clear existing items
    list.innerHTML = '';
    
    // Add new items
    items.forEach((itemData, index) => {
        const item = createOrderedListItem(
            itemData.order || index + 1,
            itemData.text || '',
            itemData.color || 'blue'
        );
        list.appendChild(item);
    });
    
    // Re-setup the list
    setupOrderedList(list);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOrderedList);
} else {
    initializeOrderedList();
}
