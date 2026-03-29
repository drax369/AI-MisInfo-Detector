const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeURL(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, footer, header, iframe, ads, .ad, .advertisement, .sidebar').remove();

    // Try to get article content from common article selectors
    let content = '';

    const selectors = [
      'article',
      '[role="main"]',
      '.article-body',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-body',
      '.news-content',
      'main',
    ];

    for (const selector of selectors) {
      const el = $(selector);
      if (el.length > 0) {
        content = el.text().trim();
        break;
      }
    }

    // Fallback to body text
    if (!content || content.length < 100) {
      content = $('body').text().trim();
    }

    // Clean up whitespace
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 3000); // limit to 3000 chars

    if (content.length < 50) {
      throw new Error('Could not extract meaningful content from URL');
    }

    // Get page title
    const title = $('title').text().trim() ||
                  $('h1').first().text().trim() ||
                  'Article';

    return { title, content, url };

  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Could not reach the URL. Please check if it is valid.');
    }
    if (error.response?.status === 403) {
      throw new Error('Access denied by the website. Try copying the article text directly.');
    }
    if (error.response?.status === 404) {
      throw new Error('Page not found. Please check the URL.');
    }
    throw new Error(error.message || 'Failed to scrape URL');
  }
}

module.exports = { scrapeURL };