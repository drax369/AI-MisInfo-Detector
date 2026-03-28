import React, { useState } from 'react';

function getScoreColor(score) {
  if (score >= 70) return '#00e5ff';
  if (score >= 40) return '#f59e0b';
  return '#ff2d78';
}

function getVerdictBg(verdict) {
  const map = {
    'Likely True': 'rgba(0,229,255,0.1)',
    'Possibly Misleading': 'rgba(245,158,11,0.1)',
    'Likely False': 'rgba(255,45,120,0.1)',
    'Satire': 'rgba(168,85,247,0.1)',
    'Unverifiable': 'rgba(100,116,139,0.1)',
  };
  return map[verdict] || 'rgba(100,116,139,0.1)';
}

function ResultCard({ result }) {
  const {
    credibilityScore, verdict, redFlags,
    explanation, explanationLocal,
    educationalTip, educationalTipLocal,
    sources, detectedLanguage
  } = result;

  const color = getScoreColor(credibilityScore);
  const isNonEnglish = detectedLanguage && detectedLanguage.toLowerCase() !== 'english';
  const [showLocal, setShowLocal] = useState(isNonEnglish);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
  if (result._id) {
    const url = `${window.location.origin}/result/${result._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } else {
    const id = Math.random().toString(36).substr(2, 9);
    localStorage.setItem(`result_${id}`, JSON.stringify(result));
    const url = `${window.location.origin}/result/local_${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
};

  return (
    <div className="result-card">
      {result.scrapedTitle && (
  <div className="scraped-info">
    <span className="scraped-label">Article analyzed</span>
    <a href={result.scrapedUrl} target="_blank" rel="noreferrer" className="scraped-title">
      {result.scrapedTitle}
    </a>
  </div>
)}
      {detectedLanguage && (
        <div className="language-badge">
          <span className="lang-dot" />
          {detectedLanguage} detected
          {isNonEnglish && (
            <button className="lang-toggle" onClick={() => setShowLocal(!showLocal)}>
              {showLocal ? 'View in English' : `View in ${detectedLanguage}`}
            </button>
          )}
        </div>
      )}

      <div className="score-circle" style={{ borderColor: color, color }}>
        <span className="score-number">{credibilityScore}</span>
        <span className="score-label">/ 100</span>
      </div>

      <div className="verdict" style={{ backgroundColor: getVerdictBg(verdict), color, border: `1px solid ${color}33` }}>
        {verdict}
      </div>

      <button className="share-btn" onClick={handleShare}>
        {copied ? '✓ Link Copied!' : '⇧ Share Result'}
      </button>

      <div className="divider" />

      <div className="section">
        <h3>Red flags detected</h3>
        {redFlags.length === 0 ? (
          <p>No red flags detected.</p>
        ) : (
          <ul>{redFlags.map((f, i) => <li key={i}>{f}</li>)}</ul>
        )}
      </div>

      <div className="divider" />

      <div className="section">
        <h3>Analysis</h3>
        <p>{showLocal && explanationLocal ? explanationLocal : explanation}</p>
      </div>

      <div className="section tip">
        <h3>Educational tip</h3>
        <p>{showLocal && educationalTipLocal ? educationalTipLocal : educationalTip}</p>
      </div>

      {sources && sources.length > 0 && (
        <>
          <div className="divider" />
          <div className="section">
            <h3>Sources used</h3>
            <ul className="sources-list">
              {sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultCard;