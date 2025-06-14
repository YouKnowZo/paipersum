class AIDisclaimer {
  constructor() {
    this.showOnFirstVisit = true;
    this.init();
  }

  init() {
    if (!localStorage.getItem('aiDisclaimerSeen') && this.showOnFirstVisit) {
      this.createPopup();
    }
  }

  createPopup() {
    const popup = document.createElement('div');
    popup.id = 'ai-disclaimer-popup';
    popup.className = 'fixed bottom-4 right-4 z-50 max-w-xs bg-gray-800 border border-yellow-400 rounded-lg shadow-xl p-4 transform transition-all duration-300 translate-y-0 opacity-100';
    popup.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0 text-yellow-400 mt-0.5">
          <i class="fas fa-robot text-lg"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-white">AI-Generated Content</h3>
          <div class="mt-1 text-xs text-gray-300">
            <p>This response contains AI-generated suggestions. Please verify all legal content with a qualified attorney.</p>
          </div>
          <div class="mt-3 flex space-x-3">
            <button id="disclaimer-understand" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded">
              I Understand
            </button>
            <a href="/legal.html#ai-disclaimer" class="text-xs text-yellow-400 hover:text-yellow-300">
              Learn More
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    document.getElementById('disclaimer-understand').addEventListener('click', () => {
      localStorage.setItem('aiDisclaimerSeen', 'true');
      popup.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => popup.remove(), 300);
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new AIDisclaimer();
});