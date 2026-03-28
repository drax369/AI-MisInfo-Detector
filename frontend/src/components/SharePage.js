import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultCard from './ResultCard';

function SharePage({ id }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (id.startsWith('local_')) {
          const stored = localStorage.getItem(`result_${id.replace('local_', '')}`);
          if (stored) {
            setResult(JSON.parse(stored));
          } else {
            setError('Analysis not found or link has expired.');
          }
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/history/${id}`);
        setResult(res.data);
      } catch (err) {
        setError('Analysis not found or link has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) return (
    <div className="share-loading">
      <div className="scan-bar-wrapper"><div className="scan-bar" /></div>
      <p className="scan-text">Loading analysis...</p>
    </div>
  );

  if (error) return (
    <div className="share-error">
      <p>⚠ {error}</p>
      <button className="analyze-btn" onClick={() => window.location.href = '/'}>
        Go to Home
      </button>
    </div>
  );

  return (
    <div className="share-page">
      <div className="share-banner">
        <span>Shared analysis from Misinfo Detector</span>
        <button className="analyze-btn share-home-btn"
          onClick={() => window.location.href = '/'}>
          Analyze your own content
        </button>
      </div>
      {result && <ResultCard result={result} />}
    </div>
  );
}

export default SharePage;