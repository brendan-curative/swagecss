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
