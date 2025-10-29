/**
 * Modal Component JavaScript
 * Provides interactive functionality for modal dialogs, including open/close behavior,
 * backdrop clicks, keyboard navigation, and accessibility features.
 * Matches Curative UI Modal component pattern.
 */

(function() {
    'use strict';

    function initializeModals() {
        const modals = document.querySelectorAll('.modal');

        modals.forEach(modal => {
            const closeButtons = modal.querySelectorAll('[data-modal-close]');
            const primaryButton = modal.querySelector('[data-modal-primary]');
            const secondaryButton = modal.querySelector('[data-modal-secondary]');

            // Close modal function
            function closeModal() {
                modal.classList.add('modal--hidden');
                modal.setAttribute('aria-hidden', 'true');
                
                // Return focus to trigger element if available
                const triggerElement = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
                if (triggerElement) {
                    triggerElement.focus();
                }

                // Emit close event
                const closeEvent = new CustomEvent('modalClose', {
                    detail: { modalId: modal.id }
                });
                modal.dispatchEvent(closeEvent);
            }

            // Open modal function
            function openModal() {
                modal.classList.remove('modal--hidden');
                modal.setAttribute('aria-hidden', 'false');

                // Focus the modal panel for accessibility
                const panel = modal.querySelector('.modal__panel');
                if (panel) {
                    panel.focus();
                }

                // Emit open event
                const openEvent = new CustomEvent('modalOpen', {
                    detail: { modalId: modal.id }
                });
                modal.dispatchEvent(openEvent);
            }

            // Close button handlers
            closeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModal();
                });
            });

            // Primary button handler
            if (primaryButton) {
                primaryButton.addEventListener('click', (e) => {
                    const action = primaryButton.dataset.modalAction;
                    
                    // Check if button is loading or disabled
                    if (primaryButton.disabled || primaryButton.classList.contains('modal__button--loading')) {
                        e.preventDefault();
                        return;
                    }

                    // Emit primary button event
                    const buttonEvent = new CustomEvent('modalPrimaryClick', {
                        detail: { 
                            modalId: modal.id,
                            action: action,
                            button: primaryButton
                        }
                    });
                    modal.dispatchEvent(buttonEvent);

                    // Auto-close if no specific action is defined
                    if (!action || action === 'close') {
                        closeModal();
                    }
                });
            }

            // Secondary button handler
            if (secondaryButton) {
                secondaryButton.addEventListener('click', (e) => {
                    const action = secondaryButton.dataset.modalAction;

                    // Emit secondary button event
                    const buttonEvent = new CustomEvent('modalSecondaryClick', {
                        detail: { 
                            modalId: modal.id,
                            action: action,
                            button: secondaryButton
                        }
                    });
                    modal.dispatchEvent(buttonEvent);

                    // Auto-close if no specific action is defined
                    if (!action || action === 'close') {
                        closeModal();
                    }
                });
            }

            // Backdrop click to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // Prevent clicks inside the panel from closing the modal
            const panel = modal.querySelector('.modal__panel');
            if (panel) {
                panel.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            // Keyboard navigation
            modal.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Escape':
                        e.preventDefault();
                        closeModal();
                        break;
                    case 'Tab':
                        handleTabNavigation(e, modal);
                        break;
                }
            });

            // Store modal functions for external access
            modal.openModal = openModal;
            modal.closeModal = closeModal;
        });

        // Initialize trigger buttons
        const triggerButtons = document.querySelectorAll('[data-modal-trigger]');
        triggerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = button.dataset.modalTrigger;
                const targetModal = document.getElementById(modalId);
                
                if (targetModal && targetModal.openModal) {
                    targetModal.openModal();
                }
            });
        });
    }

    function handleTabNavigation(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // Public API for programmatic control
    window.ModalComponent = {
        init: initializeModals,
        
        open: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal && modal.openModal) {
                modal.openModal();
            }
        },
        
        close: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal && modal.closeModal) {
                modal.closeModal();
            }
        },
        
        setLoading: function(modalId, isLoading) {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            const primaryButton = modal.querySelector('[data-modal-primary]');
            if (primaryButton) {
                if (isLoading) {
                    primaryButton.disabled = true;
                    primaryButton.classList.add('modal__button--loading');
                    
                    // Add spinner if not already present
                    if (!primaryButton.querySelector('.modal__button-spinner')) {
                        const spinner = document.createElement('div');
                        spinner.className = 'modal__button-spinner';
                        primaryButton.insertBefore(spinner, primaryButton.firstChild);
                    }
                } else {
                    primaryButton.disabled = false;
                    primaryButton.classList.remove('modal__button--loading');
                    
                    // Remove spinner
                    const spinner = primaryButton.querySelector('.modal__button-spinner');
                    if (spinner) {
                        spinner.remove();
                    }
                }
            }
        },
        
        setButtonDisabled: function(modalId, buttonType, isDisabled) {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            const selector = buttonType === 'secondary' ? '[data-modal-secondary]' : '[data-modal-primary]';
            const button = modal.querySelector(selector);
            
            if (button) {
                button.disabled = isDisabled;
            }
        },
        
        updateMessage: function(modalId, message) {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            const messageElement = modal.querySelector('.modal__message');
            if (messageElement) {
                messageElement.innerHTML = message;
            }
        },
        
        updateTitle: function(modalId, title) {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            const titleElement = modal.querySelector('.modal__title');
            if (titleElement) {
                titleElement.textContent = title;
            }
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModals);
    } else {
        initializeModals();
    }

    // Re-initialize when new modals are added to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('modal')) {
                    initializeModals();
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Demo-specific functionality for modal component examples
    function initializeDemoFeatures() {
        console.log('Modal component demo loaded');
        
        // Loading modal demo
        const loadingModal = document.getElementById('loading-modal');
        if (loadingModal) {
            loadingModal.addEventListener('modalPrimaryClick', (e) => {
                if (e.detail.action === 'process') {
                    e.preventDefault();
                    
                    // Simulate loading
                    window.ModalComponent.setLoading('loading-modal', true);
                    window.ModalComponent.updateMessage('loading-modal', 'Processing... Please wait.');
                    
                    setTimeout(() => {
                        window.ModalComponent.setLoading('loading-modal', false);
                        window.ModalComponent.updateMessage('loading-modal', 'Processing complete!');
                        window.ModalComponent.updateTitle('loading-modal', 'Success');
                        
                        // Change button text
                        const button = e.detail.button;
                        button.textContent = 'Done';
                        button.dataset.modalAction = 'close';
                    }, 3000);
                }
            });
        }
        
        // Confirmation modal demo
        const confirmModal = document.getElementById('confirm-modal');
        if (confirmModal) {
            confirmModal.addEventListener('modalPrimaryClick', (e) => {
                if (e.detail.action === 'delete') {
                    e.preventDefault();
                    
                    window.ModalComponent.updateMessage('confirm-modal', 'Item has been deleted successfully.');
                    window.ModalComponent.updateTitle('confirm-modal', 'Deleted');
                    
                    const button = e.detail.button;
                    button.textContent = 'Close';
                    button.dataset.modalAction = 'close';
                    button.style.backgroundColor = 'var(--color-foundation-success)';
                }
            });
        }
        
        // Two button modal demo
        const twoButtonModal = document.getElementById('two-button-modal');
        if (twoButtonModal) {
            twoButtonModal.addEventListener('modalPrimaryClick', (e) => {
                if (e.detail.action === 'save') {
                    e.preventDefault();
                    
                    window.ModalComponent.setLoading('two-button-modal', true);
                    
                    setTimeout(() => {
                        window.ModalComponent.setLoading('two-button-modal', false);
                        window.ModalComponent.updateMessage('two-button-modal', 'Changes saved successfully!');
                        window.ModalComponent.updateTitle('two-button-modal', 'Saved');
                        
                        const button = e.detail.button;
                        button.textContent = 'Close';
                        button.dataset.modalAction = 'close';
                    }, 2000);
                }
            });
        }
        
        console.log('Modal demo features initialized');
    }

    // Initialize demo features when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDemoFeatures);
    } else {
        initializeDemoFeatures();
    }

    console.log('Modal component JavaScript loaded');
})();
