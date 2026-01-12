import React, { useState, useEffect } from 'react';
import { getChefProfitability } from '../services/api';

const ChefProfitability = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getChefProfitability();
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

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading chef profitability data...</p>
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
        <h2>Chef Profitability Analysis</h2>
        <button onClick={fetchData} className="btn-refresh">
          Refresh
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <p>No chef data available</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Chef ID</th>
                <th>Total Quotations</th>
                <th>Total Revenue</th>
                <th>Avg Quotation Value</th>
                <th>Approved</th>
                <th>Pending</th>
                <th>Cancelled</th>
                <th>Completed</th>
                <th>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((chef) => (
                <tr key={chef.chefId}>
                  <td className="chef-id">
                    <span className="badge">Chef {chef.chefId}</span>
                  </td>
                  <td className="text-center">{chef.totalQuotations}</td>
                  <td className="text-right font-bold">{formatCurrency(chef.totalRevenue)}</td>
                  <td className="text-right">{formatCurrency(chef.averageQuotationValue)}</td>
                  <td className="text-center">
                    <span className="badge badge-success">{chef.approvedQuotations}</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-warning">{chef.pendingQuotations}</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-danger">{chef.cancelledQuotations}</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-info">{chef.completedQuotations}</span>
                  </td>
                  <td className="text-right">
                    <span className={`success-rate ${chef.successRate >= 50 ? 'high' : 'low'}`}>
                      {formatPercentage(chef.successRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="info-box">
        <p>
          <strong>Note:</strong> Success rate is calculated as (Completed Quotations / Total Quotations) × 100. 
          Chefs are sorted by total revenue in descending order.
        </p>
      </div>
    </div>
  );
};

export default ChefProfitability;
