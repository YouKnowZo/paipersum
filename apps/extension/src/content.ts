(async () => {
  // Don't inject on sensitive pages
  const hostname = window.location.hostname
  if (hostname.includes('bank') || hostname.includes('paypal') || hostname.includes('gmail')) {
    return
  }

  const root = document.createElement('div')
  root.id = 'paipersum-panel'
  Object.assign(root.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '2147483647',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  })

  const panel = document.createElement('div')
  panel.style.cssText = `
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    width: 380px;
    max-height: 70vh;
    overflow: auto;
    font-size: 14px;
  `

  panel.innerHTML = `
    <div style="padding: 14px 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #0f4c81 0%, #1565a3 100%);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 24px; height: 24px; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
          📄
        </div>
        <strong style="color: white; font-size: 15px;">PaiperSum</strong>
      </div>
      <button id="ps-close" style="border: none; background: transparent; color: white; font-size: 24px; cursor: pointer; padding: 0; line-height: 1;">×</button>
    </div>
    <div style="padding: 16px;">
      <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 13px;">
        Analyze this page for legal risks and important clauses.
      </p>
      <button id="ps-analyze" style="
        width: 100%;
        background: #0f4c81;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      " onmouseover="this.style.background='#0d3f6b'" onmouseout="this.style.background='#0f4c81'">
        🔍 Analyze This Page
      </button>
      <div id="ps-result" style="margin-top: 16px; color: #374151; font-size: 13px;"></div>
      <div style="margin-top: 12px; padding: 10px; background: #fff3cd; border-radius: 6px; font-size: 11px; color: #856404;">
        ⚠️ <strong>Not legal advice.</strong> Automated analysis for informational purposes only.
      </div>
    </div>
  `

  root.appendChild(panel)
  document.body.appendChild(root)

  // Close button
  document.getElementById('ps-close')?.addEventListener('click', () => {
    root.remove()
  })

  // Analyze button
  document.getElementById('ps-analyze')?.addEventListener('click', async () => {
    const button = document.getElementById('ps-analyze') as HTMLButtonElement
    const resultDiv = document.getElementById('ps-result') as HTMLElement

    if (!button || !resultDiv) return

    button.disabled = true
    button.textContent = '⏳ Analyzing...'

    try {
      // Get page text (limit to reasonable size)
      const text = document.body.innerText.slice(0, 50000)

      // Get API URL from storage or default
      const apiUrl = localStorage.getItem('PAIPERSUM_API') || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      // Determine risk color
      const riskScore = data.risk_score || 0
      const riskColor = riskScore >= 75 ? '#c62828' : riskScore >= 50 ? '#f9a825' : '#2e7d32'
      const riskLabel = riskScore >= 75 ? 'High Risk' : riskScore >= 50 ? 'Moderate Risk' : riskScore >= 25 ? 'Low Risk' : 'Minimal Risk'

      // Build result HTML
      resultDiv.innerHTML = `
        <div style="margin-bottom: 12px; padding: 12px; background: #f3f4f6; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #1f2937;">Risk Score</span>
            <span style="font-weight: 700; font-size: 16px; color: ${riskColor};">${riskScore}</span>
          </div>
          <div style="height: 10px; background: #e5e7eb; border-radius: 6px; overflow: hidden;">
            <div style="width: ${riskScore}%; height: 10px; background: ${riskColor}; transition: width 0.5s;"></div>
          </div>
          <div style="margin-top: 6px; text-align: center; font-size: 12px; font-weight: 600; color: ${riskColor};">
            ${riskLabel}
          </div>
        </div>

        <div style="margin-bottom: 8px;">
          <span style="font-weight: 600; color: #1f2937;">Confidence:</span>
          <span style="color: #6b7280;">${Math.round((data.confidence || 0) * 100)}%</span>
        </div>

        ${data.clauses && data.clauses.length > 0 ? `
          <div style="margin-top: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">
              Found ${data.clauses.length} clause${data.clauses.length === 1 ? '' : 's'}:
            </div>
            <div style="max-height: 300px; overflow-y: auto;">
              ${data.clauses.slice(0, 5).map((c: any) => {
                const dotColor = c.risk === 'red' ? '#c62828' : c.risk === 'yellow' ? '#f9a825' : '#2e7d32'
                return `
                  <div style="padding: 8px; margin-bottom: 6px; background: white; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${dotColor};"></span>
                      <strong style="font-size: 12px; color: #1f2937;">${c.title}</strong>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #6b7280; line-height: 1.4;">
                      ${c.summary}
                    </p>
                  </div>
                `
              }).join('')}
              ${data.clauses.length > 5 ? `
                <div style="text-align: center; margin-top: 8px; color: #6b7280; font-size: 11px;">
                  ... and ${data.clauses.length - 5} more
                </div>
              ` : ''}
            </div>
          </div>
        ` : '<p style="color: #6b7280; font-style: italic; font-size: 12px;">No significant clauses detected.</p>'}
      `

    } catch (error) {
      console.error('PaiperSum error:', error)
      resultDiv.innerHTML = `
        <div style="padding: 12px; background: #fee; border: 1px solid #fcc; border-radius: 6px; color: #c00;">
          <strong>Error:</strong> Failed to analyze page. 
          ${error instanceof Error ? error.message : 'Unknown error'}
        </div>
        <div style="margin-top: 8px; font-size: 11px; color: #6b7280;">
          Make sure the PaiperSum API is running at the configured URL.
        </div>
      `
    } finally {
      button.disabled = false
      button.textContent = '🔍 Analyze This Page'
    }
  })
})()
