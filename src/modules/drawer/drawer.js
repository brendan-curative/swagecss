/**
 * Drawer Plugin - Slide-out panel component
 * Supports left/right positioning, keyboard navigation, and accessibility
 */

class Drawer {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            position: 'left', // 'left' or 'right'
            size: 'medium', // 'small', 'medium', 'large', 'full'
            closeOnOverlayClick: true,
            closeOnEscape: true,
            focusTrap: true,
            autoFocus: true,
            preventBodyScroll: true,
            ...options
        };

        this.isOpen = false;
        this.overlay = null;
        this.triggers = [];
        this.focusableElements = [];
        this.previousFocus = null;
        
        this.init();
    }

    init() {
        this.setupDrawer();
        this.setupOverlay();
        this.setupTriggers();
        this.setupEventListeners();
        this.setupAccessibility();
        
        // Store reference for global access
        this.element.drawerInstance = this;
        
        // Add initialized class to enable transitions
        this.element.classList.add('drawer--initialized');
    }

    setupDrawer() {
        // Add base classes
        this.element.classList.add('drawer');
        this.element.classList.add(`drawer--${this.options.position}`);
        this.element.classList.add(`drawer--${this.options.size}`);
        
        // Set initial state - ensure drawer is closed
        this.element.classList.remove('drawer--open');
        this.element.setAttribute('aria-hidden', 'true');
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('role', 'dialog');
        
        // Add backdrop filter support detection
        if (CSS.supports('backdrop-filter', 'blur(1px)')) {
            this.element.classList.add('drawer--backdrop-support');
        }
    }

    setupOverlay() {
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.className = 'drawer-overlay';
        this.overlay.setAttribute('aria-hidden', 'true');
        
        // Ensure overlay is initially hidden
        this.overlay.classList.remove('drawer-overlay--open');
        
        // Insert overlay before drawer
        this.element.parentNode.insertBefore(this.overlay, this.element);
        
        // Setup overlay click handler
        if (this.options.closeOnOverlayClick) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
    }

    setupTriggers() {
        // Find trigger buttons
        const triggerId = this.element.id;
        if (triggerId) {
            this.triggers = document.querySelectorAll(`[data-drawer-target="${triggerId}"]`);
        }
        
        // Setup trigger event listeners
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
            
            // Add accessibility attributes
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', triggerId);
        });
    }

    setupEventListeners() {
        // Close button
        const closeButton = this.element.querySelector('.drawer__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }

        // Escape key
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        // Focus trap
        if (this.options.focusTrap) {
            this.element.addEventListener('keydown', (e) => {
                this.handleFocusTrap(e);
            });
        }
    }

    setupAccessibility() {
        // Find all focusable elements
        this.updateFocusableElements();
        
        // Setup focus management
        this.element.addEventListener('transitionend', () => {
            if (this.isOpen && this.options.autoFocus) {
                this.focusFirstElement();
            }
        });
    }

    updateFocusableElements() {
        const selectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];
        
        this.focusableElements = Array.from(
            this.element.querySelectorAll(selectors.join(', '))
        ).filter(el => {
            return el.offsetWidth > 0 && el.offsetHeight > 0 && 
                   getComputedStyle(el).visibility !== 'hidden';
        });
    }

    handleFocusTrap(e) {
        if (!this.isOpen || e.key !== 'Tab') return;
        
        const firstFocusable = this.focusableElements[0];
        const lastFocusable = this.focusableElements[this.focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
            }
        }
    }

    focusFirstElement() {
        const firstFocusable = this.focusableElements[0];
        if (firstFocusable) {
            firstFocusable.focus();
        } else {
            this.element.focus();
        }
    }

    open() {
        if (this.isOpen) return;
        
        // Store current focus
        this.previousFocus = document.activeElement;
        
        // Prevent body scroll
        if (this.options.preventBodyScroll) {
            document.body.classList.add('drawer-open');
        }
        
        // Update state
        this.isOpen = true;
        
        // Add animation class
        this.element.classList.add('drawer--animating');
        
        // Show overlay
        this.overlay.classList.add('drawer-overlay--open');
        this.overlay.setAttribute('aria-hidden', 'false');
        
        // Show drawer
        this.element.classList.add('drawer--open');
        this.element.setAttribute('aria-hidden', 'false');
        
        // Update triggers
        this.triggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'true');
        });
        
        // Update focusable elements
        this.updateFocusableElements();
        
        // Remove animation class after transition
        setTimeout(() => {
            this.element.classList.remove('drawer--animating');
            
            // Focus management
            if (this.options.autoFocus) {
                this.focusFirstElement();
            }
        }, 300);
        
        // Emit custom event
        this.element.dispatchEvent(new CustomEvent('drawer:open', {
            detail: { drawer: this },
            bubbles: true
        }));
    }

    close() {
        if (!this.isOpen) return;
        
        // Add animation class
        this.element.classList.add('drawer--animating');
        
        // Hide drawer
        this.element.classList.remove('drawer--open');
        this.element.setAttribute('aria-hidden', 'true');
        
        // Hide overlay
        this.overlay.classList.remove('drawer-overlay--open');
        this.overlay.setAttribute('aria-hidden', 'true');
        
        // Update triggers
        this.triggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
        });
        
        // Remove animation class and restore focus after transition
        setTimeout(() => {
            this.element.classList.remove('drawer--animating');
            
            // Restore body scroll
            if (this.options.preventBodyScroll) {
                document.body.classList.remove('drawer-open');
            }
            
            // Restore focus
            if (this.previousFocus) {
                this.previousFocus.focus();
                this.previousFocus = null;
            }
            
            // Update state
            this.isOpen = false;
            
        }, 300);
        
        // Emit custom event
        this.element.dispatchEvent(new CustomEvent('drawer:close', {
            detail: { drawer: this },
            bubbles: true
        }));
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    destroy() {
        // Remove event listeners
        this.triggers.forEach(trigger => {
            trigger.removeEventListener('click', this.toggle);
        });
        
        // Remove overlay
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        
        // Remove classes
        this.element.classList.remove('drawer', `drawer--${this.options.position}`, `drawer--${this.options.size}`);
        
        // Remove instance reference
        delete this.element.drawerInstance;
        
        // Restore body scroll if needed
        if (this.isOpen && this.options.preventBodyScroll) {
            document.body.classList.remove('drawer-open');
        }
    }
}

/**
 * Initialize all drawers on the page
 */
function initializeDrawers() {
    const drawers = document.querySelectorAll('[data-drawer]');
    
    drawers.forEach(drawerElement => {
        // Skip if already initialized
        if (drawerElement.drawerInstance) return;
        
        // Get options from data attributes
        const options = {
            position: drawerElement.dataset.drawerPosition || 'left',
            size: drawerElement.dataset.drawerSize || 'medium',
            closeOnOverlayClick: drawerElement.dataset.drawerCloseOnOverlay !== 'false',
            closeOnEscape: drawerElement.dataset.drawerCloseOnEscape !== 'false',
            focusTrap: drawerElement.dataset.drawerFocusTrap !== 'false',
            autoFocus: drawerElement.dataset.drawerAutoFocus !== 'false',
            preventBodyScroll: drawerElement.dataset.drawerPreventBodyScroll !== 'false'
        };
        
        // Create drawer instance
        new Drawer(drawerElement, options);
    });
}

/**
 * Global drawer utilities
 */
window.Drawer = Drawer;

window.openDrawer = function(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer && drawer.drawerInstance) {
        drawer.drawerInstance.open();
    }
};

window.closeDrawer = function(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer && drawer.drawerInstance) {
        drawer.drawerInstance.close();
    }
};

window.toggleDrawer = function(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer && drawer.drawerInstance) {
        drawer.drawerInstance.toggle();
    }
};

/**
 * Auto-initialize on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDrawers);
} else {
    initializeDrawers();
}

// Re-initialize on dynamic content changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches('[data-drawer]')) {
                    // Initialize new drawer
                    if (!node.drawerInstance) {
                        const options = {
                            position: node.dataset.drawerPosition || 'left',
                            size: node.dataset.drawerSize || 'medium',
                            closeOnOverlayClick: node.dataset.drawerCloseOnOverlay !== 'false',
                            closeOnEscape: node.dataset.drawerCloseOnEscape !== 'false',
                            focusTrap: node.dataset.drawerFocusTrap !== 'false',
                            autoFocus: node.dataset.drawerAutoFocus !== 'false',
                            preventBodyScroll: node.dataset.drawerPreventBodyScroll !== 'false'
                        };
                        new Drawer(node, options);
                    }
                }
                
                // Initialize drawers within added content
                const drawersInNode = node.querySelectorAll('[data-drawer]');
                drawersInNode.forEach(drawer => {
                    if (!drawer.drawerInstance) {
                        const options = {
                            position: drawer.dataset.drawerPosition || 'left',
                            size: drawer.dataset.drawerSize || 'medium',
                            closeOnOverlayClick: drawer.dataset.drawerCloseOnOverlay !== 'false',
                            closeOnEscape: drawer.dataset.drawerCloseOnEscape !== 'false',
                            focusTrap: drawer.dataset.drawerFocusTrap !== 'false',
                            autoFocus: drawer.dataset.drawerAutoFocus !== 'false',
                            preventBodyScroll: drawer.dataset.drawerPreventBodyScroll !== 'false'
                        };
                        new Drawer(drawer, options);
                    }
                });
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
