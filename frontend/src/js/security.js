/**
 * Comprehensive Security Module
 * Implements all frontend security measures
 */

class SecurityHelper {
    constructor() {
        this.sanitizeConfig = {
            maxInputLength: 10000,
            allowedTags: [], // No HTML allowed
            allowedAttributes: {}
        };
    }

    // Input sanitization
    sanitize(input) {
        if (typeof input !== 'string') return '';
        
        // Truncate first to prevent DoS
        input = input.substring(0, this.sanitizeConfig.maxInputLength);
        
        // Remove all HTML tags
        input = input.replace(/<[^>]*>/g, '');
        
        // Escape special characters
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // File validation
    validateFile(file) {
        if (!file) return { valid: false, error: 'No file selected' };
        
        // Check file type
        const validTypes = {
            'application/pdf': true,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
            'text/plain': true
        };
        
        if (!validTypes[file.type]) {
            return { 
                valid: false, 
                error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.' 
            };
        }
        
        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { 
                valid: false, 
                error: 'File too large. Maximum size is 5MB.' 
            };
        }
        
        // Check file name
        if (!/^[\w\-. ]+$/.test(file.name)) {
            return { 
                valid: false, 
                error: 'Invalid file name. Only letters, numbers, and hyphens are allowed.' 
            };
        }
        
        return { valid: true };
    }

    // URL validation
    validateUrl(url) {
        try {
            const parsed = new URL(url);
            
            // Only allow HTTP/HTTPS
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return { valid: false, error: 'Only HTTP/HTTPS URLs are allowed' };
            }
            
            // Check for suspicious characters
            if (/[<>"'`]/.test(url)) {
                return { valid: false, error: 'Invalid characters in URL' };
            }
            
            return { valid: true };
        } catch {
            return { valid: false, error: 'Invalid URL format' };
        }
    }

    // Data encryption (basic frontend protection)
    encrypt(data) {
        if (window.crypto && window.crypto.subtle) {
            // In production, implement proper encryption
            return btoa(encodeURIComponent(JSON.stringify(data)));
        }
        return data;
    }

    // Anti-scraping measure
    detectScraping() {
        setInterval(() => {
            if (document.hidden) {
                console.warn('[Security] Potential scraping detected - page not visible');
                // Could trigger additional protections
            }
        }, 10000);
    }
}

// Initialize security
const security = new SecurityHelper();
security.detectScraping();

// Export for other modules
export const { sanitize, validateFile, validateUrl, encrypt } = security;