import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [marketingContent, setMarketingContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/history`);
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history.", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setMarketingContent('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate-content`, {
        product_name: productName,
        product_description: productDescription,
      });
      setMarketingContent(response.data.marketing_text);
      fetchHistory();
    } catch (err) {
      setError('Failed to generate content. Please check the backend server and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/history/${id}`);
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete history item.", err);
      setError("Failed to delete history item.");
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to delete all history? This action cannot be undone.")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/history`);
        fetchHistory();
      } catch (err) {
        console.error("Failed to clear history.", err);
        setError("Failed to clear history.");
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1><span className="gradient-text">Marketing Content Generator</span></h1>
        <p>Enter your product details to generate stunning marketing copy with AI.</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Smart Mug"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Product Description</label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="e.g., A temperature-controlled mug that keeps your coffee hot for hours."
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading && <span className="spinner"></span>}
            {isLoading ? 'Generating...' : 'Generate Content'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {marketingContent && (
          <div className="result-container">
            <h2><span className="gradient-text">Generated Content</span></h2>
            <div className="marketing-text">{marketingContent}</div>
          </div>
        )}

        <div className="history-container">
          <div className="history-header">
            <h2><span className="gradient-text">Recent Generations </span></h2>
            {history.length > 0 && (
              <button onClick={handleClearHistory} className="clear-history-button">
                Clear All
              </button>
            )}
          </div>

          {history.length > 0 ? (
            history.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="history-item">
                  <div className="history-item-header" onClick={() => handleToggleExpand(item.id)}>
                    <h3>{item.product_name}</h3>
                    <div className="history-item-controls">
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="delete-button">
                        Delete
                      </button>
                      <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                    </div>
                  </div>

                  {}
                  {isExpanded && (
                    <div className="history-item-content">
                      <p className="history-description">{item.product_description}</p>
                      <div className="marketing-text history-content">{item.generated_content}</div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No history yet. Generate some content to see it here!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;