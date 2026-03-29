import React, { useState, useRef } from 'react';
import axios from 'axios';
import ResultCard from './ResultCard';

const tabs = ['Text', 'URL', 'Image', 'Document'];

const FILE_TYPES = {
  Image: {
    accept: 'image/jpeg,image/png,image/webp,image/gif,image/bmp',
    extensions: '.jpg, .jpeg, .png, .webp, .gif, .bmp',
    icon: '🖼️',
    multiple: true,
  },
  Document: {
    accept: '.pdf,.doc,.docx,.xlsx,.xls,.pptx,.txt,.csv,.md,.rtf',
    extensions: '.pdf, .docx, .xlsx, .pptx, .txt, .csv, .md, .rtf',
    icon: '📄',
    multiple: false,
  },
};

function FilePreview({ files, onRemove }) {
  return (
    <div className="file-preview-list">
      {files.map((file, i) => (
        <div key={i} className="file-preview-item">
          {file.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="file-preview-img"
            />
          ) : (
            <div className="file-preview-icon">
              {file.name.endsWith('.pdf') ? '📕' :
               file.name.endsWith('.docx') || file.name.endsWith('.doc') ? '📘' :
               file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? '📗' :
               file.name.endsWith('.pptx') ? '📙' :
               file.name.endsWith('.txt') || file.name.endsWith('.md') ? '📄' :
               file.name.endsWith('.csv') ? '📊' : '📎'}
            </div>
          )}
          <div className="file-preview-info">
            <p className="file-preview-name">{file.name}</p>
            <p className="file-preview-size">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button className="file-preview-remove" onClick={() => onRemove(i)}>✕</button>
        </div>
      ))}
    </div>
  );
}

function Analyzer() {
  const [activeTab, setActiveTab] = useState('Text');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [showExtracted, setShowExtracted] = useState(false);
  const fileRef = useRef();

  const isFileTab = activeTab === 'Image' || activeTab === 'Document';
  const fileConfig = FILE_TYPES[activeTab] || {};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setContent('');
    setFiles([]);
    setResult(null);
    setResults([]);
    setError('');
    setExtractedText('');
    setShowExtracted(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (fileConfig.multiple) {
      setFiles(prev => [...prev, ...dropped].slice(0, 5));
    } else {
      setFiles([dropped[0]]);
    }
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (fileConfig.multiple) {
      setFiles(prev => [...prev, ...selected].slice(0, 5));
    } else {
      setFiles([selected[0]]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setResults([]);
    setExtractedText('');
    setShowExtracted(false);

    try {
      let response;

      if (isFileTab && files.length > 0) {
        if (activeTab === 'Image' && files.length > 1) {
          // Multiple images
          const formData = new FormData();
          files.forEach(f => formData.append('files', f));
          response = await axios.post('https://ai-misinfo-detector.onrender.com/api/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setResults(response.data.results);
          setLoading(false);
          return;
        } else {
          // Single file
          const formData = new FormData();
          formData.append('file', files[0]);
          response = await axios.post('https://ai-misinfo-detector.onrender.com/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (response.data.extractedText) {
            setExtractedText(response.data.extractedText);
          }
        }
      } else if (activeTab === 'URL' && content.trim()) {
        response = await axios.post('https://ai-misinfo-detector.onrender.com/api/analyze-url', {
          url: content.trim(),
        });
      } else if (content.trim()) {
        response = await axios.post('https://ai-misinfo-detector.onrender.com/api/analyze', { content });
      } else {
        setError('Please enter content or upload a file.');
        setLoading(false);
        return;
      }

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {isFileTab ? (
        <div>
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''} ${files.length > 0 ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept={fileConfig.accept}
              multiple={fileConfig.multiple}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            {files.length === 0 ? (
              <>
                <span className="upload-icon">{fileConfig.icon}</span>
                <p className="upload-text">
                  Drag & drop or click to upload
                  {activeTab === 'Image' ? ' (up to 5 images)' : ''}
                </p>
                <p className="upload-hint">Supports: {fileConfig.extensions}</p>
                <p className="upload-hint">Max size: 20MB</p>
              </>
            ) : (
              <p className="upload-hint">Click to add more files</p>
            )}
          </div>

          {files.length > 0 && (
            <FilePreview files={files} onRemove={removeFile} />
          )}
        </div>
      ) : (
        <div className="input-wrapper">
          <span className="input-label">{activeTab} input</span>
          <textarea
            placeholder={
              activeTab === 'URL'
                ? 'Enter a URL to analyze (e.g. https://example.com/article)'
                : 'Paste a news article, claim, or social media post here...'
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>
      )}

      <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Scanning...' : '⟩ Run Analysis'}
      </button>

      {error && <p className="error">⚠ {error}</p>}

      {loading && (
        <div className="scanning">
          <p className="scan-text">Scanning for misinformation...</p>
          <div className="scan-bar-wrapper">
            <div className="scan-bar" />
          </div>
          <div className="scan-dots">
            <span /><span /><span />
          </div>
        </div>
      )}

      {/* Extracted text preview */}
      {extractedText && extractedText !== '[Image analyzed visually]' && (
        <div className="extracted-box">
          <div className="extracted-header">
            <span className="extracted-label">Extracted text</span>
            <button
              className="extracted-toggle"
              onClick={() => setShowExtracted(!showExtracted)}
            >
              {showExtracted ? 'Hide' : 'Show'}
            </button>
          </div>
          {showExtracted && (
            <p className="extracted-content">{extractedText}</p>
          )}
        </div>
      )}

      {/* Single result */}
      {result && <ResultCard result={result} />}

      {/* Multiple results */}
      {results.length > 0 && (
        <div className="multiple-results">
          <h3 className="multiple-results-title">Analysis for {results.length} files</h3>
          {results.map((r, i) => (
            <div key={i} className="multiple-result-item">
              <p className="multiple-result-filename">📎 {r.fileName}</p>
              {r.error ? (
                <p className="error">⚠ {r.error}</p>
              ) : (
                <ResultCard result={r} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Analyzer;