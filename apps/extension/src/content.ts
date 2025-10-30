// PaiperSum Browser Extension - Auto-detect and analyze ToS popups
// This runs on every webpage and automatically scans Terms of Service

(async () => {
  // Domains to skip (sensitive sites)
  const SKIP_DOMAINS = ['bank', 'paypal', 'gmail', 'chase', 'wellsfargo', 'bankofamerica', 'password', 'login']
  const hostname = window.location.hostname
  if (SKIP_DOMAINS.some(domain => hostname.includes(domain))) {
    console.log('[PaiperSum] Skipping sensitive domain')
    return
  }

  const API_URL = localStorage.getItem('PAIPERSUM_API') || 'https://api.paipersum.com'
  
  // Track analyzed popups to avoid duplicates
  const analyzedPopups = new Set<string>()

  // Create floating widget (always visible)
  function createFloatingWidget() {
    const widget = document.createElement('div')
    widget.id = 'paipersum-widget'
    widget.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    `
    
    // Minimized button
    widget.innerHTML = `
      <button id="ps-trigger" style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <div id="ps-badge" style="
          position: absolute;
          top: -4px;
          right: -4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ff4444;
          color: white;
          font-size: 12px;
          font-weight: bold;
          display: none;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          animation: pulse 2s infinite;
        ">0</div>
      </button>
      
      <style>
        #ps-trigger:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    `
    
    document.body.appendChild(widget)
    return widget
  }

  // Create analysis panel
  function createAnalysisPanel() {
    const panel = document.createElement('div')
    panel.id = 'ps-panel'
    panel.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 420px;
      max-width: calc(100vw - 40px);
      max-height: 80vh;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      z-index: 2147483647;
      animation: slideIn 0.3s ease;
      overflow: hidden;
    `
    
    panel.innerHTML = `
      <div style="
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <div style="font-weight: bold; font-size: 18px;">PaiperSum</div>
            <div style="font-size: 12px; opacity: 0.9;">Contract Protection</div>
          </div>
        </div>
        <button id="ps-close" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div id="ps-content" style="
        padding: 20px;
        overflow-y: auto;
        flex: 1;
        font-size: 14px;
        color: #1a1a1a;
      ">
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #333;">
            I'm watching for Terms of Service
          </div>
          <div style="font-size: 14px; color: #666; line-height: 1.6;">
            When you see a "Terms of Service" or "Privacy Policy" popup, I'll automatically analyze it and tell you what you're agreeing to.
          </div>
          <div style="margin-top: 20px; padding: 12px; background: #f0f7ff; border-radius: 8px; font-size: 13px; color: #0066cc;">
            💡 I'm always watching, but you won't see me unless there's something important.
          </div>
        </div>
      </div>
      
      <div style="
        padding: 16px 20px;
        background: #fef3cd;
        border-top: 1px solid #ddd;
        font-size: 11px;
        color: #856404;
        text-align: center;
        line-height: 1.4;
      ">
        ⚠️ <strong>Not legal advice.</strong> This is automated analysis. Always read the actual terms and consult a lawyer for important decisions.
      </div>
    `
    
    document.body.appendChild(panel)
    return panel
  }

  // Initialize UI
  const widget = createFloatingWidget()
  const panel = createAnalysisPanel()
  const trigger = document.getElementById('ps-trigger')!
  const closeBtn = document.getElementById('ps-close')!
  const badge = document.getElementById('ps-badge')!
  const content = document.getElementById('ps-content')!

  // Toggle panel
  trigger.addEventListener('click', () => {
    const isVisible = panel.style.display === 'flex'
    panel.style.display = isVisible ? 'none' : 'flex'
  })

  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none'
  })

  // Detect ToS popups
  const TOS_KEYWORDS = [
    'terms of service',
    'terms and conditions',
    'privacy policy',
    'cookie policy',
    'user agreement',
    'terms of use',
    'acceptable use',
    'end user license',
    'eula',
    'by continuing',
    'by clicking accept',
    'i agree to',
    'i accept'
  ]

  // Common ToS popup selectors
  const TOS_SELECTORS = [
    '[class*="cookie"]',
    '[class*="consent"]',
    '[class*="terms"]',
    '[class*="privacy"]',
    '[class*="modal"]',
    '[class*="popup"]',
    '[class*="banner"]',
    '[id*="cookie"]',
    '[id*="consent"]',
    '[id*="terms"]',
    '[id*="privacy"]',
    'dialog',
    '[role="dialog"]',
    '[role="alertdialog"]'
  ]

  // Check if element contains ToS text
  function isToSElement(element: Element): boolean {
    const text = element.textContent?.toLowerCase() || ''
    return TOS_KEYWORDS.some(keyword => text.includes(keyword)) && text.length > 100
  }

  // Extract ToS text from element
  function extractToSText(element: Element): string {
    // Try to find the main text container
    const textElements = element.querySelectorAll('p, div, span')
    let fullText = ''
    
    textElements.forEach(el => {
      const text = el.textContent?.trim()
      if (text && text.length > 50) {
        fullText += text + ' '
      }
    })
    
    // Fallback to element's full text
    if (!fullText) {
      fullText = element.textContent || ''
    }
    
    // Clean up
    fullText = fullText.replace(/\s+/g, ' ').trim()
    
    // Limit to 50KB
    return fullText.slice(0, 50000)
  }

  // Analyze ToS text
  async function analyzeToS(text: string, elementId: string) {
    if (analyzedPopups.has(elementId)) return
    analyzedPopups.add(elementId)

    // Show loading
    content.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="
          width: 60px;
          height: 60px;
          border: 4px solid #e0e0e0;
          border-top-color: #667eea;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        "></div>
        <div style="font-weight: 600; margin-bottom: 8px;">Analyzing Terms...</div>
        <div style="font-size: 13px; color: #666;">This will take a moment</div>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `

    // Show panel and badge
    panel.style.display = 'flex'
    badge.style.display = 'flex'
    badge.textContent = '!'

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, doc_type: 'software_tos' })
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      displayAnalysis(data)
      
      // Update badge
      badge.textContent = data.clauses.filter((c: any) => c.risk === 'red' || c.risk === 'yellow').length.toString()
      
    } catch (error) {
      content.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">😕</div>
          <div style="font-weight: 600; margin-bottom: 8px; color: #d32f2f;">
            Analysis Failed
          </div>
          <div style="font-size: 13px; color: #666; margin-bottom: 20px;">
            Couldn't analyze this document. It might be too long or formatted unusually.
          </div>
          <button onclick="this.parentElement.parentElement.innerHTML = ''" style="
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          ">Try Again</button>
        </div>
      `
    }
  }

  // Display analysis results
  function displayAnalysis(data: any) {
    const { risk_score, clauses, recommendation } = data
    
    // Risk color
    let riskColor = '#4caf50'
    let riskLabel = 'Low Risk'
    let riskEmoji = '✅'
    
    if (risk_score >= 70) {
      riskColor = '#f44336'
      riskLabel = 'High Risk'
      riskEmoji = '🚨'
    } else if (risk_score >= 40) {
      riskColor = '#ff9800'
      riskLabel = 'Medium Risk'
      riskEmoji = '⚠️'
    }

    // Decision color and message
    let decisionColor = '#4caf50'
    let decisionText = 'Safe to Accept'
    let decisionIcon = '✅'
    
    if (recommendation.decision === 'walk_away') {
      decisionColor = '#f44336'
      decisionText = 'DON\'T ACCEPT'
      decisionIcon = '🚫'
    } else if (recommendation.decision === 'negotiate') {
      decisionColor = '#ff9800'
      decisionText = 'Be Careful'
      decisionIcon = '⚠️'
    }

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <!-- Risk Score -->
        <div style="
          padding: 20px;
          background: linear-gradient(135deg, ${riskColor}15, ${riskColor}08);
          border-radius: 12px;
          border: 2px solid ${riskColor}40;
          margin-bottom: 16px;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-size: 14px; font-weight: 600; color: #333;">
              ${riskEmoji} Risk Level
            </div>
            <div style="
              font-size: 24px;
              font-weight: bold;
              color: ${riskColor};
            ">${risk_score}</div>
          </div>
          <div style="
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
          ">
            <div style="
              height: 100%;
              background: ${riskColor};
              width: ${risk_score}%;
              transition: width 1s ease;
            "></div>
          </div>
          <div style="
            margin-top: 8px;
            font-size: 12px;
            color: #666;
          ">${riskLabel}</div>
        </div>

        <!-- Decision -->
        <div style="
          padding: 16px;
          background: ${decisionColor}15;
          border-radius: 12px;
          border-left: 4px solid ${decisionColor};
          margin-bottom: 16px;
        ">
          <div style="
            font-size: 16px;
            font-weight: bold;
            color: ${decisionColor};
            margin-bottom: 8px;
          ">
            ${decisionIcon} ${decisionText}
          </div>
          <div style="font-size: 13px; color: #666; line-height: 1.5;">
            ${recommendation.reasoning}
          </div>
        </div>

        <!-- Key Issues -->
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 600; margin-bottom: 12px; color: #333;">
            ${clauses.length} Key Issues Found:
          </div>
          ${clauses.slice(0, 5).map((clause: any) => `
            <div style="
              padding: 12px;
              background: ${clause.risk === 'red' ? '#ffebee' : clause.risk === 'yellow' ? '#fff3e0' : '#f1f8e9'};
              border-radius: 8px;
              margin-bottom: 8px;
              border-left: 3px solid ${clause.risk === 'red' ? '#f44336' : clause.risk === 'yellow' ? '#ff9800' : '#8bc34a'};
            ">
              <div style="
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 4px;
                color: #333;
                display: flex;
                align-items: center;
                gap: 6px;
              ">
                <span>${clause.risk === 'red' ? '🚨' : clause.risk === 'yellow' ? '⚠️' : '✓'}</span>
                ${clause.title}
              </div>
              <div style="font-size: 12px; color: #666; line-height: 1.4;">
                ${clause.summary}
              </div>
              ${clause.impact ? `
                <div style="
                  margin-top: 6px;
                  font-size: 11px;
                  color: #999;
                  font-style: italic;
                ">Impact: ${clause.impact}</div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Actions -->
        <div style="
          padding: 16px;
          background: #f5f5f5;
          border-radius: 12px;
        ">
          <div style="font-weight: 600; margin-bottom: 12px; font-size: 13px; color: #333;">
            What You Should Do:
          </div>
          ${recommendation.action_items.slice(0, 3).map((item: string, i: number) => `
            <div style="
              display: flex;
              gap: 8px;
              margin-bottom: 8px;
              font-size: 12px;
              line-height: 1.5;
            ">
              <span style="
                min-width: 20px;
                height: 20px;
                background: #667eea;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 11px;
              ">${i + 1}</span>
              <span style="color: #555;">${item}</span>
            </div>
          `).join('')}
        </div>

        <!-- Full Analysis Button -->
        <a href="https://paipersum.com?ref=extension" target="_blank" style="
          display: block;
          margin-top: 16px;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
          Get Full Analysis & Templates →
        </a>
      </div>
    `
  }

  // Scan page for ToS popups
  function scanForToS() {
    TOS_SELECTORS.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          if (isToSElement(element)) {
            // Generate unique ID for this element
            const elementId = `${selector}-${element.className}-${element.id}`
            
            if (!analyzedPopups.has(elementId)) {
              console.log('[PaiperSum] Found ToS popup:', selector)
              const text = extractToSText(element)
              
              if (text.length > 200) {
                analyzeToS(text, elementId)
              }
            }
          }
        })
      } catch (e) {
        // Selector might not be valid, skip
      }
    })
  }

  // Watch for new popups (MutationObserver)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          const element = node as Element
          
          // Check if it's a ToS element
          if (isToSElement(element)) {
            const elementId = `mutation-${Date.now()}`
            const text = extractToSText(element)
            
            if (text.length > 200) {
              console.log('[PaiperSum] Detected new ToS popup via mutation')
              setTimeout(() => analyzeToS(text, elementId), 500)
            }
          }
          
          // Check children
          TOS_SELECTORS.forEach(selector => {
            try {
              const children = element.querySelectorAll(selector)
              children.forEach(child => {
                if (isToSElement(child)) {
                  const elementId = `child-${Date.now()}-${Math.random()}`
                  const text = extractToSText(child)
                  
                  if (text.length > 200) {
                    console.log('[PaiperSum] Detected ToS in new element')
                    setTimeout(() => analyzeToS(text, elementId), 500)
                  }
                }
              })
            } catch (e) {
              // Invalid selector
            }
          })
        }
      })
    })
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // Initial scan
  setTimeout(scanForToS, 1000)
  setTimeout(scanForToS, 3000) // Some sites load ToS later
  setTimeout(scanForToS, 5000)

  // Periodic scan (every 10 seconds)
  setInterval(scanForToS, 10000)

  console.log('[PaiperSum] Extension loaded and watching for Terms of Service 👀')
})()
