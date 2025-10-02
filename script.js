/**
 * Shopping List Application - Optimized JavaScript
 * Features: Modern ES6+, error handling, accessibility improvements
 */

class ShoppingListApp {
    constructor() {
        this.currentWeek = 1;
        this.weekButtons = document.querySelectorAll('.week-btn');
        this.weekContents = document.querySelectorAll('.week-content');
        
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

            // Add keyboard support
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
            // Arrow key navigation between weeks
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                const newWeek = Math.max(1, Math.min(4, this.currentWeek + direction));
                this.showWeek(newWeek);
                this.focusWeekButton(newWeek);
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels and roles
        this.weekButtons.forEach((button, index) => {
            button.setAttribute('aria-label', `Ver lista de la semana ${index + 1}`);
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', index === 0);
        });

        // Add ARIA attributes to week content
        this.weekContents.forEach((content, index) => {
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-labelledby', `week-btn-${index + 1}`);
            content.setAttribute('id', `week${index + 1}`);
        });

        // Add IDs to buttons for proper ARIA relationships
        this.weekButtons.forEach((button, index) => {
            button.id = `week-btn-${index + 1}`;
        });
    }

    /**
     * Show selected week content
     * @param {number} weekNum - Week number (1-4)
     */
    showWeek(weekNum) {
        try {
            // Validate week number
            if (!Number.isInteger(weekNum) || weekNum < 1 || weekNum > 4) {
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
     * Create ARIA live region for announcements
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
        // Could implement user-facing error display here
        alert(message); // Simple fallback
    }

    /**
     * Get current week number
     * @returns {number} Current week
     */
    getCurrentWeek() {
        return this.currentWeek;
    }

    /**
     * Navigate to next week
     */
    nextWeek() {
        const nextWeek = Math.min(4, this.currentWeek + 1);
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
     * Debounce function for performance optimization
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
     * @param {Element} element - Element to check
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

/**
 * Initialize app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check for required elements
        const requiredElements = [
            '.week-btn',
            '.week-content'
        ];

        const missingElements = requiredElements.filter(selector => 
            !document.querySelector(selector)
        );

        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }

        // Initialize the shopping list app
        window.shoppingListApp = new ShoppingListApp();

        // Add global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + 1-4 to switch weeks
            if (e.altKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const weekNum = parseInt(e.key);
                window.shoppingListApp.showWeek(weekNum);
            }
        });

        console.log('Shopping List App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Shopping List App:', error);
        
        // Fallback: Show all weeks if JavaScript fails
        document.querySelectorAll('.week-content').forEach(content => {
            content.style.display = 'block';
        });
    }
});

/**
 * Handle page visibility changes for performance
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
        console.log('Page hidden - pausing animations');
    } else {
        // Page is visible, resume animations
        console.log('Page visible - resuming animations');
    }
});

/**
 * Export for potential module usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingListApp, Utils };
}
