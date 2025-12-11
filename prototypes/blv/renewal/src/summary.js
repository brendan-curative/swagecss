// Summary Page JavaScript for BLV Prototype
// Displays saved data from localStorage in the summary section

class BaselineVisitPrototype {
    constructor() {
        this.userData = {};
        this.loadUserData();
    }

    loadUserData() {
        const saved = localStorage.getItem('baselineVisitData');
        if (saved) {
            this.userData = JSON.parse(saved);
        } else {
            // Load default data if nothing is saved
            this.userData = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            providers: {
                primary: {
                    pcpProviders: [
                        { name: 'Dr. Sarah Johnson', specialty: 'Family Medicine', status: 'in-network' }
                    ],
                    otherProviders: [
                        { name: 'Dr. Michael Chen', specialty: 'Cardiology', status: 'in-network' },
                        { name: 'Dr. Emily Rodriguez', specialty: 'Endocrinology', status: 'cash-card' }
                    ]
                }
            },
            facilities: {
                'urgent-care': {
                    name: 'Curative Urgent Care - Downtown',
                    address: '123 Main Street',
                    city: 'Los Angeles, CA 90012'
                },
                'emergency': {
                    name: 'LA General Hospital',
                    address: '456 Hospital Road',
                    city: 'Los Angeles, CA 90015'
                },
                'virtual-urgent-care': {
                    name: 'Curative Virtual Care',
                    description: '24/7 virtual urgent care available'
                }
            },
            pharmacy: {
                name: 'CVS Pharmacy',
                address: '123 Main Street, Los Angeles, CA 90210'
            },
            medications: [
                { name: 'Lisinopril 10mg', instructions: 'Once daily', copay: '$0', limits: 'None' },
                { name: 'Metformin 500mg', instructions: 'Twice daily with meals', copay: '$30', limits: 'Quantity limit = 60/30 days' },
                { name: 'Atorvastatin 20mg', instructions: 'Once daily at bedtime', copay: 'Not covered', limits: 'Prior authorization required', priorAuthStatus: 'Granted through Jan 1, 2026' }
            ],
            screenings: [
                { name: 'Blood Pressure Check', lastCompleted: '3 months ago', isDue: false },
                { name: 'Cholesterol Screening', lastCompleted: '1 year ago', isDue: false },
                { name: 'Diabetes Screening', lastCompleted: 'Never', isDue: true },
                { name: 'Colorectal Cancer Screening', lastCompleted: '2 years ago', isDue: true }
            ],
            healthServices: [
                { name: 'Annual Physical Exam', date: 'March 2024' },
                { name: 'Flu Shot', date: 'October 2024' }
            ],
            proceduresPlanned: true,
            procedures: {
                major: false,
                outpatient: true,
                diagnostic: true,
                preventive: false,
                other: false,
                none: false
            },
            support: {
                metabolic: {
                    bloodPressure: true,
                    diabetes: true,
                    heartDisease: false
                },
                respiratory: {
                    asthma: false,
                    copd: false
                },
                behavioral: {
                    weightManagement: true,
                    substanceUse: false,
                    mentalHealth: false
                },
                specialized: {
                    pregnancy: false,
                    cancerScreening: true
                },
                other: false,
                otherText: ''
            },
            barriers: {
                selected: 'Transportation',
                comments: 'Need assistance with rides to appointments'
            },
            appointmentType: 'virtual'
        };
    }
}

// Global instance
const prototype = new BaselineVisitPrototype();

// Display providers in summary
function displayProviders() {
    const container = document.getElementById('providers-summary');
    if (!container) return;

    const providersData = prototype.userData.providers;

    // If no providers data exists, show empty state
    if (!providersData || !providersData.primary) {
        container.innerHTML = `
            <p class="body-md text-gray-600">No providers saved yet.</p>
        `;
        return;
    }

    const primary = providersData.primary;
    const pcpProviders = primary.pcpProviders || [];
    const otherProviders = primary.otherProviders || [];

    // If no providers at all
    if (pcpProviders.length === 0 && otherProviders.length === 0) {
        container.innerHTML = `
            <p class="body-md text-gray-600">No providers saved yet.</p>
        `;
        return;
    }

    let html = '';

    // Display PCP providers
    if (pcpProviders.length > 0) {
        html += '<h4 class="heading-md mb-16">Primary Care Provider:</h4>';
        pcpProviders.forEach(provider => {
            html += createProviderTileHTML(provider);
        });
    }

    // Display other providers
    if (otherProviders.length > 0) {
        html += '<h4 class="heading-md mb-16 mt-24">Specialists, Therapists, or Other Clinicians:</h4>';
        otherProviders.forEach(provider => {
            html += createProviderTileHTML(provider);
        });
    }

    container.innerHTML = html;
}

// Create provider tile HTML (read-only version without dismiss button)
function createProviderTileHTML(provider) {
    // Map status to tile class
    const tileClass = `tile--${provider.status}`;

    // Determine badge variant and text based on status
    let badgeVariant = 'success';
    let badgeText = 'In Network';
    if (provider.status === 'cash-card') {
        badgeVariant = 'warning';
        badgeText = 'Cash Card';
    } else if (provider.status === 'not-listed') {
        badgeVariant = 'info';
        badgeText = 'Not Listed';
    }

    return `
        <div class="tile ${tileClass} mb-16">
            <div class="badge badge--${badgeVariant} badge--small">
                <span class="badge__content">${badgeText}</span>
            </div>
            <div class="tile__content">
                <p class="tile__title">${provider.name}</p>
                <p class="tile__subtitle">${provider.specialty}</p>
            </div>
        </div>
    `;
}

// Display facilities in summary
function displayFacilities() {
    const container = document.getElementById('facilities-summary');
    if (!container) return;

    const facilities = prototype.userData.facilities;

    if (!facilities) {
        container.innerHTML = `<p class="body-md text-gray-600">No facilities saved yet.</p>`;
        return;
    }

    let html = '';
    let hasData = false;

    // Check each facility type
    if (facilities['urgent-care']) {
        hasData = true;
        html += `
            <div class="tile mb-16">
                <span class="tile__icon heroicon heroicon-building-office"></span>
                <div class="tile__content">
                    <p class="tile__title">${facilities['urgent-care'].name}</p>
                    <p class="tile__subtitle">${facilities['urgent-care'].address || ''}<br>${facilities['urgent-care'].city || ''}</p>
                </div>
            </div>
        `;
    }

    if (facilities['emergency']) {
        hasData = true;
        html += `
            <div class="tile mb-16">
                <span class="tile__icon heroicon heroicon-building-office"></span>
                <div class="tile__content">
                    <p class="tile__title">${facilities['emergency'].name}</p>
                    <p class="tile__subtitle">${facilities['emergency'].address || ''}<br>${facilities['emergency'].city || ''}</p>
                </div>
            </div>
        `;
    }

    if (facilities['virtual-urgent-care']) {
        hasData = true;
        html += `
            <div class="tile mb-16">
                <span class="tile__icon heroicon heroicon-device-phone-mobile"></span>
                <div class="tile__content">
                    <p class="tile__title">${facilities['virtual-urgent-care'].name}</p>
                    <p class="tile__subtitle">${facilities['virtual-urgent-care'].description || ''}</p>
                </div>
            </div>
        `;
    }

    if (!hasData) {
        container.innerHTML = `<p class="body-md text-gray-600">No facilities saved yet.</p>`;
    } else {
        container.innerHTML = html;
    }
}

// Display pharmacy in summary
function displayPharmacy() {
    const container = document.getElementById('pharmacy-summary');
    if (!container) return;

    const pharmacy = prototype.userData.pharmacy;

    if (!pharmacy) {
        container.innerHTML = `<p class="body-md text-gray-600">No pharmacy saved yet.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="tile mb-16">
            <span class="tile__icon heroicon heroicon-building-storefront"></span>
            <div class="tile__content">
                <p class="tile__title">${pharmacy.name}</p>
                <p class="tile__subtitle">${pharmacy.address || ''}</p>
            </div>
        </div>
    `;
}

// Display medications in summary
function displayMedications() {
    const container = document.getElementById('medications-summary');
    if (!container) return;

    const medications = prototype.userData.medications;

    if (!medications || medications.length === 0) {
        container.innerHTML = `<p class="body-md text-gray-600">No medications saved yet.</p>`;
        return;
    }

    let html = '';
    medications.forEach(med => {
        html += `
            <div class="tile mb-16">
                <span class="tile__icon heroicon heroicon-pill-single"></span>
                <div class="tile__content">
                    <p class="tile__title">${med.name}</p>
                    <p class="tile__subtitle">${med.instructions || ''}<br>Copay: ${med.copay || 'N/A'}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Display screenings in summary
function displayScreenings() {
    const container = document.getElementById('screenings-summary');
    if (!container) return;

    const screenings = prototype.userData.screenings;

    if (!screenings || screenings.length === 0) {
        container.innerHTML = `<p class="body-md text-gray-600">No screenings saved yet.</p>`;
        return;
    }

    let html = '';
    screenings.forEach(screening => {
        // Display the selected option text in an info badge
        const selectedText = screening.selectedOption || screening.lastCompleted || 'Not selected';

        html += `
            <div class="tile mb-16">
                <span class="tile__icon heroicon heroicon-clipboard-document-check"></span>
                <div class="tile__content">
                    <p class="tile__title">${screening.name}</p>
                </div>
                <span class="badge badge--info badge--small"><span class="badge__content">${selectedText}</span></span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Display health services in summary
function displayHealthServices() {
    const container = document.getElementById('health-services-summary');
    if (!container) return;

    const healthServices = prototype.userData.healthServices;

    if (!healthServices || healthServices.length === 0) {
        container.innerHTML = `<p class="body-md text-gray-600">No health services saved yet.</p>`;
        return;
    }

    let html = '';
    healthServices.forEach(service => {
        html += `
            <div class="tile mb-16">
                <span class="tile__icon heroicon heroicon-heart"></span>
                <div class="tile__content">
                    <p class="tile__title">${service.name}</p>
                    <p class="tile__subtitle">${service.date ? `Date: ${service.date}` : ''}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Display procedures in summary
function displayProcedures() {
    const container = document.getElementById('procedures-summary');
    if (!container) return;

    const proceduresData = prototype.userData;

    if (!proceduresData.proceduresPlanned) {
        container.innerHTML = `<p class="body-md text-gray-600">No procedures planned.</p>`;
        return;
    }

    const procedures = proceduresData.procedures;
    if (!procedures) {
        container.innerHTML = `<p class="body-md text-gray-600">No procedure details saved yet.</p>`;
        return;
    }

    let html = '<ul class="list-disc pl-24">';
    let hasData = false;

    if (procedures.major) {
        html += '<li class="mb-8">Major surgery</li>';
        hasData = true;
    }
    if (procedures.outpatient) {
        html += '<li class="mb-8">Outpatient procedure</li>';
        hasData = true;
    }
    if (procedures.diagnostic) {
        html += '<li class="mb-8">Diagnostic test</li>';
        hasData = true;
    }
    if (procedures.preventive) {
        html += '<li class="mb-8">Preventive care</li>';
        hasData = true;
    }
    if (procedures.other && proceduresData.otherText) {
        html += `<li class="mb-8">Other: ${proceduresData.otherText}</li>`;
        hasData = true;
    }
    if (procedures.none) {
        html += '<li class="mb-8">None planned</li>';
        hasData = true;
    }

    html += '</ul>';

    if (!hasData) {
        container.innerHTML = `<p class="body-md text-gray-600">No procedure details saved yet.</p>`;
    } else {
        container.innerHTML = html;
    }
}

// Display support needs in summary
function displaySupportNeeds() {
    const container = document.getElementById('support-summary');
    if (!container) return;

    const support = prototype.userData.support;

    if (!support) {
        container.innerHTML = `<p class="body-md text-gray-600">No support needs saved yet.</p>`;
        return;
    }

    let html = '<ul class="list-disc pl-24">';
    let hasData = false;

    // Metabolic conditions
    if (support.metabolic) {
        if (support.metabolic.bloodPressure) {
            html += '<li class="mb-8">Blood Pressure Management</li>';
            hasData = true;
        }
        if (support.metabolic.diabetes) {
            html += '<li class="mb-8">Diabetes Management</li>';
            hasData = true;
        }
        if (support.metabolic.heartDisease) {
            html += '<li class="mb-8">Heart Disease Management</li>';
            hasData = true;
        }
    }

    // Respiratory conditions
    if (support.respiratory) {
        if (support.respiratory.asthma) {
            html += '<li class="mb-8">Asthma Management</li>';
            hasData = true;
        }
        if (support.respiratory.copd) {
            html += '<li class="mb-8">COPD Management</li>';
            hasData = true;
        }
    }

    // Behavioral health
    if (support.behavioral) {
        if (support.behavioral.weightManagement) {
            html += '<li class="mb-8">Weight Management</li>';
            hasData = true;
        }
        if (support.behavioral.substanceUse) {
            html += '<li class="mb-8">Substance Use Support</li>';
            hasData = true;
        }
        if (support.behavioral.mentalHealth) {
            html += '<li class="mb-8">Mental Health Support</li>';
            hasData = true;
        }
    }

    // Specialized care
    if (support.specialized) {
        if (support.specialized.pregnancy) {
            html += '<li class="mb-8">Pregnancy Support</li>';
            hasData = true;
        }
        if (support.specialized.cancerScreening) {
            html += '<li class="mb-8">Cancer Screening</li>';
            hasData = true;
        }
    }

    // Other
    if (support.other && support.otherText) {
        html += `<li class="mb-8">Other: ${support.otherText}</li>`;
        hasData = true;
    }

    html += '</ul>';

    if (!hasData) {
        container.innerHTML = `<p class="body-md text-gray-600">No support needs saved yet.</p>`;
    } else {
        container.innerHTML = html;
    }
}

// Display barriers in summary
function displayBarriers() {
    const container = document.getElementById('barriers-summary');
    if (!container) return;

    const barriers = prototype.userData.barriers;

    if (!barriers || (!barriers.selected && !barriers.comments)) {
        container.innerHTML = `<p class="body-md text-gray-600">No barriers saved yet.</p>`;
        return;
    }

    let html = '';
    if (barriers.selected) {
        html += `<p class="body-md mb-8"><strong>Selected:</strong> ${barriers.selected}</p>`;
    }
    if (barriers.comments) {
        html += `<p class="body-md"><strong>Comments:</strong> ${barriers.comments}</p>`;
    }

    container.innerHTML = html;
}

// Display appointment type in summary
function displayAppointmentType() {
    const container = document.getElementById('appointment-summary');
    if (!container) return;

    const appointmentType = prototype.userData.appointmentType;

    if (!appointmentType) {
        container.innerHTML = `<p class="body-md text-gray-600">No appointment type selected yet.</p>`;
        return;
    }

    const typeLabel = appointmentType === 'virtual' ? 'Virtual Visit' : 'In-Person Visit';
    const icon = appointmentType === 'virtual' ? 'heroicon-video-camera' : 'heroicon-building-office';

    container.innerHTML = `
        <div class="tile mb-16">
            <span class="tile__icon heroicon ${icon}"></span>
            <div class="tile__content">
                <p class="tile__title">${typeLabel}</p>
            </div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Summary page JavaScript loaded');
    displayProviders();
    displayFacilities();
    displayPharmacy();
    displayMedications();
    displayScreenings();
    displayHealthServices();
    displayProcedures();
    displaySupportNeeds();
    displayAppointmentType();
});
