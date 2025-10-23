/**
 * Tile Component - Dismissible provider/service tiles
 * Handles dismiss functionality for tile components
 */

/**
 * Dismiss a tile with animation
 */
function dismissTile(tileElement) {
    if (!tileElement) return;

    // Add transition
    tileElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    tileElement.style.opacity = '0';
    tileElement.style.transform = 'translateX(20px)';

    // Remove from DOM after animation
    setTimeout(() => {
        tileElement.remove();

        // Emit custom event
        document.dispatchEvent(new CustomEvent('tile:dismissed', {
            detail: { tile: tileElement },
            bubbles: true
        }));
    }, 300);
}

/**
 * Initialize all tiles on the page
 */
function initializeTiles() {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        // Skip if already initialized
        if (tile.dataset.tileInitialized === 'true') return;

        // Mark as initialized
        tile.dataset.tileInitialized = 'true';

        // Find dismiss button
        const dismissButton = tile.querySelector('.tile__dismiss');
        if (dismissButton) {
            dismissButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dismissTile(tile);
            });
        }
    });
}

/**
 * Global utilities
 */
window.dismissTile = function(tileIdOrElement) {
    let tile;

    if (typeof tileIdOrElement === 'string') {
        tile = document.getElementById(tileIdOrElement);
    } else {
        tile = tileIdOrElement;
    }

    dismissTile(tile);
};

/**
 * Auto-initialize on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTiles);
} else {
    initializeTiles();
}

/**
 * Re-initialize on dynamic content changes
 */
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Initialize new tile
                if (node.matches('.tile') && node.dataset.tileInitialized !== 'true') {
                    const dismissButton = node.querySelector('.tile__dismiss');
                    if (dismissButton) {
                        node.dataset.tileInitialized = 'true';
                        dismissButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dismissTile(node);
                        });
                    }
                }

                // Initialize tiles within added content
                const tilesInNode = node.querySelectorAll('.tile');
                tilesInNode.forEach(tile => {
                    if (tile.dataset.tileInitialized !== 'true') {
                        tile.dataset.tileInitialized = 'true';
                        const dismissButton = tile.querySelector('.tile__dismiss');
                        if (dismissButton) {
                            dismissButton.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dismissTile(tile);
                            });
                        }
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
