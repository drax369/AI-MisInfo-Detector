const { GoogleGenerativeAI } = require('@google/generative-ai');
const { searchWeb } = require('./searchService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeContent(content) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let searchResults = [];
  let searchContext = '\nNo web search results found.';

  try {
    console.log('Searching web for:', content.slice(0, 80));
    searchResults = await searchWeb(content);
    console.log('Search results found:', searchResults.length);

    if (searchResults.length > 0) {
      searchContext = '\nHere are recent web search results related to this claim:\n' +
        searchResults.map((r, i) =>
          `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.link}`
        ).join('\n\n');
    }
  } catch (err) {
    console.error('Search failed:', err.message);
  }

  const prompt = `
You are an expert fact-checker and misinformation analyst specializing in Indian content.
You can understand and analyze content in Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi, Urdu, and English.

${searchContext}

First detect the language of the content. Then analyze it for misinformation.
Respond ONLY in this exact JSON format with no extra text:
{
  "credibilityScore": <number from 0 to 100>,
  "verdict": "<one of: Likely True, Possibly Misleading, Likely False, Satire, Unverifiable>",
  "detectedLanguage": "<detected language name in English, e.g. Hindi, Tamil, English>",
  "redFlags": ["<flag1>", "<flag2>"],
  "explanation": "<2-3 sentence explanation in English using search results as evidence>",
  "explanationLocal": "<same explanation translated to the detected language, or same as explanation if English>",
  "educationalTip": "<one practical tip in English>",
  "educationalTipLocal": "<same tip translated to the detected language, or same if English>",
  "sources": [{"title": "<source title>", "url": "<source url>"}]
}

Content to analyze:
"${content}"
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleaned = text.replace(/```json|```/g, '').trim();
const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('No valid JSON in response');
return JSON.parse(jsonMatch[0]);
}

async function analyzeImage(base64Data, mimeType) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are an expert fact-checker specializing in Indian content.
Analyze the text and content visible in this image for misinformation.
Respond ONLY in this exact JSON format with no extra text:
{
  "credibilityScore": <number from 0 to 100>,
  "verdict": "<one of: Likely True, Possibly Misleading, Likely False, Satire, Unverifiable>",
  "detectedLanguage": "<detected language>",
  "redFlags": ["<flag1>", "<flag2>"],
  "explanation": "<2-3 sentence explanation>",
  "explanationLocal": "<explanation in detected language>",
  "educationalTip": "<one practical tip>",
  "educationalTipLocal": "<tip in detected language>",
  "sources": []
}`;

  const result = await model.generateContent([
    { inlineData: { data: base64Data, mimeType } },
    prompt,
  ]);

  const response = await result.response;
  const text = response.text();
  const cleaned = text.replace(/```json|```/g, '').trim();
const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('No valid JSON in response');
return JSON.parse(jsonMatch[0]);
}

module.exports = { analyzeContent, analyzeImage };
