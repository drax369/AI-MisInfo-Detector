import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getScoreColor(score) {
  if (score >= 70) return '#00e5ff';
  if (score >= 40) return '#f59e0b';
  return '#ff2d78';
}

function History({ onSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://ai-misinfo-detector.onrender.com/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://ai-misinfo-detector.onrender.com/api/history/${id}`);
      setHistory(history.filter(h => h._id !== id));
    } catch (err) {
      console.error('Failed to delete');
    }
  };

  if (loading) return (
    <div className="history-loading">
      <div className="scan-bar-wrapper">
        <div className="scan-bar" />
      </div>
    </div>
  );

  if (history.length === 0) return (
    <div className="history-empty">
      <p>No analyses yet. Start by analyzing some content!</p>
    </div>
  );

  return (
    <div className="history-list">
      {history.map(item => (
        <div
          key={item._id}
          className="history-item"
          onClick={() => onSelect(item)}
        >
          <div className="history-item-left">
            <div
              className="history-score"
              style={{ color: getScoreColor(item.credibilityScore), borderColor: getScoreColor(item.credibilityScore) }}
            >
              {item.credibilityScore}
            </div>
            <div className="history-info">
              <p className="history-content">{item.content.slice(0, 60)}...</p>
              <span className="history-verdict" style={{ color: getScoreColor(item.credibilityScore) }}>
                {item.verdict}
              </span>
            </div>
          </div>
          <div className="history-item-right">
            <span className="history-date">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <button
              className="history-delete"
              onClick={(e) => handleDelete(item._id, e)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;