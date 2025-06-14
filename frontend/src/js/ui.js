import { scrapeAndAnalyze } from './api.js';

export const initUI = () => {
    // DOM Elements
    const elements = {
        authButton: document.getElementById('auth-button'),
        authModal: document.getElementById('auth-modal'),
        analyzeUrlBtn: document.getElementById('analyze-url-btn'),
        fileUpload: document.getElementById('file-upload'),
        documentUpload: document.getElementById('document-upload'),
        analyzeTextBtn: document.getElementById('analyze-text-btn'),
        resultsModal: document.getElementById('results-modal')
    };

    // Consent Manager
    initConsentManager();

    // Event Listeners
    elements.authButton.addEventListener('click', toggleAuthModal);
    elements.analyzeUrlBtn.addEventListener('click', handleUrlAnalysis);
    elements.documentUpload.addEventListener('change', handleFileUpload);
    elements.analyzeTextBtn.addEventListener('click', handleTextAnalysis);

    // Drag and Drop
    elements.fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.fileUpload.classList.add('dragover');
    });

    elements.fileUpload.addEventListener('dragleave', () => {
        elements.fileUpload.classList.remove('dragover');
    });

    elements.fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.fileUpload.classList.remove('dragover');
        elements.documentUpload.files = e.dataTransfer.files;
        updateFileInfo(e.dataTransfer.files[0]);
    });
};

export const initConsentManager = () => {
    // Check if consent was already given
    if (!localStorage.getItem('consentGiven')) {
        showConsentModal();
    }
};

const showConsentModal = () => {
    const consentHTML = `
    <div id="consent-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div class="bg-gray-800 rounded-lg max-w-2xl w-full mx-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Your Privacy Matters</h2>
            <div class="prose prose-invert max-h-96 overflow-y-auto mb-6">
                <p>We use cookies and similar technologies to:</p>
                <ul class="list-disc pl-5">
                    <li>Provide essential functionality</li>
                    <li>Secure your account</li>
                    <li>Analyze usage (anonymous data only)</li>
                </ul>
                <p class="mt-4">By continuing, you agree to our <a href="/legal.html" class="text-indigo-400 hover:underline">Privacy Policy</a> and <a href="/legal.html" class="text-indigo-400 hover:underline">Terms of Service</a>.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <button id="accept-consent" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
                    Accept & Continue
                </button>
                <button id="reject-consent" class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md">
                    Essential Only
                </button>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', consentHTML);
    
    document.getElementById('accept-consent').addEventListener('click', () => {
        localStorage.setItem('consentGiven', 'full');
        document.getElementById('consent-modal').remove();
        initAnalytics(); // Only if they accept
    });
    
    document.getElementById('reject-consent').addEventListener('click', () => {
        localStorage.setItem('consentGiven', 'essential');
        document.getElementById('consent-modal').remove();
    });
};

const toggleAuthModal = () => {
    const authModal = document.getElementById('auth-modal');
    authModal.classList.toggle('hidden');
};

const handleUrlAnalysis = async () => {
    const urlInput = document.getElementById('analyze-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        showAlert('Please enter a valid URL', 'error');
        return;
    }

    try {
        const result = await scrapeAndAnalyze(url);
        showAnalysisResults(result);
    } catch (error) {
        showAlert(error.message, 'error');
    }
};

const handleFileUpload = (e) => {
    const file = e.target.files[0];
    updateFileInfo(file);
};

const updateFileInfo = (file) => {
    const fileInfo = document.getElementById('file-info');
    if (file) {
        fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        fileInfo.classList.remove('hidden');
    } else {
        fileInfo.classList.add('hidden');
    }
};

const showAnalysisResults = (data) => {
    // Update results modal with data
    const resultsModal = document.getElementById('results-modal');
    // Clear previous content
    resultsModal.innerHTML = '';
    // Render analysis data (assuming data is an object with keys)
    let html = `<div style="background: #232946; color: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.25); padding: 2.5em 2em; max-width: 600px; margin: 2em auto; font-family: 'Space Grotesk', Arial, sans-serif;">
        <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1.2em; color: #a3a8f0; letter-spacing: 1px; text-align: center;">AI Analysis Results</h2>`;
    if (typeof data === 'string') {
        html += `<pre style="white-space: pre-wrap; background: #181a2a; color: #e0e7ff; border-radius: 10px; padding: 1.2em; font-size: 1.1em;">${data}</pre>`;
    } else if (typeof data === 'object' && data !== null) {
        for (const [key, value] of Object.entries(data)) {
            html += `<div style="margin-bottom: 1.2em;">
                <span style="font-weight: 600; color: #a3a8f0; font-size: 1.1em;">${key}:</span><br>
                <span style="color: #e0e7ff; font-size: 1.1em;">${typeof value === 'object' ? `<pre style='background:#181a2a; border-radius:8px; padding:0.7em;'>${JSON.stringify(value, null, 2)}</pre>` : value}</span>
            </div>`;
        }
    } else {
        html += '<em>No analysis results to display.</em>';
    }
    html += `<button onclick="this.parentElement.parentElement.classList.add('hidden')" style="margin-top:2em; background: linear-gradient(90deg,#6366f1,#a3a8f0); color:#fff; border:none; border-radius:8px; padding:0.8em 2em; font-size:1.1em; font-weight:600; cursor:pointer; box-shadow:0 2px 8px rgba(99,102,241,0.15); transition:background 0.2s;">Close</button></div>`;
    resultsModal.innerHTML = html;
    resultsModal.classList.remove('hidden');
    resultsModal.style.display = 'flex';
    resultsModal.style.justifyContent = 'center';
    resultsModal.style.alignItems = 'center';
    resultsModal.style.background = 'rgba(24,26,43,0.92)';
    resultsModal.style.position = 'fixed';
    resultsModal.style.top = '0';
    resultsModal.style.left = '0';
    resultsModal.style.width = '100vw';
    resultsModal.style.height = '100vh';
    resultsModal.style.zIndex = '9999';
};

const showAlert = (message, type = 'info') => {
    // Stunning toast/alert system
    let alertBox = document.getElementById('alert-box');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'alert-box';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '32px';
        alertBox.style.right = '32px';
        alertBox.style.zIndex = '10000';
        alertBox.style.padding = '1.2em 2.5em';
        alertBox.style.borderRadius = '12px';
        alertBox.style.fontWeight = 'bold';
        alertBox.style.fontSize = '1.1em';
        alertBox.style.boxShadow = '0 4px 24px rgba(99,102,241,0.18)';
        alertBox.style.transition = 'opacity 0.3s';
        alertBox.style.opacity = '0';
        document.body.appendChild(alertBox);
    }
    alertBox.textContent = message;
    alertBox.style.background = type === 'error' ? 'linear-gradient(90deg,#dc2626,#f87171)' : (type === 'success' ? 'linear-gradient(90deg,#16a34a,#4ade80)' : 'linear-gradient(90deg,#6366f1,#a3a8f0)');
    alertBox.style.color = '#fff';
    alertBox.style.display = 'block';
    alertBox.style.opacity = '1';
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => { alertBox.style.display = 'none'; }, 400);
    }, 3500);
};
