/**
 * Shopping List Application - Simplified JavaScript
 * Features: Modern ES6+, error handling, accessibility improvements
 */

class ShoppingListApp {
    constructor() {
        this.currentWeek = 1;
        this.weekButtons = document.querySelectorAll('.sub-btn');
        this.weekContents = document.querySelectorAll('#shopping-list .week-content');
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        try {
            this.setupEventListeners();
            this.setupKeyboardNavigation();
            this.setupAccessibility();
            this.updateWeekDisplay(this.currentWeek);
        } catch (error) {
            console.error('Error initializing shopping list app:', error);
            this.showError('Error al inicializar la aplicación');
        }
    }

    /**
     * Setup event listeners for week buttons
     */
    setupEventListeners() {
        this.weekButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const weekNumber = index + 1;
                this.showWeek(weekNumber);
            });

            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const weekNumber = index + 1;
                    this.showWeek(weekNumber);
                }
            });
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Arrow key navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                const newWeek = Math.max(1, Math.min(5, this.currentWeek + direction));
                this.showWeek(newWeek);
                this.focusWeekButton(newWeek);
            }

            // Number keys (1-5) for direct week selection
            if (e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const weekNumber = parseInt(e.key);
                this.showWeek(weekNumber);
                this.focusWeekButton(weekNumber);
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Set ARIA roles and labels
        this.weekButtons.forEach((button, index) => {
            button.setAttribute('aria-label', `Ver lista de la semana ${index + 1}`);
            button.setAttribute('role', 'tab');
        });

        this.weekContents.forEach((content, index) => {
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-labelledby', `week-btn-${index + 1}`);
        });
    }

    /**
     * Show specific week
     * @param {number} weekNum - Week number (1-5)
     */
    showWeek(weekNum) {
        try {
            if (!Number.isInteger(weekNum) || weekNum < 1 || weekNum > 5) {
                throw new Error(`Invalid week number: ${weekNum}`);
            }

            this.currentWeek = weekNum;
            this.updateWeekDisplay(weekNum);
            this.announceWeekChange(weekNum);
        } catch (error) {
            console.error('Error showing week:', error);
            this.showError('Error al cambiar de semana');
        }
    }

    /**
     * Update week display
     * @param {number} weekNum - Week number
     */
    updateWeekDisplay(weekNum) {
        // Hide all weeks
        this.weekContents.forEach((content, index) => {
            const isActive = index + 1 === weekNum;
            content.style.display = isActive ? 'block' : 'none';
            content.setAttribute('aria-hidden', !isActive);
        });

        // Update button states
        this.weekButtons.forEach((button, index) => {
            const isActive = index + 1 === weekNum;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive);
        });
    }

    /**
     * Focus on specific week button
     * @param {number} weekNum - Week number
     */
    focusWeekButton(weekNum) {
        const button = this.weekButtons[weekNum - 1];
        if (button) {
            button.focus();
        }
    }

    /**
     * Announce week change for screen readers
     * @param {number} weekNum - Week number
     */
    announceWeekChange(weekNum) {
        const announcement = `Mostrando lista de la semana ${weekNum}`;
        this.createAriaLiveRegion(announcement);
    }

    /**
     * Create or update ARIA live region for announcements
     * @param {string} message - Message to announce
     */
    createAriaLiveRegion(message) {
        let liveRegion = document.getElementById('aria-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = message;
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error(message);
        alert(message);
    }

    /**
     * Get current week
     * @returns {number} Current week number
     */
    getCurrentWeek() {
        return this.currentWeek;
    }

    /**
     * Navigate to next week
     */
    nextWeek() {
        const nextWeek = Math.min(5, this.currentWeek + 1);
        this.showWeek(nextWeek);
    }

    /**
     * Navigate to previous week
     */
    previousWeek() {
        const prevWeek = Math.max(1, this.currentWeek - 1);
        this.showWeek(prevWeek);
    }
}

/**
 * Utility functions
 */
const Utils = {
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check for required elements
        const requiredElements = ['.sub-btn', '#shopping-list .week-content'];
        const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }

        // Initialize the application
        window.shoppingListApp = new ShoppingListApp();
        
        // Additional keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const weekNum = parseInt(e.key);
                window.shoppingListApp.showWeek(weekNum);
            }
        });

        console.log('Shopping List App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Shopping List App:', error);
        
        // Fallback: show all weeks if initialization fails
        document.querySelectorAll('#shopping-list .week-content').forEach(content => {
            content.style.display = 'block';
        });
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingListApp, Utils };
}