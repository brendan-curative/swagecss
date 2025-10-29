/**
 * Agreement Component
 * Manages agreement checkboxes and footer button state
 * Enabled via front matter: agreement-enabled: true
 */

// Global state for coordinating with other components
window.blvComponentState = window.blvComponentState || {};

function initializeAgreement() {
    // Only run if agreement is enabled
    const html = document.documentElement;
    if (!html.hasAttribute('data-agreement-enabled')) {
        return;
    }

    const agreementButtons = document.querySelectorAll('.agreement__button');
    
    if (agreementButtons.length === 0) {
        return;
    }

    // Get footer button and disable it initially
    const footerButton = document.getElementById('continue-button');
    if (footerButton) {
        footerButton.classList.add('button--big-primary-disabled');
        footerButton.setAttribute('aria-disabled', 'true');
        
        // Prevent clicks when disabled
        footerButton.addEventListener('click', function(e) {
            if (this.classList.contains('button--big-primary-disabled')) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Function to check if all agreements are checked
    function areAllAgreementsChecked() {
        return Array.from(agreementButtons).every(button => button.dataset.checked === 'true');
    }

    // Expose state to global coordinator
    window.blvComponentState.areAllAgreementsChecked = areAllAgreementsChecked;
    window.blvComponentState.agreementEnabled = true;

    // Function to update footer button based on all component states
    function updateFooterButton() {
        if (!footerButton) return;

        // Check if scrollto is also enabled
        const scrolltoEnabled = window.blvComponentState.scrolltoEnabled;
        const agreementsChecked = areAllAgreementsChecked();
        const sectionsViewed = !scrolltoEnabled || (window.blvComponentState.areAllSectionsViewed && window.blvComponentState.areAllSectionsViewed());

        // Only enable button if all conditions are met
        if (agreementsChecked && sectionsViewed) {
            footerButton.classList.remove('button--big-primary-disabled');
            footerButton.removeAttribute('aria-disabled');
        } else {
            footerButton.classList.add('button--big-primary-disabled');
            footerButton.setAttribute('aria-disabled', 'true');
        }
    }

    // Expose update function for other components to call
    window.blvComponentState.updateFooterButton = updateFooterButton;

    // Add click listeners to all agreement buttons
    agreementButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle the checkmark button state
            toggleCheckmarkButton(this);
            
            // Update footer button based on all component states
            updateFooterButton();
        });

        // Initialize ARIA attributes
        if (typeof updateAriaAttributes === 'function') {
            updateAriaAttributes(button);
        }
    });

    // Initial check in case some are pre-checked
    updateFooterButton();

    console.log('Agreement component initialized with', agreementButtons.length, 'agreement buttons');
}

