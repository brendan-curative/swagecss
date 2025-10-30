console.log('Facilities page JavaScript loaded - v1.0');

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
            facilities: {
                'urgent-care': {
                    name: 'Westside Urgent Care',
                    address: '1234 Main Street',
                    city: 'Los Angeles, CA 90210',
                    visits: 2
                },
                'emergency': null,
                'virtual-urgent-care': {
                    name: 'Curative Telehealth',
                    description: 'Telehealth is a great option for when you want care from the comfort of your home.',
                    visits: 5
                }
            }
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getFacility(facilityType) {
        return this.data.facilities[facilityType];
    }

    setFacility(facilityType, facility) {
        this.data.facilities[facilityType] = facility;
        this.saveData();
    }

    deleteFacility(facilityType) {
        this.data.facilities[facilityType] = null;
        this.saveData();
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Modal state
let currentFacilityType = '';
let selectedFacility = null;

// Sample facility database
const facilityDatabase = {
    'urgent-care': {
        'austin': [
            { name: 'Austin Emergency Center', address: '9333 Research Blvd', city: 'Austin, TX 78759', distance: '1.2 mi' },
            { name: 'NextCare Urgent Care', address: '2900 W Anderson Ln', city: 'Austin, TX 78757', distance: '2.1 mi' },
            { name: 'FastMed Urgent Care', address: '1301 S Capital of Texas Hwy', city: 'Austin, TX 78746', distance: '3.5 mi' },
            { name: 'CareNow Urgent Care', address: '11521 Research Blvd', city: 'Austin, TX 78759', distance: '4.2 mi' }
        ],
        'fairfax': [],
        'los-angeles': [
            { name: 'Westside Urgent Care', address: '1234 Main Street', city: 'Los Angeles, CA 90210', distance: '0.8 mi' },
            { name: 'Beverly Hills Urgent Care', address: '9201 Sunset Blvd', city: 'West Hollywood, CA 90069', distance: '1.5 mi' }
        ]
    },
    'emergency': {
        'austin': [
            { name: 'Dell Seton Medical Center', address: '1501 Red River St', city: 'Austin, TX 78701', distance: '2.3 mi' },
            { name: 'St. David\'s Medical Center', address: '919 E 32nd St', city: 'Austin, TX 78705', distance: '3.1 mi' },
            { name: 'Austin Regional Clinic', address: '6800 Austin Center Blvd', city: 'Austin, TX 78731', distance: '4.5 mi' }
        ],
        'fairfax': [],
        'los-angeles': [
            { name: 'Cedars-Sinai Medical Center', address: '8700 Beverly Blvd', city: 'West Hollywood, CA 90048', distance: '2.1 mi' }
        ]
    }
};

// Modal configuration
const modalConfig = {
    'urgent-care': {
        title: 'Find Your Urgent Care',
        subtitle: 'Select an Urgent Care near you:',
        reminder: 'you can go to any urgent care that shows up in our provider search!'
    },
    'emergency': {
        title: 'Find Your Emergency Department',
        subtitle: 'Select an Emergency Department near you:',
        reminder: 'you can go to any emergency facility in an emergency!'
    }
};

// Open modal to edit/add facility
function editFacility(facilityType) {
    currentFacilityType = facilityType;
    selectedFacility = null;
    
    const config = modalConfig[facilityType];
    document.getElementById('facility-modal-title').textContent = config.title;
    document.getElementById('facility-modal-subtitle').textContent = config.subtitle;
    document.getElementById('facility-modal-reminder').textContent = config.reminder;
    document.getElementById('facility-location').value = '';
    document.getElementById('facility-results').innerHTML = '';
    document.getElementById('save-facility-btn').disabled = true;
    
    openModal();
}

// Open modal
function openModal() {
    const modal = document.getElementById('facility-modal');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('facility-modal');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    currentFacilityType = '';
    selectedFacility = null;
}

// Search facilities by location
function searchFacilities() {
    const location = document.getElementById('facility-location').value.toLowerCase();
    const resultsContainer = document.getElementById('facility-results');
    
    let facilities = [];
    let resultCount = 0;
    
    // Simple search logic based on location
    if (location.includes('austin') || location.includes('texas') || location.includes('tx')) {
        facilities = facilityDatabase[currentFacilityType]['austin'] || [];
        resultCount = facilities.length;
    } else if (location.includes('fairfax') || location.includes('virginia') || location.includes('va')) {
        facilities = facilityDatabase[currentFacilityType]['fairfax'] || [];
        resultCount = facilities.length;
    } else if (location.includes('los angeles') || location.includes('la') || location.includes('california') || location.includes('ca')) {
        facilities = facilityDatabase[currentFacilityType]['los-angeles'] || [];
        resultCount = facilities.length;
    }
    
    // Display results
    let resultsHTML = `<div class="mb-16 font-semibold text-lg">${resultCount} results found</div>`;
    
    if (resultCount === 0) {
        resultsHTML += `
            <div class="bg-gray-50 rounded p-32 text-center">
                <h4 class="text-xl font-semibold mb-8">Don't worry!</h4>
                <p class="text-gray-600 mb-16">Your Care Navigator will be in touch to help you find a facility</p>
                <button onclick="saveNoResultsState()" class="button button--primary">Save this preference</button>
            </div>
        `;
    } else {
        resultsHTML += '<div class="border border-gray-200 rounded overflow-hidden">';
        
        // "None of these work for me" option
        resultsHTML += `
            <div class="p-16 border-b border-gray-200">
                <label class="flex-row flex-items-center cursor-pointer">
                    <input type="radio" name="facility-selection" value="none" onchange="selectFacilityOption('none')" class="mr-12">
                    <span class="font-semibold">None of these work for me</span>
                </label>
            </div>
        `;
        
        // Facility options
        facilities.forEach((facility, index) => {
            const isLast = index === facilities.length - 1;
            resultsHTML += `
                <div class="p-16 ${!isLast ? 'border-b border-gray-200' : ''}">
                    <label class="flex-row flex-justify-between flex-items-center cursor-pointer">
                        <div class="flex-row flex-items-center flex-1">
                            <input type="radio" name="facility-selection" value="${index}" onchange="selectFacilityOption(${index})" class="mr-12">
                            <div>
                                <div class="font-semibold text-gray-800">${facility.name}</div>
                                <div class="text-sm text-gray-600">${facility.address}</div>
                                <div class="text-sm text-gray-600">${facility.city}</div>
                            </div>
                        </div>
                        <div class="font-semibold text-gray-600">${facility.distance}</div>
                    </label>
                </div>
            `;
        });
        
        resultsHTML += '</div>';
    }
    
    resultsContainer.innerHTML = resultsHTML;
}

// Select a facility option
function selectFacilityOption(selection) {
    if (selection === 'none') {
        selectedFacility = { type: 'none' };
    } else {
        const location = document.getElementById('facility-location').value.toLowerCase();
        let facilities = [];
        
        if (location.includes('austin') || location.includes('texas') || location.includes('tx')) {
            facilities = facilityDatabase[currentFacilityType]['austin'] || [];
        } else if (location.includes('fairfax') || location.includes('virginia') || location.includes('va')) {
            facilities = facilityDatabase[currentFacilityType]['fairfax'] || [];
        } else if (location.includes('los angeles') || location.includes('la') || location.includes('california') || location.includes('ca')) {
            facilities = facilityDatabase[currentFacilityType]['los-angeles'] || [];
        }
        
        selectedFacility = facilities[selection];
    }
    
    document.getElementById('save-facility-btn').disabled = false;
}

// Save facility selection
function saveFacilitySelection() {
    if (selectedFacility) {
        if (selectedFacility.type === 'none') {
            prototype.setFacility(currentFacilityType, { type: 'none' });
        } else {
            prototype.setFacility(currentFacilityType, selectedFacility);
        }
        updateFacilityDisplay(currentFacilityType);
        closeModal();
    }
}

// Save "no results" state
function saveNoResultsState() {
    prototype.setFacility(currentFacilityType, { type: 'none' });
    updateFacilityDisplay(currentFacilityType);
    closeModal();
}

// Delete facility
function deleteFacility(facilityType, event) {
    // Find the tile element to animate
    const button = event?.target.closest('.tile__dismiss');
    const tile = button?.closest('.tile');
    
    if (tile) {
        // Add dismissing animation
        tile.classList.add('tile--dismissing');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            prototype.deleteFacility(facilityType);
            updateFacilityDisplay(facilityType);
        }, 300); // Match animation duration
    } else {
        // Fallback if tile not found
        prototype.deleteFacility(facilityType);
        updateFacilityDisplay(facilityType);
    }
}

// Update facility display on main page
function updateFacilityDisplay(facilityType) {
    const facility = prototype.getFacility(facilityType);
    
    if (!facility) {
        // Show "no facility" state
        showFacilityState(facilityType, 'no-facility');
    } else if (facility.type === 'none') {
        // Show "none selected" state
        showFacilityState(facilityType, 'none-selected');
    } else {
        // Show selected facility
        document.getElementById(`${facilityType}-name`).textContent = facility.name;
        document.getElementById(`${facilityType}-address`).textContent = `${facility.address}, ${facility.city}`;
        showFacilityState(facilityType, 'facility-info');
    }
}

// Show/hide facility states
function showFacilityState(facilityType, state) {
    const states = ['facility-info', 'no-facility', 'none-selected'];
    
    states.forEach(s => {
        const element = document.getElementById(`${facilityType}-${s}`);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    const targetElement = document.getElementById(`${facilityType}-${state}`);
    if (targetElement) {
        targetElement.style.display = 'block';
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    // Update displays for all facilities
    updateFacilityDisplay('urgent-care');
    updateFacilityDisplay('emergency');
    
    // Close modal when clicking on overlay (not dialog)
    const facilityModal = document.getElementById('facility-modal');
    if (facilityModal) {
        facilityModal.addEventListener('click', function(event) {
            if (event.target === facilityModal) {
                closeModal();
            }
        });
    }
});

