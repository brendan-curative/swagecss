/**
 * Centralized Data Manager for Baseline Visit Prototype
 * Handles all localStorage operations with error handling, validation, and versioning
 */

class DataManager {
  constructor() {
    this.STORAGE_KEY = 'baselineVisitData';
    this.RESOURCES_KEY = 'selectedResources';
    this.VERSION = '1.0.0';
    this.data = this.loadData();
  }

  /**
   * Get the default data structure
   */
  getDefaultData() {
    return {
      version: this.VERSION,
      lastModified: new Date().toISOString(),
      providers: {
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
      },
      facilities: {
        'urgent-care': {
          name: 'Westside Urgent Care',
          address: '1234 Main Street',
          city: 'Los Angeles, CA 90210',
          visits: 2
        },
        'emergency': {
          name: 'Cedars-Sinai Medical Center',
          address: '8700 Beverly Blvd',
          city: 'West Hollywood, CA 90048'
        },
        'virtual-urgent-care': {
          name: 'Curative Telehealth',
          description: 'Telehealth is a great option for when you want care from the comfort of your home.',
          visits: 5
        }
      },
      pharmacy: {
        name: 'CVS Pharmacy',
        address: '123 Main Street, Los Angeles, CA 90210'
      },
      medications: [
        {
          name: "Metformin 500mg",
          instructions: "Take one tablet by mouth twice daily with meals",
          copay: "$10",
          limits: "90-day supply limit"
        },
        {
          name: "Lisinopril 10mg",
          instructions: "Take one tablet by mouth once daily",
          copay: "$5",
          limits: "30-day supply limit"
        }
      ],
      screenings: [
        {
          id: 'blood-pressure',
          name: 'Blood Pressure',
          lastCompleted: '2024-01-15',
          isDue: false
        },
        {
          id: 'cholesterol',
          name: 'Cholesterol',
          lastCompleted: '2023-06-20',
          isDue: true
        },
        {
          id: 'diabetes',
          name: 'Diabetes Screening (A1C)',
          lastCompleted: '2024-02-10',
          isDue: false
        },
        {
          id: 'colorectal',
          name: 'Colorectal Cancer Screening',
          lastCompleted: 'Never',
          isDue: true
        },
        {
          id: 'mammogram',
          name: 'Mammogram',
          lastCompleted: '2023-11-05',
          isDue: false
        }
      ],
      healthServices: [],
      proceduresPlanned: null,
      procedures: {
        major: false,
        outpatient: false,
        diagnostic: false,
        preventive: false,
        other: false,
        none: false
      },
      otherText: '',
      support: {
        metabolic: {
          bloodPressure: false,
          diabetes: false,
          heartDisease: false
        },
        respiratory: {
          asthma: false,
          copd: false
        },
        behavioral: {
          weightManagement: false,
          substanceUse: false,
          mentalHealth: false
        },
        specialized: {
          pregnancy: false,
          cancerScreening: false
        },
        other: false,
        otherText: ''
      },
      barriers: {
        selected: '',
        comments: ''
      },
      appointmentType: ''
    };
  }

  /**
   * Load data from localStorage with error handling
   */
  loadData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all properties exist
        const defaults = this.getDefaultData();
        const merged = this.deepMerge(defaults, parsed);
        // Update version if needed
        if (!merged.version || merged.version !== this.VERSION) {
          merged.version = this.VERSION;
        }
        return merged;
      }
      return this.getDefaultData();
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      console.warn('Using default data due to error');
      return this.getDefaultData();
    }
  }

  /**
   * Save data to localStorage with error handling
   */
  saveData(data = null) {
    try {
      const dataToSave = data || this.data;
      dataToSave.lastModified = new Date().toISOString();
      dataToSave.version = this.VERSION;

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      if (data) {
        this.data = dataToSave;
      }
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        alert('Storage limit reached. Please clear some data or contact support.');
      } else {
        console.error('Error saving data to localStorage:', error);
        alert('Failed to save data. Please try again.');
      }
      return false;
    }
  }

  /**
   * Get all data
   */
  getData() {
    return this.data;
  }

  /**
   * Update specific section of data
   */
  updateData(key, value) {
    this.data[key] = value;
    return this.saveData();
  }

  /**
   * Deep merge two objects
   */
  deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  /**
   * Check if value is an object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Reset data to defaults
   */
  resetData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.RESOURCES_KEY);
      this.data = this.getDefaultData();
      return true;
    } catch (error) {
      console.error('Error resetting data:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate data structure (basic validation)
   */
  validateData(data) {
    const required = ['providers', 'facilities', 'pharmacy', 'medications',
                     'screenings', 'healthServices', 'procedures', 'support',
                     'barriers', 'appointmentType'];
    return required.every(key => key in data);
  }
}

// Create and export singleton instance
const dataManager = new DataManager();

// Make it globally available for backward compatibility
if (typeof window !== 'undefined') {
  window.dataManager = dataManager;
}
