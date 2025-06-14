const axios = require('axios');
const cheerio = require('cheerio');

exports.scrapeTerms = async (url) => {
  try {
    // Fetch the webpage
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    
    // Try to find common terms and conditions sections
    const selectors = [
      'a[href*="terms"]',
      'a[href*="conditions"]',
      'a[href*="tos"]',
      'a[href*="terms-of-service"]',
      'footer a',
      '.footer a'
    ];

    let termsLinks = [];
    
    for (const selector of selectors) {
      $(selector).each((i, el) => {
        const href = $(el).attr('href');
        if (href && !termsLinks.includes(href)) {
          termsLinks.push(href);
        }
      });
    }

    // Convert relative URLs to absolute
    termsLinks = termsLinks.map(link => {
      if (link.startsWith('http')) return link;
      if (link.startsWith('/')) return new URL(link, url).href;
      return new URL(`/${link}`, url).href;
    });

    // Try to get content from the first terms link
    if (termsLinks.length > 0) {
      const termsUrl = termsLinks[0];
      const termsResponse = await axios.get(termsUrl);
      const terms$ = cheerio.load(termsResponse.data);
      
      // Get all text content
      let termsText = terms$('body').text();
      
      // Clean up the text
      termsText = termsText.replace(/\s+/g, ' ').trim();
      
      return {
        url: termsUrl,
        text: termsText.substring(0, 10000) // Limit to first 10k chars
      };
    }

    throw new Error('Could not find terms and conditions on this page');
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape terms and conditions');
  }
};