// Content script for PaiperSum browser extension
interface PaiperSumPanel {
  element: HTMLElement;
  isVisible: boolean;
  apiUrl: string;
}

class PaiperSumExtension {
  private panel: PaiperSumPanel | null = null;
  private apiUrl: string = 'http://localhost:8000';

  constructor() {
    this.init();
  }

  private async init() {
    // Load API URL from storage
    const result = await chrome.storage.sync.get(['paipersum_api_url']);
    this.apiUrl = result.paipersum_api_url || 'http://localhost:8000';

    // Create panel
    this.createPanel();
    
    // Add analyze button to page
    this.addAnalyzeButton();
  }

  private createPanel() {
    // Remove existing panel if any
    const existing = document.getElementById('paipersum-panel');
    if (existing) {
      existing.remove();
    }

    // Create panel container
    const panel = document.createElement('div');
    panel.id = 'paipersum-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      display: none;
      overflow: hidden;
    `;

    // Create panel content
    panel.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #f9fafb;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #0f4c81; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">PS</div>
          <span style="font-weight: 600; color: #1f2937;">PaiperSum</span>
        </div>
        <button id="ps-close" style="background: none; border: none; font-size: 20px; color: #6b7280; cursor: pointer; padding: 4px;">×</button>
      </div>
      <div id="ps-content" style="padding: 16px; max-height: 60vh; overflow-y: auto;">
        <div id="ps-loading" style="display: none; text-align: center; padding: 20px;">
          <div style="width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top: 3px solid #0f4c81; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
          <p style="color: #6b7280; margin: 0;">Analyzing document...</p>
        </div>
        <div id="ps-result" style="display: none;"></div>
        <div id="ps-error" style="display: none; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626;"></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // Add to page
    document.body.appendChild(panel);

    // Set up event listeners
    const closeBtn = panel.querySelector('#ps-close') as HTMLElement;
    closeBtn.addEventListener('click', () => this.hidePanel());

    this.panel = {
      element: panel,
      isVisible: false,
      apiUrl: this.apiUrl
    };
  }

  private addAnalyzeButton() {
    // Remove existing button if any
    const existing = document.getElementById('paipersum-analyze-btn');
    if (existing) {
      existing.remove();
    }

    // Create floating analyze button
    const button = document.createElement('button');
    button.id = 'paipersum-analyze-btn';
    button.innerHTML = '🛡️ Analyze Legal Risk';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #0f4c81;
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      z-index: 2147483646;
      box-shadow: 0 4px 12px rgba(15, 76, 129, 0.3);
      transition: all 0.2s ease;
    `;

    // Add hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(15, 76, 129, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(15, 76, 129, 0.3)';
    });

    // Add click handler
    button.addEventListener('click', () => this.analyzePage());

    document.body.appendChild(button);
  }

  private async analyzePage() {
    if (!this.panel) return;

    this.showPanel();
    this.showLoading();

    try {
      // Extract text from page
      const text = this.extractPageText();
      
      if (!text.trim()) {
        this.showError('No text content found on this page. Please try a different page.');
        return;
      }

      // Call API
      const response = await fetch(`${this.apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.substring(0, 50000) }) // Limit to 50KB
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      this.showResults(data);

    } catch (error) {
      console.error('PaiperSum analysis error:', error);
      this.showError('Failed to analyze document. Please check your connection and try again.');
    }
  }

  private extractPageText(): string {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, header, footer, aside');
    scripts.forEach(el => el.remove());

    // Get main content
    const mainContent = document.querySelector('main, article, .content, #content, .main-content');
    const content = mainContent || document.body;

    // Extract text
    let text = content.innerText || content.textContent || '';

    // Clean up text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    return text;
  }

  private showPanel() {
    if (this.panel) {
      this.panel.element.style.display = 'block';
      this.panel.isVisible = true;
    }
  }

  private hidePanel() {
    if (this.panel) {
      this.panel.element.style.display = 'none';
      this.panel.isVisible = false;
    }
  }

  private showLoading() {
    const loading = document.getElementById('ps-loading');
    const result = document.getElementById('ps-result');
    const error = document.getElementById('ps-error');
    
    if (loading) loading.style.display = 'block';
    if (result) result.style.display = 'none';
    if (error) error.style.display = 'none';
  }

  private showResults(data: any) {
    const loading = document.getElementById('ps-loading');
    const result = document.getElementById('ps-result');
    const error = document.getElementById('ps-error');
    
    if (loading) loading.style.display = 'none';
    if (result) {
      result.style.display = 'block';
      result.innerHTML = this.formatResults(data);
    }
    if (error) error.style.display = 'none';
  }

  private showError(message: string) {
    const loading = document.getElementById('ps-loading');
    const result = document.getElementById('ps-result');
    const error = document.getElementById('ps-error');
    
    if (loading) loading.style.display = 'none';
    if (result) result.style.display = 'none';
    if (error) {
      error.style.display = 'block';
      error.textContent = message;
    }
  }

  private formatResults(data: any): string {
    const riskScore = data.risk_score || 0;
    const confidence = Math.round((data.confidence || 0) * 100);
    const clauses = data.clauses || [];

    // Determine risk level and color
    let riskLevel = 'Minimal';
    let riskColor = '#2e7d32'; // Green
    if (riskScore >= 75) {
      riskLevel = 'High';
      riskColor = '#c62828'; // Red
    } else if (riskScore >= 50) {
      riskLevel = 'Moderate';
      riskColor = '#f9a825'; // Yellow
    } else if (riskScore >= 25) {
      riskLevel = 'Low';
      riskColor = '#2e7d32'; // Green
    }

    let html = `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 600; color: #1f2937;">Risk Assessment</span>
          <span style="font-weight: 600; color: ${riskColor};">${riskScore}% · ${riskLevel}</span>
        </div>
        <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
          <div style="width: ${riskScore}%; height: 100%; background: ${riskColor}; transition: width 0.5s ease;"></div>
        </div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
          Confidence: ${confidence}% • Clauses: ${clauses.length}
        </div>
      </div>
    `;

    if (clauses.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px;">Key Clauses</div>
          <div style="max-height: 200px; overflow-y: auto;">
      `;

      clauses.slice(0, 5).forEach((clause: any) => {
        const dotColor = clause.risk === 'red' ? '#c62828' : 
                        clause.risk === 'yellow' ? '#f9a825' : '#2e7d32';
        
        html += `
          <div style="margin-bottom: 12px; padding: 8px; background: #f9fafb; border-radius: 6px; border-left: 3px solid ${dotColor};">
            <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">${clause.title}</div>
            <div style="font-size: 12px; color: #6b7280;">${clause.summary}</div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    html += `
      <div style="padding: 8px; background: #fef3c7; border-radius: 6px; font-size: 12px; color: #92400e;">
        <strong>⚠️ Not legal advice.</strong> This analysis is for informational purposes only.
      </div>
    `;

    return html;
  }
}

// Initialize extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PaiperSumExtension());
} else {
  new PaiperSumExtension();
}