const { analyzeDocument } = require('../services/aiService');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// @desc    Analyze text
// @route   POST /api/analyze/text
// @access  Private (protected)
const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide at least 50 characters of text to analyze'
      });
    }

    const analysis = await analyzeDocument(text);
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Analyze PDF file
// @route   POST /api/analyze/pdf
// @access  Private (protected)
const analyzePdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Please upload a PDF file'
      });
    }

    const data = await pdf(req.file.buffer);
    const analysis = await analyzeDocument(data.text);
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Analyze DOCX file
// @route   POST /api/analyze/docx
// @access  Private (protected)
const analyzeDocx = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Please upload a DOCX file'
      });
    }

    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const analysis = await analyzeDocument(result.value);
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  analyzeText,
  analyzePdf,
  analyzeDocx
};