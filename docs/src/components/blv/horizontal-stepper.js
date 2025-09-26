// Horizontal Stepper Component JavaScript

// Global state for interactive demo
let currentStep = 0;
let totalSteps = 4;
let stepProgress = [0, 0, 0, 0]; // Track progress for each step

/**
 * Initialize horizontal stepper functionality
 */
function initializeHorizontalStepper() {
    console.log('Horizontal Stepper component initialized');
    
    // Set up any automatic steppers or animations
    const steppers = document.querySelectorAll('.horizontal-stepper');
    steppers.forEach(stepper => {
        stepper.setAttribute('role', 'progressbar');
        stepper.setAttribute('aria-label', 'Progress through workflow steps');
    });
    
    // Initialize interactive demo if present
    const interactiveStepper = document.getElementById('interactive-stepper');
    if (interactiveStepper) {
        updateInteractiveStepper();
    }
}

/**
 * Move to the next step in the interactive demo
 */
function nextStep() {
    if (currentStep < totalSteps) {
        // Complete current step if not already
        if (stepProgress[currentStep] < 100) {
            stepProgress[currentStep] = 100;
        }
        
        // Move to next step if not at the end
        if (currentStep < totalSteps - 1) {
            currentStep++;
            // Start progress on new step
            stepProgress[currentStep] = Math.max(stepProgress[currentStep], 25);
        }
        
        updateInteractiveStepper();
    }
}

/**
 * Move to the previous step in the interactive demo
 */
function prevStep() {
    if (currentStep > 0) {
        // Reset current step progress
        stepProgress[currentStep] = 0;
        currentStep--;
        updateInteractiveStepper();
    }
}

/**
 * Reset the interactive stepper to the beginning
 */
function resetStepper() {
    currentStep = 0;
    stepProgress = [0, 0, 0, 0];
    updateInteractiveStepper();
}

/**
 * Update the visual state of the interactive stepper
 */
function updateInteractiveStepper() {
    const stepper = document.getElementById('interactive-stepper');
    const currentStepDisplay = document.getElementById('current-step-display');
    const overallProgressDisplay = document.getElementById('overall-progress');
    
    if (!stepper) return;
    
    const steps = stepper.querySelectorAll('.horizontal-stepper__step');
    const progressBars = stepper.querySelectorAll('.horizontal-stepper__progress');
    
    // Update each step's progress
    steps.forEach((step, index) => {
        const progressBar = progressBars[index];
        if (progressBar) {
            const progress = stepProgress[index];
            progressBar.style.width = `${progress}%`;
            
            // Add/remove partial class based on progress
            if (progress > 0 && progress < 100) {
                progressBar.classList.add('horizontal-stepper__progress--partial');
            } else {
                progressBar.classList.remove('horizontal-stepper__progress--partial');
            }
            
            // Add animation class for smooth transitions
            progressBar.classList.add('horizontal-stepper__progress--animate');
            setTimeout(() => {
                progressBar.classList.remove('horizontal-stepper__progress--animate');
            }, 300);
        }
    });
    
    // Update display information
    if (currentStepDisplay) {
        currentStepDisplay.textContent = currentStep + 1;
    }
    
    if (overallProgressDisplay) {
        const totalProgress = stepProgress.reduce((sum, progress) => sum + progress, 0);
        const overallProgress = Math.round(totalProgress / (totalSteps * 100) * 100);
        overallProgressDisplay.textContent = `${overallProgress}%`;
    }
}

/**
 * Create a horizontal stepper programmatically
 * @param {number} stepCount - Number of steps in the stepper
 * @param {Array<number>} progress - Array of progress percentages for each step
 * @returns {HTMLElement} The created stepper element
 */
function createHorizontalStepper(stepCount = 4, progress = []) {
    const stepper = document.createElement('ol');
    stepper.className = 'horizontal-stepper';
    stepper.setAttribute('role', 'progressbar');
    stepper.setAttribute('aria-label', 'Progress through workflow steps');
    
    for (let i = 0; i < stepCount; i++) {
        const step = document.createElement('li');
        step.className = 'horizontal-stepper__step';
        
        // Add first/last classes
        if (i === 0) step.classList.add('horizontal-stepper__step--first');
        if (i === stepCount - 1) step.classList.add('horizontal-stepper__step--last');
        
        const progressBar = document.createElement('div');
        progressBar.className = 'horizontal-stepper__progress';
        
        // Set progress if provided
        const stepProgress = progress[i] || 0;
        progressBar.style.width = `${stepProgress}%`;
        
        if (stepProgress > 0 && stepProgress < 100) {
            progressBar.classList.add('horizontal-stepper__progress--partial');
        }
        
        step.appendChild(progressBar);
        stepper.appendChild(step);
    }
    
    return stepper;
}

/**
 * Update progress for a specific stepper
 * @param {HTMLElement} stepper - The stepper element
 * @param {Array<number>} progress - Array of progress percentages
 */
function updateStepperProgress(stepper, progress) {
    const progressBars = stepper.querySelectorAll('.horizontal-stepper__progress');
    
    progressBars.forEach((bar, index) => {
        if (progress[index] !== undefined) {
            bar.style.width = `${progress[index]}%`;
            
            // Update partial class
            if (progress[index] > 0 && progress[index] < 100) {
                bar.classList.add('horizontal-stepper__progress--partial');
            } else {
                bar.classList.remove('horizontal-stepper__progress--partial');
            }
        }
    });
}

/**
 * Animate stepper progress over time
 * @param {HTMLElement} stepper - The stepper element
 * @param {Array<number>} targetProgress - Target progress for each step
 * @param {number} duration - Animation duration in milliseconds
 */
function animateStepperProgress(stepper, targetProgress, duration = 1000) {
    const progressBars = stepper.querySelectorAll('.horizontal-stepper__progress');
    const startTime = Date.now();
    const initialProgress = Array.from(progressBars).map(bar => 
        parseFloat(bar.style.width) || 0
    );
    
    function updateAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        progressBars.forEach((bar, index) => {
            const start = initialProgress[index];
            const target = targetProgress[index] || 0;
            const current = start + (target - start) * easeOut;
            
            bar.style.width = `${current}%`;
            
            // Update partial class
            if (current > 0 && current < 100) {
                bar.classList.add('horizontal-stepper__progress--partial');
            } else {
                bar.classList.remove('horizontal-stepper__progress--partial');
            }
        });
        
        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        }
    }
    
    requestAnimationFrame(updateAnimation);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHorizontalStepper);
} else {
    initializeHorizontalStepper();
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.HorizontalStepper = {
        create: createHorizontalStepper,
        updateProgress: updateStepperProgress,
        animate: animateStepperProgress,
        nextStep,
        prevStep,
        resetStepper
    };
}
