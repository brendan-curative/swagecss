// Care Team Page JavaScript for BLV Prototype
// Handles provider management, search, and data persistence

// BaselineVisitPrototype class for data persistence
class BaselineVisitPrototype {
    constructor() {
        this.userData = {};
        this.loadUserData();
    }

    saveUserData() {
        localStorage.setItem('baselineVisitData', JSON.stringify(this.userData));
    }

    loadUserData() {
        const saved = localStorage.getItem('baselineVisitData');
        if (saved) {
            this.userData = JSON.parse(saved);
        }
    }

    clearUserData() {
        localStorage.removeItem('baselineVisitData');
        this.userData = {};
    }
}

// Global instance
const prototype = new BaselineVisitPrototype();

// Family member data structure
let familyMembers = {
    primary: {
        name: "Sarah Martinez",
        id: "123456789",
        type: "Policyholder",
        pcpProviders: [
            { name: "Dr. Sarah Johnson, MD", specialty: "Primary Care Physician", status: "in-network" }
        ],
        otherProviders: [
            { name: "Dr. Michael Rodriguez, MD", specialty: "Cardiologist", status: "cash-card" },
            { name: "Dr. Lisa Thompson, DPT", specialty: "Physical Therapist", status: "not-listed" }
        ]
    },
    child: {
        name: "Emma Martinez",
        id: "123456790", 
        type: "Dependent Child",
        pcpProviders: [
            { name: "Dr. Jennifer Park, MD", specialty: "Pediatrician", status: "in-network" }
        ],
        otherProviders: []
    }
};

let currentFamilyMember = 'primary';
let currentEditIndex = -1;
let currentEditType = 'other'; // 'pcp' or 'other'
let hasValidSelection = false;

// Mock provider database for typeahead
const providerDatabase = [
    { name: "Dr. Sarah Johnson, MD", specialty: "Primary Care Physician", location: "Los Angeles, CA", status: "in-network" },
    { name: "Dr. Emily Chen, MD", specialty: "Primary Care Physician", location: "Los Angeles, CA", status: "cash-card" },
    { name: "Dr. Jennifer Park, MD", specialty: "Pediatrician", location: "Los Angeles, CA", status: "in-network" },
    { name: "Dr. Thomas Rodriguez, MD", specialty: "Pediatrician", location: "Los Angeles, CA", status: "cash-card" },
    { name: "Dr. Michael Rodriguez, MD", specialty: "Cardiologist", location: "Los Angeles, CA", status: "cash-card" },
    { name: "Dr. Lisa Thompson, DPT", specialty: "Physical Therapist", location: "Los Angeles, CA", status: "not-listed" },
    { name: "Dr. Jennifer Lee, MD", specialty: "Dermatologist", location: "Los Angeles, CA", status: "in-network" },
    { name: "Dr. Robert Kim, MD", specialty: "Neurologist", location: "Los Angeles, CA", status: "in-network" },
    { name: "Dr. Maria Garcia, DDS", specialty: "Dentist", location: "Los Angeles, CA", status: "cash-card" },
    { name: "Dr. David Chen, MD", specialty: "Orthopedist", location: "Los Angeles, CA", status: "in-network" },
    { name: "Dr. Amanda Wilson, MD", specialty: "Psychiatrist", location: "Los Angeles, CA", status: "not-listed" }
];

// Helper functions to get current member's data
function getCurrentPCPProviders() {
    return familyMembers[currentFamilyMember].pcpProviders;
}

function getCurrentOtherProviders() {
    return familyMembers[currentFamilyMember].otherProviders;
}

// Function to switch between family members
function switchFamilyMember() {
    const selectElement = document.getElementById('family-member-select');
    currentFamilyMember = selectElement.value;
    updateAllProviderDisplays();
}

// Update save button state based on validation
function updateSaveButtonState() {
    const saveBtn = document.getElementById('save-provider-btn');
    const manualEntryVisible = !document.getElementById('manual-entry').classList.contains('hidden');
    
    if (manualEntryVisible) {
        // In manual entry mode - check if both fields are filled
        const name = document.getElementById('manual-provider-name').value.trim();
        const location = document.getElementById('manual-location').value.trim();
        saveBtn.disabled = !(name && location);
    } else {
        // In search mode - check if a provider has been selected
        saveBtn.disabled = !hasValidSelection;
    }
}

// Delete provider
function deleteProvider(index, type) {
    if (type === 'pcp') {
        getCurrentPCPProviders().splice(index, 1);
    } else {
        getCurrentOtherProviders().splice(index, 1);
    }
    updateAllProviderDisplays();
}

// Edit provider
function editProvider(index, type) {
    currentEditIndex = index;
    currentEditType = type;
    document.getElementById('modal-title').textContent = 'Edit Provider';
    
    resetModal();
    const provider = type === 'pcp' ? getCurrentPCPProviders()[index] : getCurrentOtherProviders()[index];
    document.getElementById('provider-search').value = provider.name;
    openModal();
}

// Add provider
function addProvider() {
    currentEditIndex = -1;
    currentEditType = 'other';
    document.getElementById('modal-title').textContent = 'Add Provider';
    resetModal();
    openModal();
}

// Find PCP
function findMyPCP() {
    currentEditIndex = -1;
    currentEditType = 'pcp';
    document.getElementById('modal-title').textContent = 'Find Primary Care Provider';
    resetModal();
    openModal();
}

// Reset modal to default state
function resetModal() {
    document.getElementById('provider-form').reset();
    document.getElementById('search-mode').classList.remove('hidden');
    document.getElementById('manual-entry').classList.add('hidden');
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('manual-provider-name').value = '';
    document.getElementById('manual-location').value = '';
    
    // Reset validation state
    hasValidSelection = false;
    updateSaveButtonState();
}

// Show "No PCP" message
function noPCPOption() {
    const message = document.getElementById('no-pcp-message');
    if (message) {
        message.style.display = 'flex'; // Show as flex to match alert component
    }
}

// Open modal - simple class toggle
function openModal() {
    const modal = document.getElementById('provider-modal');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

// Close modal - simple class toggle
function closeModal() {
    const modal = document.getElementById('provider-modal');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    resetModal();
}

// Show manual entry mode
function showManualEntry() {
    // Transfer the search input to the manual name field
    const searchValue = document.getElementById('provider-search').value;
    document.getElementById('manual-provider-name').value = searchValue;
    
    // Switch modes
    document.getElementById('search-mode').classList.add('hidden');
    document.getElementById('manual-entry').classList.remove('hidden');
    document.getElementById('search-results').style.display = 'none';
    
    // Reset validation state and update button
    hasValidSelection = false;
    updateSaveButtonState();
}

// Back to search mode
function backToSearch() {
    document.getElementById('search-mode').classList.remove('hidden');
    document.getElementById('manual-entry').classList.add('hidden');
    
    // Reset validation state and update button
    hasValidSelection = false;
    updateSaveButtonState();
}

// Save provider
function saveProvider() {
    const state = document.getElementById('provider-state').value;
    const name = document.getElementById('provider-search').value;
    const manualName = document.getElementById('manual-provider-name').value;
    const location = document.getElementById('manual-location').value;
    const manualEntryVisible = !document.getElementById('manual-entry').classList.contains('hidden');
    
    let providerName, specialty, status;
    
    if (manualEntryVisible) {
        // Manual entry mode
        if (!manualName || !location) {
            alert('Please fill in all required fields.');
            return;
        }
        providerName = manualName;
        specialty = currentEditType === 'pcp' ? 'Primary Care Physician' : 'Specialist';
        status = 'not-listed'; // Manual entries are treated as not-listed
    } else {
        // Search mode
        if (!state) {
            alert('Please select a state.');
            return;
        }
        if (!name) {
            alert('Please select a provider or use manual entry.');
            return;
        }
        // Find the selected provider in the database to get their info
        const selectedProvider = providerDatabase.find(p => p.name === name);
        if (selectedProvider) {
            providerName = selectedProvider.name;
            specialty = selectedProvider.specialty;
            status = selectedProvider.status;
        } else {
            providerName = name;
            specialty = currentEditType === 'pcp' ? 'Primary Care Physician' : 'Specialist';
            status = 'in-network';
        }
    }
    
    const newProvider = { name: providerName, specialty, status };
    
    if (currentEditIndex >= 0) {
        // Edit existing provider
        if (currentEditType === 'pcp') {
            getCurrentPCPProviders()[currentEditIndex] = newProvider;
        } else {
            getCurrentOtherProviders()[currentEditIndex] = newProvider;
        }
    } else {
        // Add new provider
        if (currentEditType === 'pcp') {
            getCurrentPCPProviders().push(newProvider);
        } else {
            getCurrentOtherProviders().push(newProvider);
        }
    }
    
    updateAllProviderDisplays();
    closeModal();
}

// Update all provider displays
function updateAllProviderDisplays() {
    updatePCPDisplay();
    updateOtherProvidersDisplay();
}

// Update PCP display
function updatePCPDisplay() {
    const pcpList = document.getElementById('pcp-providers-list');
    const noPCPOptions = document.getElementById('no-pcp-options');
    const noPCPMessage = document.getElementById('no-pcp-message');
    const currentPCPs = getCurrentPCPProviders();
    
    pcpList.innerHTML = '';
    
    if (currentPCPs.length === 0) {
        // No PCP providers - show the "Find PCP" and "No PCP" buttons
        if (noPCPOptions) {
            noPCPOptions.classList.remove('hidden');
        }
        // Always hide the Care Navigator message when tiles are dismissed
        // Message should only show when "I don't have a PCP" button is clicked
        if (noPCPMessage) {
            noPCPMessage.style.display = 'none';
        }
    } else {
        // Has PCP providers - hide both the options and message
        if (noPCPOptions) {
            noPCPOptions.classList.add('hidden');
        }
        if (noPCPMessage) {
            noPCPMessage.style.display = 'none';
        }
        currentPCPs.forEach((provider, index) => {
            addProviderToDisplay(provider, index, 'pcp', pcpList);
        });
    }
}

// Update other providers display
function updateOtherProvidersDisplay() {
    const otherList = document.getElementById('other-providers-list');
    const currentOthers = getCurrentOtherProviders();
    
    otherList.innerHTML = '';
    
    currentOthers.forEach((provider, index) => {
        addProviderToDisplay(provider, index, 'other', otherList);
    });
}

// Add provider to display using Tile component
function addProviderToDisplay(provider, index, type, container) {
    // Map status to tile class
    const tileClass = `tile--${provider.status}`;
    
    // Determine icon based on status
    let icon = 'check-circle';
    if (provider.status === 'not-listed') {
        icon = 'information-circle';
    }
    
    // Create tile HTML
    const tileHTML = `
        <div class="tile ${tileClass} mb-16">
            <span class="tile__icon heroicon heroicon-${icon}"></span>
            <div class="tile__content">
                <p class="tile__title">${provider.name}</p>
                <p class="tile__subtitle">${provider.specialty}</p>
            </div>
            <button class="tile__dismiss" aria-label="Delete Provider" onclick="deleteProvider(${index}, '${type}')">
                <span class="tile__dismiss-icon heroicon heroicon-outline-x-circle"></span>
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', tileHTML);
}

// Select provider from search results
function selectProvider(name, specialty) {
    document.getElementById('provider-search').value = name;
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-results').style.display = 'none';
    hasValidSelection = true;
    updateSaveButtonState();
}

// Get status badge HTML for search results
function getStatusBadgeHTML(status) {
    let badgeClass = 'status-badge';
    let label = '';
    
    switch(status) {
        case 'in-network':
            badgeClass += ' status-badge--in-network';
            label = 'In-Network';
            break;
        case 'cash-card':
            badgeClass += ' status-badge--cash-card';
            label = 'Cash Card';
            break;
        case 'not-listed':
            badgeClass += ' status-badge--not-listed';
            label = 'Not Listed';
            break;
        default:
            badgeClass += ' status-badge--in-network';
            label = 'In-Network';
    }
    
    return `<span class="${badgeClass}">${label}</span>`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Care team page JavaScript loaded - v2.0 - Using new form-modal component');
    
    // Initialize provider displays
    updateAllProviderDisplays();
    
    // Add event listeners for manual entry fields to update button state
    document.getElementById('manual-provider-name').addEventListener('input', updateSaveButtonState);
    document.getElementById('manual-location').addEventListener('input', updateSaveButtonState);
    
    // Typeahead search functionality
    document.getElementById('provider-search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const resultsContainer = document.getElementById('search-results');
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            hasValidSelection = false;
            updateSaveButtonState();
            return;
        }
        
        let matches = providerDatabase.filter(provider => 
            provider.name.toLowerCase().includes(query) ||
            provider.specialty.toLowerCase().includes(query)
        );
        
        // If in PCP mode, prioritize PCPs and show them first
        if (currentEditType === 'pcp') {
            const pcpMatches = matches.filter(p => p.specialty === 'Primary Care Physician');
            const otherMatches = matches.filter(p => p.specialty !== 'Primary Care Physician');
            matches = [...pcpMatches, ...otherMatches];
        }
        
        let resultsHTML = '';
        matches.slice(0, 5).forEach(provider => {
            const statusBadge = getStatusBadgeHTML(provider.status);
            resultsHTML += `
                <div class="search-result-item" onclick="selectProvider('${provider.name}', '${provider.specialty}')">
                    <strong>${provider.name}${statusBadge}</strong>
                    <small>${provider.specialty} • ${provider.location}</small>
                </div>
            `;
        });
        
        // Always add manual entry option
        resultsHTML += `
            <div class="search-result-item search-result-item--manual" onclick="showManualEntry()">
                <strong>Can't find your provider?</strong>
                <small>Click here to enter manually</small>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.style.display = 'block';
        hasValidSelection = false;
        updateSaveButtonState();
    });
    
    // Close modal when clicking on the overlay (not the dialog)
    const providerModal = document.getElementById('provider-modal');
    providerModal.addEventListener('click', function(event) {
        // Only close if the click is directly on the overlay, not on any child elements
        if (event.target === providerModal) {
            closeModal();
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(event) {
        const searchInput = document.getElementById('provider-search');
        const searchResults = document.getElementById('search-results');
        
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
});

