/**
 * Select Component JavaScript
 * Provides dropdown selection functionality with search and multi-select support
 * Matches Curative UI Select component using Headless UI Listbox pattern
 */

(function() {
    'use strict';

    // Initialize select functionality when DOM is ready
    function initializeSelects() {
        const selects = document.querySelectorAll('.select');
        
        selects.forEach(selectElement => {
            const button = selectElement.querySelector('.select__button');
            const options = selectElement.querySelector('.select__options');
            const icon = selectElement.querySelector('.select__icon-container .heroicon');
            const searchInput = selectElement.querySelector('.select__search');
            const optionItems = selectElement.querySelectorAll('.select__option');
            let isOpen = false;

            if (!button || !options || !icon) return;

            // Toggle dropdown
            function toggleDropdown() {
                if (button.disabled) return;

                isOpen = !isOpen;
                options.classList.toggle('select__options--hidden', !isOpen);

                // Update icon and button state
                if (isOpen) {
                    icon.className = icon.className.replace('chevron-down', 'chevron-up');
                    button.classList.add('select__button--open');
                    if (searchInput) searchInput.focus();
                } else {
                    icon.className = icon.className.replace('chevron-up', 'chevron-down');
                    button.classList.remove('select__button--open');
                }

                console.log(`Select ${isOpen ? 'opened' : 'closed'}`);
            }

            // Close dropdown
            function closeDropdown() {
                if (!isOpen) return;
                
                isOpen = false;
                options.classList.add('select__options--hidden');
                icon.className = icon.className.replace('chevron-up', 'chevron-down');
                button.classList.remove('select__button--open');
                button.focus();
            }

            // Handle option selection
            function selectOption(option) {
                const value = option.getAttribute('data-value');
                const text = option.textContent.trim();
                
                // Update selected state
                optionItems.forEach(opt => opt.classList.remove('select__option--selected'));
                option.classList.add('select__option--selected');
                
                // Update button text
                const buttonText = button.querySelector('.select__button-text');
                if (buttonText) {
                    buttonText.textContent = text;
                    button.classList.remove('select__button--placeholder');
                }
                
                closeDropdown();
                
                console.log(`Selected option: ${value} - ${text}`);
                
                // Simulate onChange callback
                if (window.onSelectChange) {
                    window.onSelectChange(value, text);
                }
            }

            // Handle search functionality
            function handleSearch() {
                if (!searchInput) return;
                
                const searchTerm = searchInput.value.toLowerCase();
                
                optionItems.forEach(option => {
                    const text = option.textContent.toLowerCase();
                    const matches = text.includes(searchTerm);
                    option.style.display = matches ? 'block' : 'none';
                });
                
                console.log(`Search: "${searchTerm}"`);
            }

            // Event listeners
            button.addEventListener('click', toggleDropdown);
            
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown();
                } else if (e.key === 'ArrowDown' && !isOpen) {
                    e.preventDefault();
                    toggleDropdown();
                } else if (e.key === 'Escape' && isOpen) {
                    e.preventDefault();
                    closeDropdown();
                }
            });

            // Option click handlers
            optionItems.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    selectOption(option);
                });

                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectOption(option);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        closeDropdown();
                    }
                });
            });

            // Search input handler
            if (searchInput) {
                searchInput.addEventListener('input', handleSearch);
                
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        closeDropdown();
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const firstVisibleOption = Array.from(optionItems).find(opt => opt.style.display !== 'none');
                        if (firstVisibleOption) firstVisibleOption.focus();
                    }
                });
            }

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!selectElement.contains(e.target)) {
                    closeDropdown();
                }
            });
        });
    }

    // Utility function to get selected value
    function getSelectedValue(selectElement) {
        const selectedOption = selectElement.querySelector('.select__option--selected');
        return selectedOption ? selectedOption.getAttribute('data-value') : null;
    }

    // Utility function to set selected value
    function setSelectedValue(selectElement, value) {
        const option = selectElement.querySelector(`.select__option[data-value="${value}"]`);
        if (option) {
            const click = new Event('click', { bubbles: true });
            option.dispatchEvent(click);
        }
    }

    // Public API
    window.SelectComponent = {
        init: initializeSelects,
        getSelectedValue: getSelectedValue,
        setSelectedValue: setSelectedValue
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSelects);
    } else {
        initializeSelects();
    }

    console.log('Select component JavaScript loaded');
})();

// Multi-select functionality
(function() {
    'use strict';

    function initializeMultiSelects() {
        const multiSelects = document.querySelectorAll('.select--multi');

        multiSelects.forEach(function(selectContainer) {
            const button = selectContainer.querySelector('.select__button');
            const dropdown = selectContainer.querySelector('.select__dropdown');
            const checkboxes = selectContainer.querySelectorAll('.select__checkbox-option input[type="checkbox"]');
            const selectedItemsContainer = selectContainer.querySelector('.select__selected-items');
            const placeholder = selectContainer.querySelector('.select__placeholder');

            if (!button || !dropdown) return;

            // Toggle dropdown on button click
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDropdown();
            });

            // Handle keyboard events for button (Enter and Space)
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown();
                }
            });

            function toggleDropdown() {
                const isOpen = dropdown.classList.contains('select__dropdown--open');

                // Close all other dropdowns
                document.querySelectorAll('.select__dropdown--open').forEach(function(openDropdown) {
                    openDropdown.classList.remove('select__dropdown--open');
                    const otherButton = openDropdown.parentElement.querySelector('.select__button');
                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current dropdown
                if (isOpen) {
                    dropdown.classList.remove('select__dropdown--open');
                    button.setAttribute('aria-expanded', 'false');
                } else {
                    dropdown.classList.add('select__dropdown--open');
                    button.setAttribute('aria-expanded', 'true');
                }
            });

            // Handle checkbox changes
            checkboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    updateSelectedItems();
                });
            });

            // Handle badge remove buttons
            function attachBadgeRemoveHandlers() {
                const removeButtons = selectContainer.querySelectorAll('.select__badge-remove');
                removeButtons.forEach(function(removeButton) {
                    removeButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const badge = this.closest('.select__badge');
                        const value = this.getAttribute('aria-label').replace('Remove ', '');

                        // Find and uncheck the corresponding checkbox
                        checkboxes.forEach(function(checkbox) {
                            const label = checkbox.nextElementSibling;
                            if (label && label.textContent.trim() === value) {
                                checkbox.checked = false;
                            }
                        });

                        updateSelectedItems();
                    });
                });
            }

            // Update selected items display
            function updateSelectedItems() {
                const selectedValues = [];

                checkboxes.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        const label = checkbox.nextElementSibling;
                        if (label) {
                            selectedValues.push(label.textContent.trim());
                        }
                    }
                });

                if (selectedValues.length === 0) {
                    // Show placeholder
                    if (placeholder) {
                        placeholder.style.display = 'inline';
                    }
                    if (selectedItemsContainer) {
                        selectedItemsContainer.innerHTML = '';
                        selectedItemsContainer.style.display = 'none';
                    }
                } else {
                    // Hide placeholder and show badges
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                    if (selectedItemsContainer) {
                        selectedItemsContainer.style.display = 'flex';
                        selectedItemsContainer.innerHTML = selectedValues.map(function(value) {
                            return '<span class="select__badge">' +
                                '<button type="button" class="select__badge-remove" aria-label="Remove ' + value + '">' +
                                '<span class="heroicon heroicon-16 heroicon-x"></span>' +
                                '</button>' +
                                value +
                                '</span>';
                        }).join('');

                        // Reattach handlers to new remove buttons
                        attachBadgeRemoveHandlers();
                    }
                }
            }

            // Initial setup of remove button handlers
            attachBadgeRemoveHandlers();

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!selectContainer.contains(e.target)) {
                    dropdown.classList.remove('select__dropdown--open');
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        });

        console.log('Multi-select component JavaScript initialized');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMultiSelects);
    } else {
        initializeMultiSelects();
    }
})();
