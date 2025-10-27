const LEGAL_RULES = [
  { pattern: /indemnif(y|ication)/gi, risk: 'red', title: 'Indemnification', weight: 30 },
  { pattern: /waive|release|hold harmless/gi, risk: 'red', title: 'Waiver/Release', weight: 30 },
  { pattern: /arbitration/gi, risk: 'yellow', title: 'Arbitration', weight: 15 },
  { pattern: /class action/gi, risk: 'yellow', title: 'Class Action Waiver', weight: 15 },
  { pattern: /auto[- ]?renew/gi, risk: 'yellow', title: 'Auto-Renewal', weight: 15 },
  { pattern: /no warranties?|as is/gi, risk: 'yellow', title: 'No Warranty', weight: 12 },
  { pattern: /termination/gi, risk: 'green', title: 'Termination', weight: 5 },
];

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Rule-based analysis
    const clauses = [];
    let riskScore = 0;

    for (const rule of LEGAL_RULES) {
      const matches = text.match(rule.pattern);
      if (matches) {
        const snippet = extractSnippet(text, rule.pattern);
        clauses.push({
          title: rule.title,
          summary: getSummary(rule.title),
          risk: rule.risk,
          citation: snippet
        });
        riskScore += rule.weight;
      }
    }

    // Cap risk score at 100
    riskScore = Math.min(100, riskScore);
    
    // Calculate confidence based on findings
    const confidence = clauses.length > 0 ? 0.85 : 0.5;

    res.json({
      risk_score: riskScore,
      clauses: clauses,
      confidence: confidence
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
};

function extractSnippet(text, pattern) {
  const match = text.match(pattern);
  if (!match) return '';
  
  const index = match.index;
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + match[0].length + 100);
  
  return text.substring(start, end).trim();
}

function getSummary(title) {
  const summaries = {
    'Indemnification': 'You must defend and pay for the other party if something goes wrong.',
    'Waiver/Release': 'You give up rights to sue or recover damages.',
    'Arbitration': 'Disputes must go to arbitration instead of court.',
    'Class Action Waiver': 'You cannot join class actions.',
    'Auto-Renewal': 'The agreement renews automatically unless you cancel.',
    'No Warranty': 'The provider disclaims responsibility for quality or fitness.',
    'Termination': 'Conditions under which the agreement can be ended.',
  };
  
  return summaries[title] || 'Legal clause identified.';
}
