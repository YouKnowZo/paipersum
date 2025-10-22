// Popup script for PaiperSum extension
document.addEventListener('DOMContentLoaded', async () => {
  const apiUrlInput = document.getElementById('api-url') as HTMLInputElement;
  const saveConfigBtn = document.getElementById('save-config') as HTMLButtonElement;
  const configStatus = document.getElementById('config-status') as HTMLDivElement;
  const analyzeCurrentBtn = document.getElementById('analyze-current') as HTMLButtonElement;
  const openDashboardBtn = document.getElementById('open-dashboard') as HTMLButtonElement;

  // Load saved API URL
  const result = await chrome.storage.sync.get(['paipersum_api_url']);
  apiUrlInput.value = result.paipersum_api_url || 'http://localhost:8000';

  // Save configuration
  saveConfigBtn.addEventListener('click', async () => {
    const apiUrl = apiUrlInput.value.trim();
    
    if (!apiUrl) {
      showStatus('Please enter a valid API URL', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ paipersum_api_url: apiUrl });
      showStatus('Configuration saved successfully!', 'success');
    } catch (error) {
      showStatus('Failed to save configuration', 'error');
    }
  });

  // Analyze current page
  analyzeCurrentBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        showStatus('Unable to access current tab', 'error');
        return;
      }

      // Inject content script and analyze
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Trigger analysis if PaiperSum is available
          const analyzeBtn = document.getElementById('paipersum-analyze-btn') as HTMLButtonElement;
          if (analyzeBtn) {
            analyzeBtn.click();
          } else {
            // Create and trigger analysis
            const event = new CustomEvent('paipersum-analyze');
            document.dispatchEvent(event);
          }
        }
      });

      // Close popup
      window.close();
    } catch (error) {
      showStatus('Failed to analyze page', 'error');
    }
  });

  // Open dashboard
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173' });
    window.close();
  });

  function showStatus(message: string, type: 'success' | 'error') {
    configStatus.textContent = message;
    configStatus.className = `status ${type}`;
    configStatus.style.display = 'block';
    
    setTimeout(() => {
      configStatus.style.display = 'none';
    }, 3000);
  }
});