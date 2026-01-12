# Backend API - Sistema de Cotizaciones

Backend desarrollado en Python con Flask y MongoDB para gestionar cotizaciones de eventos.

## 📋 Requisitos Previos

- Python 3.8 o superior
- MongoDB Atlas (cuenta configurada)
- pip (gestor de paquetes de Python)

## 🚀 Instalación

### 1. Crear entorno virtual (recomendado)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Ejecutar el servidor

```bash
python app.py
```

El servidor estará disponible en: `http://localhost:5000`

## 📡 Endpoints Disponibles

### 1. **GET /** - Información de la API
Retorna la lista de todos los endpoints disponibles.

**Respuesta:**
```json
{
  "message": "API de Cotizaciones - Backend Flask + MongoDB",
  "version": "1.0.0",
  "endpoints": [...]
}
```

---

### 2. **GET /api/quotations/revenue-analysis** - Análisis de Ingresos
Calcula el total de ingresos, promedio de cotizaciones y cantidad total.

**Respuesta:**
```json
{
  "totalRevenue": 125000.50,
  "averageQuotationValue": 2500.75,
  "totalQuotations": 50
}
```

---

### 3. **GET /api/quotations/:id/discount-analysis** - Análisis de Descuentos
Calcula el impacto del descuento en una cotización específica.

**Parámetros:**
- `id` (path): ID de la cotización (ObjectId de MongoDB)

**Ejemplo de petición:**
```bash
GET http://localhost:5000/api/quotations/65a1b2c3d4e5f6g7h8i9j0k1/discount-analysis
```

**Respuesta exitosa (200):**
```json
{
  "quotationId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "originalSubtotal": 10000.00,
  "discountType": "percentage",
  "discountValue": 15.00,
  "discountAmount": 1500.00,
  "discountPercentage": 15.00,
  "totalWithoutDiscount": 11300.00,
  "finalTotal": 9800.00,
  "savingsForClient": 1500.00,
  "profitMarginLost": 15.00
}
```

**Respuesta error (404):**
```json
{
  "error": "Cotización no encontrada",
  "message": "No existe una cotización con el ID: 65a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

### 4. **GET /api/quotations/profitability-by-chef** - Rentabilidad por Chef
Agrupa cotizaciones por chef y calcula métricas de rendimiento.

**Respuesta:**
```json
[
  {
    "chefId": "chef001",
    "totalQuotations": 25,
    "totalRevenue": 62500.00,
    "averageQuotationValue": 2500.00,
    "approvedQuotations": 20,
    "pendingQuotations": 3,
    "cancelledQuotations": 1,
    "completedQuotations": 1,
    "successRate": 80.00
  },
  {
    "chefId": "chef002",
    "totalQuotations": 15,
    "totalRevenue": 45000.00,
    "averageQuotationValue": 3000.00,
    "approvedQuotations": 12,
    "pendingQuotations": 2,
    "cancelledQuotations": 1,
    "completedQuotations": 0,
    "successRate": 80.00
  }
]
```

**Nota:** Los resultados están ordenados por `totalRevenue` de mayor a menor.

---

### 5. **GET /api/quotations/tax-summary** - Resumen de Impuestos
Calcula resumen de impuestos con filtrado opcional por fechas.

**Parámetros Query (opcionales):**
- `startDate`: Fecha de inicio (formato: YYYY-MM-DD)
- `endDate`: Fecha de fin (formato: YYYY-MM-DD)

**Ejemplo de petición sin filtros:**
```bash
GET http://localhost:5000/api/quotations/tax-summary
```

**Ejemplo de petición con filtros:**
```bash
GET http://localhost:5000/api/quotations/tax-summary?startDate=2024-01-01&endDate=2024-12-31
```

**Respuesta:**
```json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "totalQuotations": 50,
  "totalSubtotal": 500000.00,
  "totalDiscounts": 25000.00,
  "totalRevenue": 550000.00,
  "taxBreakdown": {
    "ivaAmount": 45000.00,
    "serviceAmount": 20000.00,
    "otherAmount": 10000.00,
    "totalTaxes": 75000.00
  },
  "averageTaxRate": 15.00,
  "netRevenue": 475000.00
}
```

## 🗄️ Estructura de la Colección "quotations"

```javascript
{
  "_id": ObjectId,
  "quotationType": String, // "client_request" | "chef_quotation"
  "status": String, // "pending" | "approved" | "completed" | "cancelled"
  "clientInfo": {
    "name": String,
    "phone": String,
    "email": String
  },
  "eventInfo": {
    "eventType": String, // "wedding" | "corporate_event" | "birthday_party" | "other"
    "numberOfGuests": Number,
    "eventDate": Date,
    "eventTime": String,
    "location": {
      "address": String,
      "venueName": String
    }
  },
  "recipes": Array,
  "discount": {
    "type": String, // "percentage" | "fixed"
    "value": Number
  },
  "subtotal": Number,
  "discountAmount": Number,
  "taxes": {
    "ivaPercent": Number,
    "servicePercent": Number,
    "otherPercent": Number,
    "ivaAmount": Number,
    "serviceAmount": Number,
    "otherAmount": Number,
    "totalTaxes": Number
  },
  "totalAmount": Number,
  "chefId": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

## 🔧 Configuración

### MongoDB
La conexión a MongoDB está configurada en `app.py`:
- **URI:** `mongodb+srv://mrsproudd:mrsproudd@cluster0.ad7fs0q.mongodb.net/recipemanagementsystem?appName=Cluster0`
- **Base de datos:** `recipemanagementsystem`
- **Colección:** `quotations`

### CORS
CORS está habilitado para permitir peticiones desde React en `http://localhost:3000`.

### Puerto
El servidor se ejecuta en el puerto **5000** por defecto.

## 🧪 Pruebas con cURL

### Ejemplo 1: Análisis de ingresos
```bash
curl http://localhost:5000/api/quotations/revenue-analysis
```

### Ejemplo 2: Análisis de descuento
```bash
curl http://localhost:5000/api/quotations/65a1b2c3d4e5f6g7h8i9j0k1/discount-analysis
```

### Ejemplo 3: Rentabilidad por chef
```bash
curl http://localhost:5000/api/quotations/profitability-by-chef
```

### Ejemplo 4: Resumen de impuestos con fechas
```bash
curl "http://localhost:5000/api/quotations/tax-summary?startDate=2024-01-01&endDate=2024-12-31"
```

## 📦 Dependencias Principales

- **Flask 3.0.0** - Framework web
- **pymongo 4.6.1** - Driver de MongoDB
- **flask-cors 4.0.0** - Soporte para CORS
- **python-dotenv 1.0.0** - Gestión de variables de entorno
- **dnspython 2.4.2** - Requerido para conexiones MongoDB Atlas

## 🛠️ Características Técnicas

- ✅ Todos los números se redondean a 2 decimales
- ✅ Manejo robusto de errores con try-except
- ✅ Mensajes de error descriptivos en formato JSON
- ✅ Validación de ObjectId para MongoDB
- ✅ Filtrado por fechas con validación de formato
- ✅ Agregaciones optimizadas usando MongoDB Pipeline
- ✅ Código comentado y documentado

## 📝 Notas Importantes

1. **ObjectId:** Los IDs de MongoDB deben ser ObjectId válidos de 24 caracteres hexadecimales.
2. **Fechas:** El formato de fechas para filtros es `YYYY-MM-DD` (ej: 2024-01-15).
3. **ChefId:** El endpoint de rentabilidad por chef excluye automáticamente documentos sin chefId.
4. **CORS:** Si el frontend está en un puerto diferente al 3000, modificar la configuración de CORS en `app.py`.

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que la URI de MongoDB sea correcta
- Confirmar que las credenciales sean válidas
- Revisar la conexión a Internet

### Error "Module not found"
```bash
pip install -r requirements.txt
```

### Puerto 5000 en uso
Modificar el puerto en la última línea de `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Cambiar a otro puerto
```

## 📧 Contacto y Soporte

Para preguntas o problemas, revisar la documentación de:
- [Flask](https://flask.palletsprojects.com/)
- [PyMongo](https://pymongo.readthedocs.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026
