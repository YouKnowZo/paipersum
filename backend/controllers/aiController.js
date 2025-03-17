const Document = require('../models/Document');

// Mock AI summary generation
exports.generateSummary = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Mock AI summary
    const summary = `This is a mock summary for the document titled "${document.title}".`;

    document.aiSummary = summary;
    await document.save();

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Error generating summary', error: error.message });
  }
};
