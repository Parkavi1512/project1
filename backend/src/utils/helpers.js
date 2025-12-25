const crypto = require('crypto');
const path = require('path');

class Helpers {
    /**
     * Generate a random string of specified length
     * @param {number} length - Length of the random string
     * @returns {string} Random string
     */
    static generateRandomString(length = 10) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    /**
     * Generate a unique ID with timestamp
     * @returns {string} Unique ID
     */
    static generateUniqueId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${timestamp}-${random}`;
    }

    /**
     * Format date to human readable format
     * @param {Date} date - Date to format
     * @param {string} format - Format type (short, long, datetime)
     * @returns {string} Formatted date
     */
    static formatDate(date, format = 'short') {
        if (!date) return 'N/A';
        
        const d = new Date(date);
        
        if (isNaN(d.getTime())) return 'Invalid Date';
        
        const formats = {
            short: d.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            long: d.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            }),
            datetime: d.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            iso: d.toISOString(),
            time: d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        return formats[format] || formats.short;
    }

    /**
     * Calculate days between two dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} Number of days
     */
    static daysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    static truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }

    /**
     * Slugify a string (convert to URL-friendly format)
     * @param {string} text - Text to slugify
     * @returns {string} Slugified text
     */
    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    /**
     * Capitalize first letter of each word
     * @param {string} text - Text to capitalize
     * @returns {string} Capitalized text
     */
    static capitalize(text) {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     * @returns {string} Formatted currency
     */
    static formatCurrency(amount, currency = 'USD') {
        if (amount === null || amount === undefined) return 'N/A';
        
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        
        return formatter.format(amount);
    }

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sanitize input (basic XSS protection)
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized input
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Generate pagination metadata
     * @param {number} total - Total items
     * @param {number} page - Current page
     * @param {number} limit - Items per page
     * @returns {Object} Pagination metadata
     */
    static generatePagination(total, page, limit) {
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        return {
            total,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
            limit
        };
    }

    /**
     * Convert string to boolean
     * @param {string} str - String to convert
     * @returns {boolean} Boolean value
     */
    static stringToBoolean(str) {
        if (typeof str === 'boolean') return str;
        if (typeof str === 'string') {
            return str.toLowerCase() === 'true' || str === '1';
        }
        return false;
    }

    /**
     * Get file extension from filename or path
     * @param {string} filename - Filename or path
     * @returns {string} File extension
     */
    static getFileExtension(filename) {
        return path.extname(filename).toLowerCase().replace('.', '');
    }

    /**
     * Check if file is an image
     * @param {string} filename - Filename or path
     * @returns {boolean} True if image
     */
    static isImageFile(filename) {
        const ext = this.getFileExtension(filename);
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        return imageExtensions.includes(ext);
    }

    /**
     * Check if file is a document
     * @param {string} filename - Filename or path
     * @returns {boolean} True if document
     */
    static isDocumentFile(filename) {
        const ext = this.getFileExtension(filename);
        const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
        return documentExtensions.includes(ext);
    }

    /**
     * Calculate match percentage between two arrays
     * @param {Array} array1 - First array
     * @param {Array} array2 - Second array
     * @returns {number} Match percentage (0-100)
     */
    static calculateArrayMatch(array1, array2) {
        if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
            return 0;
        }
        
        const set1 = new Set(array1.map(item => item.toString().toLowerCase().trim()));
        const set2 = new Set(array2.map(item => item.toString().toLowerCase().trim()));
        
        const intersection = [...set1].filter(item => set2.has(item));
        const union = new Set([...set1, ...set2]);
        
        return Math.round((intersection.length / union.size) * 100);
    }

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Remove null/undefined properties from object
     * @param {Object} obj - Object to clean
     * @returns {Object} Cleaned object
     */
    static cleanObject(obj) {
        const cleaned = {};
        for (const key in obj) {
            if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
                cleaned[key] = obj[key];
            }
        }
        return cleaned;
    }

    /**
     * Generate skill proficiency emoji/icon
     * @param {string} proficiency - Proficiency level
     * @returns {string} Emoji/icon
     */
    static getProficiencyIcon(proficiency) {
        const icons = {
            beginner: '🟢',
            intermediate: '🟡',
            advanced: '🟠',
            expert: '🔴'
        };
        return icons[proficiency] || '⚪';
    }

    /**
     * Calculate age from birth date
     * @param {Date} birthDate - Birth date
     * @returns {number} Age
     */
    static calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Format duration (e.g., "3 months", "6 weeks")
     * @param {number} value - Duration value
     * @param {string} unit - Duration unit (weeks/months)
     * @returns {string} Formatted duration
     */
    static formatDuration(value, unit) {
        if (value === 1) {
            return `1 ${unit.slice(0, -1)}`; // Remove 's' for singular
        }
        return `${value} ${unit}`;
    }

    /**
     * Generate color based on string (for avatars, etc.)
     * @param {string} str - Input string
     * @returns {string} HEX color
     */
    static stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colors = [
            '#4F46E5', // Indigo
            '#10B981', // Emerald
            '#F59E0B', // Amber
            '#EF4444', // Red
            '#8B5CF6', // Violet
            '#EC4899', // Pink
            '#06B6D4', // Cyan
            '#84CC16', // Lime
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }

    /**
     * Get initials from name
     * @param {string} name - Full name
     * @returns {string} Initials
     */
    static getInitials(name) {
        if (!name) return '?';
        
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
    }

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Parse query string to object
     * @param {string} queryString - Query string
     * @returns {Object} Parsed object
     */
    static parseQueryString(queryString) {
        const params = new URLSearchParams(queryString);
        const result = {};
        
        for (const [key, value] of params) {
            result[key] = value;
        }
        
        return result;
    }

    /**
     * Convert object to query string
     * @param {Object} obj - Object to convert
     * @returns {string} Query string
     */
    static objectToQueryString(obj) {
        return Object.keys(obj)
            .filter(key => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    }

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if empty
     */
    static isEmptyObject(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    /**
     * Sleep/delay function
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} Promise that resolves after delay
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate a progress percentage
     * @param {number} current - Current value
     * @param {number} total - Total value
     * @returns {number} Percentage (0-100)
     */
    static calculatePercentage(current, total) {
        if (total === 0) return 0;
        return Math.round((current / total) * 100);
    }

    /**
     * Mask sensitive data (email, phone, etc.)
     * @param {string} data - Data to mask
     * @param {string} type - Type of data (email, phone, etc.)
     * @returns {string} Masked data
     */
    static maskSensitiveData(data, type = 'email') {
        if (!data) return '';
        
        switch (type) {
            case 'email':
                const [local, domain] = data.split('@');
                if (local.length <= 2) return data;
                const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
                return `${maskedLocal}@${domain}`;
                
            case 'phone':
                return data.replace(/\d(?=\d{4})/g, '*');
                
            case 'creditCard':
                return data.replace(/\d(?=\d{4})/g, '*');
                
            default:
                return data;
        }
    }

    /**
     * Sort array of objects by property
     * @param {Array} array - Array to sort
     * @param {string} property - Property to sort by
     * @param {string} order - Sort order (asc/desc)
     * @returns {Array} Sorted array
     */
    static sortByProperty(array, property, order = 'asc') {
        return array.sort((a, b) => {
            let aValue = a[property];
            let bValue = b[property];
            
            // Handle nested properties
            if (property.includes('.')) {
                const props = property.split('.');
                aValue = props.reduce((obj, prop) => obj && obj[prop], a);
                bValue = props.reduce((obj, prop) => obj && obj[prop], b);
            }
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Group array of objects by property
     * @param {Array} array - Array to group
     * @param {string} property - Property to group by
     * @returns {Object} Grouped object
     */
    static groupByProperty(array, property) {
        return array.reduce((groups, item) => {
            const key = item[property];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    }

    /**
     * Remove duplicates from array
     * @param {Array} array - Array with duplicates
     * @param {string} property - Property to check duplicates by (optional)
     * @returns {Array} Array without duplicates
     */
    static removeDuplicates(array, property = null) {
        if (!property) {
            return [...new Set(array)];
        }
        
        const seen = new Set();
        return array.filter(item => {
            const value = item[property];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
}

module.exports = Helpers;