console.log('Medications page JavaScript loaded - v1.0');

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
            pharmacy: {
                name: 'CVS Pharmacy',
                address: '123 Main Street, Los Angeles, CA 90210'
            },
            medications: [
                { name: 'Lisinopril 10mg', instructions: 'Once daily', copay: '$0', limits: 'None' },
                { name: 'Metformin 500mg', instructions: 'Twice daily with meals', copay: '$30', limits: 'Quantity limit = 60/30 days' },
                { name: 'Atorvastatin 20mg', instructions: 'Once daily at bedtime', copay: 'Not covered', limits: 'Prior authorization required', priorAuthStatus: 'Granted through Jan 1, 2026' }
            ]
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getPharmacy() {
        return this.data.pharmacy;
    }

    setPharmacy(pharmacy) {
        this.data.pharmacy = pharmacy;
        this.saveData();
    }

    getMedications() {
        return this.data.medications || [];
    }

    setMedications(medications) {
        this.data.medications = medications;
        this.saveData();
    }
}

// Initialize data
const prototype = new BaselineVisitPrototype();

// Medication modal state
let currentEditingIndex = -1;
let selectedMedication = null;

// Pharmacy modal state
let selectedPharmacy = null;

// Sample medication database for search
const medicationDatabase = [
    { name: 'Lisinopril 10mg', instructions: 'Once daily', copay: '$0', limits: 'None' },
    { name: 'Lisinopril 20mg', instructions: 'Once daily', copay: '$0', limits: 'None' },
    { name: 'Metformin 500mg', instructions: 'Twice daily with meals', copay: '$30', limits: 'Quantity limit = 60/30 days' },
    { name: 'Metformin 1000mg', instructions: 'Twice daily with meals', copay: '$30', limits: 'Quantity limit = 60/30 days' },
    { name: 'Atorvastatin 10mg', instructions: 'Once daily at bedtime', copay: 'Not covered', limits: 'Prior authorization required', priorAuthStatus: 'Granted through Jan 1, 2026' },
    { name: 'Atorvastatin 20mg', instructions: 'Once daily at bedtime', copay: 'Not covered', limits: 'Prior authorization required', priorAuthStatus: 'Granted through Jan 1, 2026' },
    { name: 'Atorvastatin 40mg', instructions: 'Once daily at bedtime', copay: 'Not covered', limits: 'Prior authorization required', priorAuthStatus: 'Granted through Jan 1, 2026' },
    { name: 'Amlodipine 5mg', instructions: 'Once daily', copay: '$0', limits: 'None' },
    { name: 'Amlodipine 10mg', instructions: 'Once daily', copay: '$0', limits: 'None' },
    { name: 'Omeprazole 20mg', instructions: 'Once daily before breakfast', copay: '$15', limits: 'None' },
    { name: 'Gabapentin 300mg', instructions: 'Three times daily', copay: '$25', limits: 'Quantity limit = 90/30 days' },
    { name: 'Sertraline 50mg', instructions: 'Once daily', copay: '$10', limits: 'None' },
    { name: 'Levothyroxine 75mcg', instructions: 'Once daily on empty stomach', copay: '$0', limits: 'None' }
];

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
// MEDICATIONS FUNCTIONALITY
// ========================

function renderMedicationsList() {
    const container = document.getElementById('medications-list');
    const medications = prototype.getMedications();
    container.innerHTML = '';
    
    medications.forEach((medication, index) => {
        // Build subtitle with all medication details
        let subtitle = medication.instructions;
        subtitle += `<br>Copay: ${medication.copay} | Limits: ${medication.limits}`;
        if (medication.priorAuthStatus) {
            subtitle += `<br>Prior Authorization: ${medication.priorAuthStatus}`;
        }
        
        const medicationHTML = `
            <div class="tile">
                <span class="tile__icon heroicon heroicon-outline-building-storefront"></span>
                <div class="tile__content">
                    <p class="tile__title">${medication.name}</p>
                    <p class="tile__subtitle">${subtitle}</p>
                </div>
                <button class="tile__dismiss" aria-label="Edit Medication" onclick="editMedication(${index})">
                    <span class="tile__dismiss-icon heroicon heroicon-16 heroicon-pencil"></span>
                </button>
                <button class="tile__dismiss" aria-label="Delete Medication" onclick="deleteMedication(${index})">
                    <span class="tile__dismiss-icon heroicon heroicon-outline-x-circle"></span>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', medicationHTML);
    });
}

function editMedication(index) {
    currentEditingIndex = index;
    const medications = prototype.getMedications();
    const medication = medications[index];
    
    document.getElementById('medication-modal-title').textContent = 'Edit Medication';
    document.getElementById('medication-search').value = medication.name;
    
    selectedMedication = { ...medication };
    
    displaySelectedMedication(medication);
    openMedicationModal();
}

function deleteMedication(index) {
    const medications = prototype.getMedications();
    medications.splice(index, 1);
    prototype.setMedications(medications);
    renderMedicationsList();
}

function addMedication() {
    currentEditingIndex = -1;
    document.getElementById('medication-modal-title').textContent = 'Add Medication';
    openMedicationModal();
}

function openMedicationModal() {
    const modal = document.getElementById('medication-modal');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    
    if (currentEditingIndex === -1) {
        resetMedicationModal();
    }
}

function closeMedicationModal() {
    const modal = document.getElementById('medication-modal');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    resetMedicationModal();
}

function resetMedicationModal() {
    if (currentEditingIndex === -1) {
        document.getElementById('medication-search').value = '';
        document.getElementById('medication-results').innerHTML = '';
        selectedMedication = null;
    }
    updateSaveMedicationButton();
}

function searchMedications() {
    const searchTerm = document.getElementById('medication-search').value.toLowerCase();
    const resultsContainer = document.getElementById('medication-results');
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const matches = medicationDatabase.filter(med => 
        med.name.toLowerCase().includes(searchTerm)
    );
    
    let resultsHTML = '';
    
    if (matches.length === 0) {
        resultsHTML = `
            <div class="text-center p-32 text-gray-600">
                <p class="mb-8">No medications found matching "${searchTerm}"</p>
                <p class="text-sm">Please try a different search term or check the spelling.</p>
            </div>
        `;
    } else {
        resultsHTML = '<div class="border border-gray-200 rounded overflow-hidden">';
        
        matches.forEach((med, index) => {
            const copayClass = med.copay === '$0' ? 'text-gray-800' : 
                             med.copay === 'Not covered' ? 'text-gray-400' : 'text-gray-600';
            
            const priorAuthHTML = med.priorAuthStatus ? 
                `<div class="mt-4 text-sm">
                    <span class="text-gray-800 font-semibold">Prior Authorization: ${med.priorAuthStatus}</span>
                </div>` : '';
            
            const isLast = index === matches.length - 1;
            
            resultsHTML += `
                <div class="p-16 ${!isLast ? 'border-b border-gray-200' : ''} cursor-pointer hover:bg-gray-50" onclick='selectMedication(${JSON.stringify(med)})'>
                    <div class="font-semibold mb-4">${med.name}</div>
                    <div class="text-sm text-gray-600 mb-4">${med.instructions}</div>
                    <div class="flex-row gap-16 text-sm">
                        <span class="${copayClass} font-semibold">Copay: ${med.copay}</span>
                        <span class="text-gray-600">Limits: ${med.limits}</span>
                    </div>
                    ${priorAuthHTML}
                </div>
            `;
        });
        
        resultsHTML += '</div>';
    }
    
    resultsContainer.innerHTML = resultsHTML;
}

function selectMedication(medication) {
    selectedMedication = { ...medication };
    document.getElementById('medication-search').value = medication.name;
    displaySelectedMedication(medication);
    updateSaveMedicationButton();
}

function displaySelectedMedication(medication) {
    const priorAuthHTML = medication.priorAuthStatus ? 
        `<div class="mt-4 text-sm">
            <span class="text-gray-800 font-semibold">Prior Authorization: ${medication.priorAuthStatus}</span>
        </div>` : '';
    
    document.getElementById('medication-results').innerHTML = `
        <div class="bg-gray-50 border-2 border-gray-800 rounded p-16 mb-16">
            <div class="font-semibold mb-4">${medication.name}</div>
            <div class="text-sm text-gray-600">${medication.instructions}</div>
            ${priorAuthHTML}
        </div>
    `;
}

function updateSaveMedicationButton() {
    const saveBtn = document.getElementById('save-medication-btn');
    saveBtn.disabled = !selectedMedication;
}

function saveMedicationSelection() {
    if (selectedMedication) {
        const medications = prototype.getMedications();
        
        if (currentEditingIndex >= 0) {
            medications[currentEditingIndex] = { ...selectedMedication };
        } else {
            medications.push({ ...selectedMedication });
        }
        
        prototype.setMedications(medications);
        renderMedicationsList();
        closeMedicationModal();
    }
}

// ========================
// PHARMACY FUNCTIONALITY
// ========================

function updatePharmacyDisplay() {
    const pharmacy = prototype.getPharmacy();
    
    if (!pharmacy) {
        showPharmacyState('no-facility');
    } else if (pharmacy.type === 'none') {
        showPharmacyState('none-selected');
    } else {
        document.getElementById('pharmacy-name').textContent = pharmacy.name;
        document.getElementById('pharmacy-address').textContent = pharmacy.address;
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

function deletePharmacy() {
    prototype.setPharmacy(null);
    updatePharmacyDisplay();
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
            prototype.setPharmacy({ type: 'none' });
        } else {
            prototype.setPharmacy({
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
    renderMedicationsList();
    updatePharmacyDisplay();
    
    // Close modals when clicking on overlay
    const medicationModal = document.getElementById('medication-modal');
    if (medicationModal) {
        medicationModal.addEventListener('click', function(event) {
            if (event.target === medicationModal) {
                closeMedicationModal();
            }
        });
    }
    
    const pharmacyModal = document.getElementById('pharmacy-modal');
    if (pharmacyModal) {
        pharmacyModal.addEventListener('click', function(event) {
            if (event.target === pharmacyModal) {
                closePharmacyModal();
            }
        });
    }
});

