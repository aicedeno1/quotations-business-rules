import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

// API Functions

/**
 * Get revenue analysis for all quotations
 * @returns {Promise} Revenue analysis data
 */
export const getRevenueAnalysis = async () => {
  try {
    const response = await api.get('/quotations/revenue-analysis');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to fetch revenue analysis'
    );
  }
};

/**
 * Get discount analysis for a specific quotation
 * @param {number} id - Quotation ID
 * @returns {Promise} Discount analysis data
 */
export const getDiscountAnalysis = async (id) => {
  try {
    const response = await api.get(`/quotations/${id}/discount-analysis`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      `Failed to fetch discount analysis for quotation ${id}`
    );
  }
};

/**
 * Get profitability analysis by chef
 * @returns {Promise} Chef profitability data
 */
export const getChefProfitability = async () => {
  try {
    const response = await api.get('/quotations/profitability-by-chef');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to fetch chef profitability data'
    );
  }
};

/**
 * Get tax summary for a date range
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 * @returns {Promise} Tax summary data
 */
export const getTaxSummary = async (params = {}) => {
  try {
    const response = await api.get('/quotations/tax-summary', { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to fetch tax summary'
    );
  }
};

export default api;
