import { initUI } from './ui.js';
import { isAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    initUI();
    
    // Check auth state
    updateAuthState();
});

export const updateAuthState = () => {
    const authButton = document.getElementById('auth-button');
    const mobileAuthButton = document.getElementById('mobile-auth-button');
    
    if (isAuthenticated()) {
        authButton.textContent = 'Dashboard';
        mobileAuthButton.textContent = 'Dashboard';
    } else {
        authButton.textContent = 'Sign In';
        mobileAuthButton.textContent = 'Sign In';
    }
};
