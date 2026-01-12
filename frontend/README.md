# Quotations Business Rules - Frontend

Frontend React application for analyzing and visualizing quotation business rules from a Flask backend.

## 📋 Description

This application provides a comprehensive interface to analyze quotations data including:
- **Revenue Analysis**: View total revenue, average quotation values, and quotation counts
- **Discount Analysis**: Analyze discount impacts on individual quotations
- **Chef Profitability**: Track performance metrics by chef
- **Tax Summary**: Generate tax reports for specific date ranges

## 🚀 Technologies

- **React** 19.2.3
- **Axios** 1.6.5 (HTTP client)
- **Create React App** 5.0.1
- **CSS3** (Modern styling with gradients and animations)

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Verify backend is running**:
   - Ensure the Flask backend is running at `http://localhost:5000`
   - Backend should have the following endpoints available:
     - `GET /api/quotations/revenue-analysis`
     - `GET /api/quotations/{id}/discount-analysis`
     - `GET /api/quotations/profitability-by-chef`
     - `GET /api/quotations/tax-summary`

## 🎯 Usage

### Start Development Server

```bash
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

### Run Tests

```bash
npm test
```

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── App.js                      # Main component with navigation
│   ├── App.css                     # Global styles
│   ├── components/
│   │   ├── RevenueAnalysis.jsx    # Revenue metrics component
│   │   ├── DiscountAnalysis.jsx   # Discount analysis component
│   │   ├── ChefProfitability.jsx  # Chef performance component
│   │   └── TaxSummary.jsx         # Tax reporting component
│   └── services/
│       └── api.js                  # Axios configuration & API functions
├── package.json
└── README.md
```

## 🎨 Features

### Revenue Analysis
- Displays total revenue across all quotations
- Shows average quotation value
- Displays total number of quotations
- Auto-refresh capability

### Discount Analysis
- Input quotation ID to analyze
- Shows original vs discounted values
- Calculates savings and profit margin impact
- Displays discount type and percentage

### Chef Profitability
- Table view of all chefs' performance
- Metrics include: total quotations, revenue, success rate
- Status breakdown: approved, pending, cancelled, completed
- Sorted by total revenue

### Tax Summary
- Date range selector for custom periods
- "All Time" option for complete history
- Breakdown by tax type (IVA, Service, Other)
- Shows average tax rate and net revenue

## 🔧 Configuration

Backend URL is configured in [src/services/api.js](src/services/api.js):

```javascript
baseURL: 'http://localhost:5000/api'
```

To change the backend URL, modify this value in the axios instance configuration.

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Gradient backgrounds, card-based layouts
- **Loading States**: Spinners while fetching data
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Fade-in effects and hover transitions
- **Professional Theme**: Purple/blue gradient with clean typography

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Mobile**: ≤ 768px

## 🐛 Troubleshooting

### Backend Connection Issues
- Verify Flask backend is running: `http://localhost:5000`
- Check browser console for CORS errors
- Ensure backend has CORS enabled for `http://localhost:3000`

### API Errors
- Check that all required backend endpoints are implemented
- Verify data format matches expected structure
- Review network tab in browser DevTools

## 📄 License

This project is part of the Quotations Business Rules system.

## 👥 Support

For issues or questions, check the backend README or contact the development team.
