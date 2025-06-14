const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Summarize this in plain language for a regular person. Be brutally clear, flag risky parts: \n\n${text}`;
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const result = completion.data.choices[0].message.content;
    res.json({ result });

  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'AI summarization failed.' });
  }
});

module.exports = router;
