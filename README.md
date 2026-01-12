# Quotations Business Rules System

Sistema completo de análisis de reglas de negocio para cotizaciones con backend Flask y frontend React.

## 🚀 Estructura del Proyecto

```
quotations-business-rules/
├── backend/           # API Flask
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
└── frontend/          # Aplicación React
    ├── src/
    ├── package.json
    └── README.md
```

## 📋 Requisitos Previos

- Python 3.8+
- Node.js 16+
- npm o yarn

## 🔧 Instalación Local

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

El backend correrá en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm start
```

El frontend correrá en `http://localhost:3000`

## 🌐 Despliegue en Render

### Backend (Flask)

1. Crear nuevo **Web Service** en Render
2. Conectar repositorio de GitHub
3. Configuración:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Environment**: Python 3

### Frontend (React)

1. Crear nuevo **Static Site** en Render
2. Conectar repositorio de GitHub
3. Configuración:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**: 
     - `REACT_APP_API_URL`: URL del backend desplegado

## 🔌 Endpoints del Backend

- `GET /api/quotations/revenue-analysis` - Análisis de ingresos
- `GET /api/quotations/{id}/discount-analysis` - Análisis de descuentos
- `GET /api/quotations/profitability-by-chef` - Rentabilidad por chef
- `GET /api/quotations/tax-summary` - Resumen de impuestos

## 📱 Componentes del Frontend

- **Revenue Analysis** - Métricas de ingresos totales
- **Discount Analysis** - Análisis de descuentos por cotización
- **Chef Profitability** - Rendimiento por chef
- **Tax Summary** - Reportes de impuestos

## 🛠️ Tecnologías

**Backend:**
- Flask
- Flask-CORS
- Python 3

**Frontend:**
- React 19
- Axios
- CSS3

## 📄 Licencia

Este proyecto es parte del sistema de cotizaciones empresariales.
