import React, { useState } from 'react';
import { getTaxSummary } from '../services/api';

const TaxSummary = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (startDate && endDate && startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const result = await getTaxSummary(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAllTime = async () => {
    setStartDate('');
    setEndDate('');
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getTaxSummary();
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Tax Summary Report</h2>
      </div>

      <form onSubmit={handleGenerate} className="form-date-range">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Generating...' : 'Generate Tax Summary'}
          </button>
          <button type="button" onClick={handleAllTime} disabled={loading} className="btn-secondary">
            All Time
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating tax summary...</p>
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
            <h3>Period</h3>
            <div className="period-info">
              <p>
                <strong>From:</strong> {formatDate(data.period?.startDate)} 
                {' '}<strong>To:</strong> {formatDate(data.period?.endDate)}
              </p>
            </div>
          </div>

          <div className="section">
            <h3>Summary</h3>
            <div className="cards-grid">
              <div className="card">
                <h4>Total Quotations</h4>
                <p className="card-value">{data.summary?.totalQuotations || 0}</p>
              </div>
              <div className="card">
                <h4>Total Subtotal</h4>
                <p className="card-value">{formatCurrency(data.summary?.totalSubtotal)}</p>
              </div>
              <div className="card card-warning">
                <h4>Total Discounts</h4>
                <p className="card-value">{formatCurrency(data.summary?.totalDiscounts)}</p>
              </div>
              <div className="card card-primary">
                <h4>Total Revenue</h4>
                <p className="card-value">{formatCurrency(data.summary?.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Tax Breakdown</h3>
            <div className="cards-grid">
              <div className="card card-info">
                <h4>IVA Amount</h4>
                <p className="card-value">{formatCurrency(data.taxBreakdown?.ivaAmount)}</p>
                <span className="card-label">Value Added Tax</span>
              </div>
              <div className="card card-info">
                <h4>Service Amount</h4>
                <p className="card-value">{formatCurrency(data.taxBreakdown?.serviceAmount)}</p>
                <span className="card-label">Service Charges</span>
              </div>
              <div className="card card-info">
                <h4>Other Amount</h4>
                <p className="card-value">{formatCurrency(data.taxBreakdown?.otherAmount)}</p>
                <span className="card-label">Other Taxes</span>
              </div>
              <div className="card card-success">
                <h4>Total Taxes</h4>
                <p className="card-value">{formatCurrency(data.taxBreakdown?.totalTaxes)}</p>
                <span className="card-label">All tax components</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Analysis</h3>
            <div className="cards-grid">
              <div className="card card-secondary">
                <h4>Average Tax Rate</h4>
                <p className="card-value">{formatPercentage(data.analysis?.averageTaxRate)}</p>
                <span className="card-label">Effective tax rate</span>
              </div>
              <div className="card card-primary">
                <h4>Net Revenue</h4>
                <p className="card-value">{formatCurrency(data.analysis?.netRevenue)}</p>
                <span className="card-label">After taxes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxSummary;
