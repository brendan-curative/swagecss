/* #region Confetti Component */

/**
 * BLV Confetti Component
 * Celebration confetti effect triggered by button clicks
 * Uses canvas-confetti library for particle animation
 */

// Load canvas-confetti from CDN
const loadConfetti = async () => {
    if (window.confetti) {
        return window.confetti;
    }
    
    const module = await import('https://cdn.skypack.dev/canvas-confetti');
    return module.default;
};

// BLV brand colors for confetti
const BLV_COLORS = ['#FC5C50', '#00B2FF', '#074ADF'];

/**
 * Trigger confetti celebration
 * @param {Object} options - Confetti configuration
 * @param {number} options.particleCount - Number of confetti pieces (default: 150)
 * @param {number} options.angle - Launch angle in degrees (default: 90)
 * @param {number} options.spread - Spread angle in degrees (default: 70)
 * @param {Object} options.origin - Origin point {x, y} (default: center)
 */
const celebrateWithConfetti = async (options = {}) => {
    const confetti = await loadConfetti();
    
    const defaults = {
        particleCount: 150,
        angle: 90,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: BLV_COLORS,
        shapes: ['square'],
        scalar: 0.8,
        gravity: 1.2,
        drift: 0,
        ticks: 200
    };
    
    confetti({
        ...defaults,
        ...options
    });
};

/**
 * Trigger a burst of confetti
 * @param {number} particleCount - Number of particles (default: random 100-200)
 * @param {Object} options - Additional burst options
 */
const confettiBurst = async (particleCount = null, options = {}) => {
    if (!particleCount) {
        particleCount = Math.floor(Math.random() * 100) + 100; // Random 100-200
    }
    
    const defaults = {
        spread: Math.floor(Math.random() * 35) + 45, // Random 45-80
        angle: Math.floor(Math.random() * 40) + 70   // Random 70-110
    };
    
    await celebrateWithConfetti({
        particleCount,
        ...defaults,
        ...options
    });
};

/**
 * Initialize confetti on buttons with data-confetti attribute
 */
const initializeConfetti = () => {
    const confettiButtons = document.querySelectorAll('[data-confetti]');
    
    confettiButtons.forEach(button => {
        button.addEventListener('click', async (evt) => {
            const particleCount = button.dataset.confettiCount || null;
            await confettiBurst(particleCount ? parseInt(particleCount) : null);
        });
    });
};

/**
 * Check for and trigger auto-confetti on page load
 */
const initializeAutoConfetti = async () => {
    // Check for data-confetti-auto attribute on body or any element
    const autoConfettiElement = document.querySelector('[data-confetti-auto]');
    
    if (autoConfettiElement) {
        // Get configuration from data attributes
        const delay = parseInt(autoConfettiElement.dataset.confettiDelay) || 500;
        const particleCount = autoConfettiElement.dataset.confettiCount || null;
        const bursts = parseInt(autoConfettiElement.dataset.confettiBursts) || 1;
        const burstInterval = 300; // Milliseconds between bursts
        
        // Wait for initial delay, then trigger confetti burst(s)
        setTimeout(async () => {
            for (let i = 0; i < bursts; i++) {
                // Create variation in angle and spread for each burst
                let burstOptions = {};
                
                if (bursts > 1) {
                    // For multiple bursts, vary the angle and spread
                    const burstProgress = i / (bursts - 1); // 0 to 1
                    
                    // Vary angle: alternate between left (60-80°), center (85-95°), and right (100-120°)
                    if (i % 3 === 0) {
                        burstOptions.angle = Math.floor(Math.random() * 20) + 60; // Left: 60-80
                        burstOptions.spread = Math.floor(Math.random() * 20) + 50; // 50-70
                    } else if (i % 3 === 1) {
                        burstOptions.angle = Math.floor(Math.random() * 10) + 85; // Center: 85-95
                        burstOptions.spread = Math.floor(Math.random() * 30) + 60; // 60-90
                    } else {
                        burstOptions.angle = Math.floor(Math.random() * 20) + 100; // Right: 100-120
                        burstOptions.spread = Math.floor(Math.random() * 20) + 50; // 50-70
                    }
                }
                
                await confettiBurst(
                    particleCount ? parseInt(particleCount) : null,
                    burstOptions
                );
                
                // Wait between bursts (except for the last one)
                if (i < bursts - 1) {
                    await new Promise(resolve => setTimeout(resolve, burstInterval));
                }
            }
        }, delay);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeConfetti();
        initializeAutoConfetti();
    });
} else {
    initializeConfetti();
    initializeAutoConfetti();
}

// Export functions for manual usage
window.celebrateWithConfetti = celebrateWithConfetti;
window.confettiBurst = confettiBurst;

/* #endregion */

