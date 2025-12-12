console.log('Pharmacy page JavaScript loaded - v2.0 - Using DataManager');

// Import DataManager - ensure data-manager.js is loaded first in HTML
// The dataManager instance is available globally via window.dataManager

// Helper functions to work with pharmacy data
function getPharmacy() {
    const data = window.dataManager.getData();
    return data.pharmacy;
}

function setPharmacy(pharmacy) {
    window.dataManager.updateData('pharmacy', pharmacy);
}

// Pharmacy modal state
let selectedPharmacy = null;

// Sample pharmacy database for search
const pharmacyDatabase = {
    'Austin, TX': [
        { name: 'CVS Pharmacy', address: '123 Main Street, Austin, TX 78701' },
        { name: 'Walgreens', address: '456 Oak Avenue, Austin, TX 78702' },
        { name: 'H-E-B Pharmacy', address: '789 Congress Ave, Austin, TX 78701' },
        { name: 'Costco Pharmacy', address: '321 Riverside Dr, Austin, TX 78704' }
    ],
    'Los Angeles, CA': [
        { name: 'CVS Pharmacy', address: '123 Sunset Blvd, Los Angeles, CA 90210' },
        { name: 'Rite Aid', address: '456 Hollywood Blvd, Los Angeles, CA 90028' },
        { name: 'Walgreens', address: '789 Beverly Hills Dr, Los Angeles, CA 90210' }
    ],
    'Fairfax, VA': []
};

// ========================
// PHARMACY FUNCTIONALITY
// ========================

function updatePharmacyDisplay() {
    // Check if pharmacy elements exist on this page
    const nameElement = document.getElementById('pharmacy-name');
    const addressElement = document.getElementById('pharmacy-address');
    
    // If the elements don't exist on this page, skip updating
    if (!nameElement || !addressElement) {
        return;
    }
    
    const pharmacy = getPharmacy();
    
    if (!pharmacy) {
        showPharmacyState('no-facility');
    } else if (pharmacy.type === 'none') {
        showPharmacyState('none-selected');
    } else {
        nameElement.textContent = pharmacy.name;
        addressElement.textContent = pharmacy.address;
        showPharmacyState('facility-info');
    }
}

function showPharmacyState(state) {
    const states = ['facility-info', 'no-facility', 'none-selected'];
    
    states.forEach(s => {
        const element = document.getElementById(`pharmacy-${s}`);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    const targetElement = document.getElementById(`pharmacy-${state}`);
    if (targetElement) {
        targetElement.style.display = 'block';
    }
}

function editPharmacy() {
    document.getElementById('pharmacy-search').value = '';
    document.getElementById('pharmacy-results').innerHTML = '';
    selectedPharmacy = null;
    document.getElementById('save-pharmacy-btn').style.display = 'none';
    
    openPharmacyModal();
}

function openPharmacyModal() {
    const modal = document.getElementById('pharmacy-modal');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closePharmacyModal() {
    const modal = document.getElementById('pharmacy-modal');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

function deletePharmacy(event) {
    // Find the tile element to animate
    const button = event?.target.closest('.tile__dismiss');
    const tile = button?.closest('.tile');
    
    if (tile) {
        // Add dismissing animation
        tile.classList.add('tile--dismissing');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            setPharmacy(null);
            updatePharmacyDisplay();
        }, 300); // Match animation duration
    } else {
        // Fallback if tile not found
        setPharmacy(null);
        updatePharmacyDisplay();
    }
}

function searchPharmacies() {
    const searchTerm = document.getElementById('pharmacy-search').value.trim();
    const resultsContainer = document.getElementById('pharmacy-results');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const matches = pharmacyDatabase[searchTerm] || [];
    
    let resultsHTML = '';
    
    if (matches.length === 0) {
        resultsHTML = `
            <div class="text-center p-32 text-gray-600">
                <h4 class="text-xl mb-16">No pharmacies found in "${searchTerm}"</h4>
                <p class="text-sm mb-16">We couldn't find any pharmacies in your area.</p>
                <button onclick="selectPharmacyOption('none')" class="button button--primary">
                    None of these work for me
                </button>
            </div>
        `;
    } else {
        resultsHTML = `
            <div class="mb-16">
                <h4 class="text-md font-semibold mb-16">Pharmacies near "${searchTerm}":</h4>
                <div class="border border-gray-200 rounded overflow-hidden">
        `;
        
        matches.forEach((pharmacy, index) => {
            const isLast = index === matches.length - 1;
            resultsHTML += `
                <div class="p-16 ${!isLast ? 'border-b border-gray-200' : ''} cursor-pointer hover:bg-gray-50" onclick='selectPharmacyOption(${JSON.stringify(pharmacy.name)}, ${JSON.stringify(pharmacy.address)})'>
                    <div class="font-semibold mb-4">${pharmacy.name}</div>
                    <div class="text-sm text-gray-600">${pharmacy.address}</div>
                </div>
            `;
        });
        
        resultsHTML += `
                </div>
                <div class="text-center mt-16">
                    <button onclick="selectPharmacyOption('none')" class="button button--flat text-gray-800 underline">
                        None of these work for me
                    </button>
                </div>
            </div>
        `;
    }
    
    resultsContainer.innerHTML = resultsHTML;
}

function selectPharmacyOption(pharmacyName, pharmacyAddress = null) {
    if (pharmacyName === 'none') {
        selectedPharmacy = { type: 'none' };
        document.getElementById('pharmacy-results').innerHTML = `
            <div class="bg-gray-50 border-2 border-gray-800 rounded p-16 mb-16">
                <div class="font-semibold mb-4">None selected</div>
                <div class="text-sm text-gray-600">Your Care Navigator will assist you in finding a pharmacy.</div>
            </div>
        `;
    } else {
        selectedPharmacy = { 
            type: 'facility',
            name: pharmacyName, 
            address: pharmacyAddress 
        };
        document.getElementById('pharmacy-results').innerHTML = `
            <div class="bg-gray-50 border-2 border-gray-800 rounded p-16 mb-16">
                <div class="font-semibold mb-4">${pharmacyName}</div>
                <div class="text-sm text-gray-600">${pharmacyAddress}</div>
            </div>
        `;
    }
    document.getElementById('save-pharmacy-btn').style.display = 'block';
}

function savePharmacySelection() {
    if (selectedPharmacy) {
        if (selectedPharmacy.type === 'none') {
            setPharmacy({ type: 'none' });
        } else {
            setPharmacy({
                name: selectedPharmacy.name,
                address: selectedPharmacy.address
            });
        }
        updatePharmacyDisplay();
        closePharmacyModal();
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    updatePharmacyDisplay();
    
    // Close modal when clicking on overlay
    const pharmacyModal = document.getElementById('pharmacy-modal');
    if (pharmacyModal) {
        pharmacyModal.addEventListener('click', function(event) {
            if (event.target === pharmacyModal) {
                closePharmacyModal();
            }
        });
    }
});

