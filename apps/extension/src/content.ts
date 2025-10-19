(async () => {
  const root = document.createElement('div')
  root.id = 'paipersum-panel'
  Object.assign(root.style, { position:'fixed', top:'12px', right:'12px', zIndex:'2147483647' })
  document.body.appendChild(root)

  const panel = document.createElement('div')
  panel.style.cssText = 'background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.1);width:360px;max-height:60vh;overflow:auto;font:14px system-ui, sans-serif;'
  panel.innerHTML = `
    <div style="padding:12px 14px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
      <strong>PaiperSum</strong>
      <button id="ps-close" style="border:none;background:transparent;font-size:16px">×</button>
    </div>
    <div style="padding:12px">
      <button id="ps-analyze" style="background:#0f4c81;color:#fff;border:none;padding:8px 10px;border-radius:8px">Analyze this page</button>
      <div id="ps-result" style="margin-top:10px;color:#374151"></div>
    </div>`
  root.appendChild(panel)

  document.getElementById('ps-close')?.addEventListener('click',()=> root.remove())
  document.getElementById('ps-analyze')?.addEventListener('click', async ()=>{
    const text = document.body.innerText.slice(0, 20000)
    const api = (localStorage.getItem('PAIPERSUM_API')||'http://localhost:8000') + '/analyze'
    const res = await fetch(api, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) })
    const data = await res.json()
    const riskColor = data.risk_score>=75?'#c62828':data.risk_score>=50?'#f9a825':'#2e7d32'
    ;(document.getElementById('ps-result') as HTMLElement).innerHTML = `
      <div style="margin:8px 0">Risk: <b>${data.risk_score}</b></div>
      <div style="height:8px;background:#eee;border-radius:6px;overflow:hidden"><div style="width:${data.risk_score}%;height:8px;background:${riskColor}"></div></div>
      <div style="margin-top:8px;font-size:13px">Found clauses:</div>
      <ul style="padding-left:16px;margin:6px 0">${data.clauses.map((c: any)=>`<li><b>${c.title}</b> — ${c.summary}</li>`).join('')}</ul>`
  })
})()