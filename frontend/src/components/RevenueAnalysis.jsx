import React, { useState, useEffect } from 'react';
import { getRevenueAnalysis } from '../services/api';

const RevenueAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRevenueAnalysis();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading revenue analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={fetchData} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Revenue Analysis</h2>
        <button onClick={fetchData} className="btn-refresh">
          Refresh
        </button>
      </div>

      <div className="cards-grid">
        <div className="card card-primary">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="card-value">{formatCurrency(data?.totalRevenue)}</p>
            <span className="card-label">All completed quotations</span>
          </div>
        </div>

        <div className="card card-secondary">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Average Quotation Value</h3>
            <p className="card-value">{formatCurrency(data?.averageQuotationValue)}</p>
            <span className="card-label">Per quotation</span>
          </div>
        </div>

        <div className="card card-tertiary">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <h3>Total Quotations</h3>
            <p className="card-value">{data?.totalQuotations || 0}</p>
            <span className="card-label">All statuses</span>
          </div>
        </div>
      </div>

      <div className="info-box">
        <p>
          <strong>Note:</strong> Revenue analysis includes all quotations in the system. 
          Average quotation value is calculated from total revenue divided by total quotations.
        </p>
      </div>
    </div>
  );
};

export default RevenueAnalysis;
