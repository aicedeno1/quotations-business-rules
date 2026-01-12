import React, { useState } from 'react';
import { getDiscountAnalysis } from '../services/api';

const DiscountAnalysis = () => {
  const [quotationId, setQuotationId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!quotationId || quotationId <= 0) {
      setError('Please enter a valid quotation ID');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getDiscountAnalysis(quotationId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Discount Analysis</h2>
      </div>

      <form onSubmit={handleAnalyze} className="form-inline">
        <div className="form-group">
          <label htmlFor="quotationId">Quotation ID:</label>
          <input
            type="number"
            id="quotationId"
            value={quotationId}
            onChange={(e) => setQuotationId(e.target.value)}
            placeholder="Enter quotation ID"
            min="1"
            className="input-field"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Analyzing...' : 'Analyze Discount'}
        </button>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Analyzing discount...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {data && !loading && (
        <div className="results-container">
          <div className="section">
            <h3>Quotation Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Quotation ID:</span>
                <span className="value">{data.quotationId}</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Original Values</h3>
            <div className="cards-grid">
              <div className="card">
                <h4>Original Subtotal</h4>
                <p className="card-value">{formatCurrency(data.originalSubtotal)}</p>
              </div>
              <div className="card">
                <h4>Total Without Discount</h4>
                <p className="card-value">{formatCurrency(data.totalWithoutDiscount)}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Discount Details</h3>
            <div className="cards-grid">
              <div className="card card-info">
                <h4>Discount Type</h4>
                <p className="card-value-text">{data.discountType || 'None'}</p>
              </div>
              <div className="card card-info">
                <h4>Discount Value</h4>
                <p className="card-value">
                  {data.discountType === 'percentage' 
                    ? formatPercentage(data.discountValue)
                    : formatCurrency(data.discountValue)}
                </p>
              </div>
              <div className="card card-warning">
                <h4>Discount Amount</h4>
                <p className="card-value">{formatCurrency(data.discountAmount)}</p>
              </div>
              <div className="card card-warning">
                <h4>Discount Percentage</h4>
                <p className="card-value">{formatPercentage(data.discountPercentage)}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Financial Impact</h3>
            <div className="cards-grid">
              <div className="card card-success">
                <h4>Final Total</h4>
                <p className="card-value">{formatCurrency(data.finalTotal)}</p>
                <span className="card-label">After discount</span>
              </div>
              <div className="card card-success">
                <h4>Savings for Client</h4>
                <p className="card-value">{formatCurrency(data.savingsForClient)}</p>
                <span className="card-label">Total saved</span>
              </div>
              <div className="card card-danger">
                <h4>Profit Margin Lost</h4>
                <p className="card-value">{formatCurrency(data.profitMarginLost)}</p>
                <span className="card-label">Revenue impact</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountAnalysis;
