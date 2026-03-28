# 🔍 AI Misinformation Detector

> AI-powered misinformation detector that analyzes text, URLs, images, PDFs, and documents for credibility. Uses Google Gemini 2.5 Flash with real-time web search to fact-check claims, detect red flags, and educate users. Supports 10+ Indian languages, shareable results, and analysis history.

<img width="1886" height="1015" alt="Screenshot 2026-03-28 233508" src="https://github.com/user-attachments/assets/61a75542-5022-4738-8ba3-ae29922366b9" />

<img width="1041" height="1005" alt="Screenshot 2026-03-28 233735" src="https://github.com/user-attachments/assets/a37add27-82c5-48fe-a189-c1b4dcb03874" />

<img width="1436" height="930" alt="Screenshot 2026-03-28 234410" src="https://github.com/user-attachments/assets/6e4dee5f-1899-4863-84a5-6e86d311b331" />

<img width="1429" height="985" alt="Screenshot 2026-03-28 234617" src="https://github.com/user-attachments/assets/e33373ca-6e26-4706-b606-8818fcc022fb" />

<img width="1270" height="934" alt="Screenshot 2026-03-28 222859" src="https://github.com/user-attachments/assets/bdd40319-eb7b-4cb2-a3b5-a0370fb98839" />

---

## ✨ Features

- **Multi-input analysis** — Text, URLs, Images, PDFs, DOCX, XLSX, PPTX, TXT, CSV
- **Real-time web search** — Verifies claims against live web results using SerpAPI
- **Credibility scoring** — 0–100 trust score with verdict (Likely True / Likely False / etc.)
- **Red flag detection** — Identifies manipulation techniques and misleading patterns
- **India language support** — Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi, Urdu
- **Shareable results** — Unique URLs for every analysis result
- **Analysis history** — MongoDB-powered history with delete support
- **Multiple image upload** — Analyze up to 5 images at once
- **Educational tips** — Teaches users how to spot misinformation

---

## 🖥️ Screenshots

### Main Interface
> Futuristic dark UI with animated particle background and AI robot mascot

### Analysis Result
> Credibility score circle, verdict badge, red flags, sources used, and language toggle

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS3 Animations |
| Backend | Node.js, Express.js |
| AI Model | Google Gemini 2.5 Flash |
| Web Search | SerpAPI |
| Database | MongoDB Atlas |
| File Processing | Multer, Mammoth, JSZip, XLSX |
| Fonts | Orbitron, Rajdhani (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (free)
- Google Gemini API key
- SerpAPI key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ai-misinfo-detector.git
cd ai-misinfo-detector
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
SERP_API_KEY=your_serpapi_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

Start the backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
npm start
```

**4. Open the app**

Visit `http://localhost:3000` in your browser.

---

## 🔑 API Keys Setup

### Google Gemini API
1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **"Create API key"**
3. Copy and add to `.env` as `GEMINI_API_KEY`

### SerpAPI
1. Go to [https://serpapi.com](https://serpapi.com)
2. Sign up for free (100 searches/month)
3. Copy your API key and add to `.env` as `SERP_API_KEY`

### MongoDB Atlas
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Go to **Network Access** → Add IP → Allow from anywhere
4. Go to **Database Access** → Create a user
5. Go to **Connect** → Drivers → Copy connection string
6. Add to `.env` as `MONGODB_URI`

---

## 📁 Project Structure

```
ai-misinfo-detector/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── models/
│   │   │   └── Analysis.js        # MongoDB schema
│   │   ├── routes/
│   │   │   ├── analyze.js         # Text analysis endpoint
│   │   │   ├── analyzeUrl.js      # URL scraping endpoint
│   │   │   ├── upload.js          # File upload endpoint
│   │   │   └── history.js         # History endpoints
│   │   ├── services/
│   │   │   ├── geminiService.js   # Gemini AI integration
│   │   │   ├── searchService.js   # SerpAPI integration
│   │   │   ├── scraperService.js  # URL scraper
│   │   │   └── extractService.js  # File text extraction
│   │   └── index.js               # Express server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analyzer.js        # Main input component
│   │   │   ├── ResultCard.js      # Analysis result display
│   │   │   ├── History.js         # History list component
│   │   │   └── SharePage.js       # Shared result page
│   │   ├── App.js                 # Main app with routing
│   │   └── App.css                # Futuristic UI styles
│   └── package.json
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze text content |
| POST | `/api/analyze-url` | Scrape and analyze a URL |
| POST | `/api/upload` | Upload and analyze a file |
| POST | `/api/upload/multiple` | Upload multiple images |
| GET | `/api/history` | Get analysis history |
| GET | `/api/history/:id` | Get single analysis by ID |
| DELETE | `/api/history/:id` | Delete an analysis |

---

## 🇮🇳 India Language Support

The tool can detect and analyze content in:

| Language | Script |
|----------|--------|
| Hindi | देवनागरी |
| Tamil | தமிழ் |
| Telugu | తెలుగు |
| Bengali | বাংলা |
| Marathi | मराठी |
| Kannada | ಕನ್ನಡ |
| Malayalam | മലയാളം |
| Gujarati | ગુજરાતી |
| Punjabi | ਪੰਜਾਬੀ |
| Urdu | اردو |

Results are displayed in both English and the detected language with a toggle button.

---

## 🔒 Security Notes

- Never commit your `.env` file
- The `.gitignore` excludes all sensitive files
- API keys are stored only in environment variables
- File uploads are deleted after processing

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Built With ❤️ for combating misinformation in India

> This project was built as part of a hackathon challenge to develop innovative AI-powered solutions using Google Cloud to combat misinformation in India.
