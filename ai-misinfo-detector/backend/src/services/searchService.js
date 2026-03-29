const axios = require('axios');

async function searchWeb(query) {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: process.env.SERP_API_KEY,
        num: 5,
        engine: 'google',
      },
    });

    const results = response.data.organic_results || [];
    console.log('SerpAPI results:', results.length);
    return results.map(r => ({
      title: r.title,
      snippet: r.snippet,
      link: r.link,
    }));
  } catch (error) {
    console.error('SerpAPI error:', error.message);
    return [];
  }
}

module.exports = { searchWeb };