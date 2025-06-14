const { scrapeTerms } = require('../services/scraperService');

// @desc    Scrape terms from URL
// @route   POST /api/scrape
// @access  Public
exports.scrapeAndAnalyze = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a URL'
      });
    }

    const scrapedData = await scrapeTerms(url);
    res.status(200).json({
      success: true,
      data: scrapedData
    });
  } catch (err) {
    next(err);
  }
};