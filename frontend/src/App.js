import React, { useState } from 'react';
import './App.css';
import RevenueAnalysis from './components/RevenueAnalysis';
import DiscountAnalysis from './components/DiscountAnalysis';
import ChefProfitability from './components/ChefProfitability';
import TaxSummary from './components/TaxSummary';

function App() {
  const [activeTab, setActiveTab] = useState('revenue');

  const tabs = [
    { id: 'revenue', label: 'Revenue Analysis', icon: '' },
    { id: 'discount', label: 'Discount Analysis', icon: '' },
    { id: 'chef', label: 'Chef Profitability', icon: '' },
    { id: 'tax', label: 'Tax Summary', icon: '' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'revenue':
        return <RevenueAnalysis />;
      case 'discount':
        return <DiscountAnalysis />;
      case 'chef':
        return <ChefProfitability />;
      case 'tax':
        return <TaxSummary />;
      default:
        return <RevenueAnalysis />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Quotations Business Rules</h1>
          <p className="app-subtitle">Advanced Analytics & Reporting System</p>
        </div>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-content">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>© 2026 Quotations Business Rules System | Backend: http://localhost:5000</p>
      </footer>
    </div>
  );
}

export default App;
