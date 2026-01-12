"""
Backend API para gestión de cotizaciones usando Flask y MongoDB
Autor: Sistema de Gestión de Recetas
Fecha: Enero 2026
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import traceback

# Configuración de la aplicación Flask
app = Flask(__name__)

# Habilitar CORS para permitir peticiones desde React (puerto 3000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configuración de MongoDB
MONGODB_URI = "mongodb+srv://mrsproudd:mrsproudd@cluster0.ad7fs0q.mongodb.net/recipemanagementsystem?appName=Cluster0"
DATABASE_NAME = "recipemanagementsystem"
COLLECTION_NAME = "quotations"

# Conexión a MongoDB
try:
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    quotations_collection = db[COLLECTION_NAME]
    print("✓ Conectado exitosamente a MongoDB")
except Exception as e:
    print(f"✗ Error al conectar a MongoDB: {str(e)}")


# ============================================
# UTILIDADES
# ============================================

def round_to_2_decimals(value):
    """Redondea un valor a 2 decimales"""
    if value is None:
        return 0.0
    return round(float(value), 2)


def serialize_object_id(obj):
    """Convierte ObjectId a string para serialización JSON"""
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj


# ============================================
# ENDPOINTS
# ============================================

@app.route('/', methods=['GET'])
def home():
    """
    Endpoint raíz que retorna la lista de endpoints disponibles
    """
    endpoints = {
        "message": "API de Cotizaciones - Backend Flask + MongoDB",
        "version": "1.0.0",
        "endpoints": [
            {
                "method": "GET",
                "path": "/",
                "description": "Lista de endpoints disponibles"
            },
            {
                "method": "GET",
                "path": "/api/quotations/revenue-analysis",
                "description": "Análisis de ingresos totales y promedios"
            },
            {
                "method": "GET",
                "path": "/api/quotations/<id>/discount-analysis",
                "description": "Análisis de descuentos para una cotización específica"
            },
            {
                "method": "GET",
                "path": "/api/quotations/profitability-by-chef",
                "description": "Rentabilidad agrupada por chef"
            },
            {
                "method": "GET",
                "path": "/api/quotations/tax-summary",
                "description": "Resumen de impuestos (opcional: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)"
            }
        ]
    }
    return jsonify(endpoints), 200


@app.route('/api/quotations/revenue-analysis', methods=['GET'])
def revenue_analysis():
    """
    Endpoint 1: Análisis de Ingresos
    Calcula el total de ingresos, promedio de cotizaciones y cantidad total
    """
    try:
        # Obtener todas las cotizaciones
        quotations = list(quotations_collection.find())
        
        # Calcular métricas
        total_quotations = len(quotations)
        total_revenue = sum(q.get('totalAmount', 0) for q in quotations)
        average_quotation_value = total_revenue / total_quotations if total_quotations > 0 else 0
        
        result = {
            "totalRevenue": round_to_2_decimals(total_revenue),
            "averageQuotationValue": round_to_2_decimals(average_quotation_value),
            "totalQuotations": total_quotations
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": "Error al calcular análisis de ingresos",
            "message": str(e)
        }), 500


@app.route('/api/quotations/<id>/discount-analysis', methods=['GET'])
def discount_analysis(id):
    """
    Endpoint 2: Análisis de Descuentos por Cotización
    Calcula el impacto del descuento en una cotización específica
    """
    try:
        # Validar que el ID sea un ObjectId válido
        if not ObjectId.is_valid(id):
            return jsonify({
                "error": "ID inválido",
                "message": "El ID proporcionado no es un ObjectId válido de MongoDB"
            }), 400
        
        # Buscar la cotización por ID
        quotation = quotations_collection.find_one({"_id": ObjectId(id)})
        
        # Si no existe, retornar 404
        if not quotation:
            return jsonify({
                "error": "Cotización no encontrada",
                "message": f"No existe una cotización con el ID: {id}"
            }), 404
        
        # Extraer datos necesarios
        subtotal = quotation.get('subtotal', 0)
        discount_amount = quotation.get('discountAmount', 0)
        total_amount = quotation.get('totalAmount', 0)
        taxes = quotation.get('taxes', {})
        total_taxes = taxes.get('totalTaxes', 0)
        discount = quotation.get('discount', {})
        
        # Calcular métricas de descuento
        discount_percentage = (discount_amount / subtotal * 100) if subtotal > 0 else 0
        total_without_discount = subtotal + total_taxes
        
        result = {
            "quotationId": str(quotation['_id']),
            "originalSubtotal": round_to_2_decimals(subtotal),
            "discountType": discount.get('type', 'N/A'),
            "discountValue": round_to_2_decimals(discount.get('value', 0)),
            "discountAmount": round_to_2_decimals(discount_amount),
            "discountPercentage": round_to_2_decimals(discount_percentage),
            "totalWithoutDiscount": round_to_2_decimals(total_without_discount),
            "finalTotal": round_to_2_decimals(total_amount),
            "savingsForClient": round_to_2_decimals(discount_amount),
            "profitMarginLost": round_to_2_decimals(discount_percentage)
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": "Error al calcular análisis de descuento",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500


@app.route('/api/quotations/profitability-by-chef', methods=['GET'])
def profitability_by_chef():
    """
    Endpoint 3: Rentabilidad por Chef
    Agrupa cotizaciones por chef y calcula métricas de rendimiento
    """
    try:
        # Pipeline de agregación de MongoDB
        pipeline = [
            # Filtrar documentos donde chefId existe y no es null
            {
                "$match": {
                    "chefId": {"$exists": True, "$ne": None}
                }
            },
            # Agrupar por chefId
            {
                "$group": {
                    "_id": "$chefId",
                    "totalQuotations": {"$sum": 1},
                    "totalRevenue": {"$sum": "$totalAmount"},
                    "approvedQuotations": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "approved"]}, 1, 0]
                        }
                    },
                    "pendingQuotations": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "pending"]}, 1, 0]
                        }
                    },
                    "cancelledQuotations": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "cancelled"]}, 1, 0]
                        }
                    },
                    "completedQuotations": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "completed"]}, 1, 0]
                        }
                    }
                }
            },
            # Ordenar por totalRevenue descendente
            {
                "$sort": {"totalRevenue": -1}
            }
        ]
        
        # Ejecutar agregación
        results = list(quotations_collection.aggregate(pipeline))
        
        # Procesar resultados y calcular métricas adicionales
        profitability_data = []
        for chef in results:
            total_quotations = chef['totalQuotations']
            total_revenue = chef['totalRevenue']
            approved_quotations = chef['approvedQuotations']
            
            average_quotation_value = total_revenue / total_quotations if total_quotations > 0 else 0
            success_rate = (approved_quotations / total_quotations * 100) if total_quotations > 0 else 0
            
            profitability_data.append({
                "chefId": chef['_id'],
                "totalQuotations": total_quotations,
                "totalRevenue": round_to_2_decimals(total_revenue),
                "averageQuotationValue": round_to_2_decimals(average_quotation_value),
                "approvedQuotations": approved_quotations,
                "pendingQuotations": chef['pendingQuotations'],
                "cancelledQuotations": chef['cancelledQuotations'],
                "completedQuotations": chef['completedQuotations'],
                "successRate": round_to_2_decimals(success_rate)
            })
        
        return jsonify(profitability_data), 200
        
    except Exception as e:
        return jsonify({
            "error": "Error al calcular rentabilidad por chef",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500


@app.route('/api/quotations/tax-summary', methods=['GET'])
def tax_summary():
    """
    Endpoint 4: Resumen de Impuestos
    Calcula resumen de impuestos con filtrado opcional por fechas
    Parámetros query: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
    """
    try:
        # Obtener parámetros de fecha desde query string
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')
        
        # Construir filtro de fechas si se proporcionan
        date_filter = {}
        if start_date_str or end_date_str:
            date_filter['createdAt'] = {}
            
            if start_date_str:
                try:
                    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                    date_filter['createdAt']['$gte'] = start_date
                except ValueError:
                    return jsonify({
                        "error": "Formato de fecha inválido",
                        "message": "startDate debe estar en formato YYYY-MM-DD"
                    }), 400
            
            if end_date_str:
                try:
                    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
                    # Agregar 23:59:59 para incluir todo el día final
                    end_date = end_date.replace(hour=23, minute=59, second=59)
                    date_filter['createdAt']['$lte'] = end_date
                except ValueError:
                    return jsonify({
                        "error": "Formato de fecha inválido",
                        "message": "endDate debe estar en formato YYYY-MM-DD"
                    }), 400
        
        # Obtener cotizaciones con filtro de fecha
        quotations = list(quotations_collection.find(date_filter))
        
        # Calcular métricas
        total_quotations = len(quotations)
        total_subtotal = sum(q.get('subtotal', 0) for q in quotations)
        total_discounts = sum(q.get('discountAmount', 0) for q in quotations)
        total_revenue = sum(q.get('totalAmount', 0) for q in quotations)
        
        # Sumar impuestos
        total_iva = sum(q.get('taxes', {}).get('ivaAmount', 0) for q in quotations)
        total_service = sum(q.get('taxes', {}).get('serviceAmount', 0) for q in quotations)
        total_other = sum(q.get('taxes', {}).get('otherAmount', 0) for q in quotations)
        total_taxes = sum(q.get('taxes', {}).get('totalTaxes', 0) for q in quotations)
        
        # Calcular métricas adicionales
        average_tax_rate = (total_taxes / total_subtotal * 100) if total_subtotal > 0 else 0
        net_revenue = total_revenue - total_taxes
        
        result = {
            "period": {
                "startDate": start_date_str if start_date_str else "N/A",
                "endDate": end_date_str if end_date_str else "N/A"
            },
            "totalQuotations": total_quotations,
            "totalSubtotal": round_to_2_decimals(total_subtotal),
            "totalDiscounts": round_to_2_decimals(total_discounts),
            "totalRevenue": round_to_2_decimals(total_revenue),
            "taxBreakdown": {
                "ivaAmount": round_to_2_decimals(total_iva),
                "serviceAmount": round_to_2_decimals(total_service),
                "otherAmount": round_to_2_decimals(total_other),
                "totalTaxes": round_to_2_decimals(total_taxes)
            },
            "averageTaxRate": round_to_2_decimals(average_tax_rate),
            "netRevenue": round_to_2_decimals(net_revenue)
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": "Error al calcular resumen de impuestos",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500


# ============================================
# INICIAR SERVIDOR
# ============================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Iniciando servidor Flask")
    print("="*50)
    print(f"📍 Puerto: 5000")
    print(f"🔗 URL: http://localhost:5000")
    print(f"🗄️  Base de datos: {DATABASE_NAME}")
    print(f"📦 Colección: {COLLECTION_NAME}")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
