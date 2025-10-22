// Background script for PaiperSum extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default API URL
    chrome.storage.sync.set({
      paipersum_api_url: 'http://localhost:8000'
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    // Forward analysis request to API
    analyzeDocument(request.text)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Keep message channel open for async response
  }
});

async function analyzeDocument(text: string) {
  try {
    // Get API URL from storage
    const result = await chrome.storage.sync.get(['paipersum_api_url']);
    const apiUrl = result.paipersum_api_url || 'http://localhost:8000';

    const response = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Background analysis error:', error);
    throw error;
  }
}