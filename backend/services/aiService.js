let OpenAI, openai;
try {
  OpenAI = require('openai');
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is missing. AI features will be disabled.');
    openai = null;
  } else {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (e) {
  console.warn('OpenAI module not found or failed to load:', e);
  openai = null;
}

exports.analyzeDocument = async (text) => {
  if (!openai) {
    // Fallback for dev: return a stub response
    return '[AI DISABLED] No OpenAI API key set. Document analysis is unavailable.';
  }
  try {
    const prompt = `
    Analyze this legal document and provide:
    1. A concise plain English summary (2-3 paragraphs)
    2. Key risk factors with severity ratings (low, medium, high)
    3. Notable clauses that may be unfavorable
    4. Any potential violations of consumer protection laws
    5. A privacy shield score from 1-10 (10 being most protective)

    Document:
    ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a legal document analyzer. Provide clear, concise analysis of legal documents for non-lawyers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw new Error('Failed to analyze document');
  }
};