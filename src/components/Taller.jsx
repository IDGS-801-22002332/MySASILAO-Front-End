import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Taller.css';
import {
    Send, ArrowLeft, Settings, Camera, Calendar, ClipboardList, Wrench,
    User, Phone, Mail, DollarSign, Package, FileText, Image,
    CheckCircle, AlertCircle, RefreshCw, Clock, Eye, Save
} from 'lucide-react';
import { getSession, clearSession } from './authUtils';


const API_URL = 'http://localhost:3000';

const Taller = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrden, setSelectedOrden] = useState(null);
    const [cotizacionForm, setCotizacionForm] = useState({
        refacciones_necesarias: '',
        mano_obra_costo: '',
        observaciones_mecanico: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');

    useEffect(() => {
        const session = getSession();
        console.log("Sesión Mecánico:", session);

        if (!session || session.rol !== 'Mecanico') {
            navigate('/login');
            return;
        }

        setUserData(session);
        fetchMisOrdenes();
    }, []);

    const fetchMisOrdenes = async () => {
        setLoading(true);
        try {
            const session = getSession();
            const response = await fetch(`${API_URL}/ordenes?rol=mecanico&usuarioId=${session.id}`);
            const data = await response.json();
            console.log('Mis órdenes:', data);
            setOrdenes(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar tus órdenes');
        } finally {
            setLoading(false);
        }
    };

    const handleCotizacionChange = (e) => {
        const { name, value } = e.target;
        setCotizacionForm(prev => ({ ...prev, [name]: value }));
    };

    const enviarCotizacion = async (ordenId) => {
        if (!cotizacionForm.mano_obra_costo) {
            setError('Por favor ingresa el costo de mano de obra');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const cotizacion_total = parseFloat(cotizacionForm.mano_obra_costo);

            const response = await fetch(`${API_URL}/ordenes/${ordenId}/cotizacion-mecanico`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refacciones_necesarias: cotizacionForm.refacciones_necesarias,
                    mano_obra_costo: cotizacionForm.mano_obra_costo,
                    observaciones_mecanico: cotizacionForm.observaciones_mecanico
                })
            });

            if (response.ok) {
                setSuccess('✅ Cotización enviada exitosamente');
                setTimeout(() => setSuccess(''), 3000);
                setCotizacionForm({
                    refacciones_necesarias: '',
                    mano_obra_costo: '',
                    observaciones_mecanico: ''
                });
                setSelectedOrden(null);
                fetchMisOrdenes();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al enviar cotización');
            }
        } catch (error) {
            setError('Error de conexión al servidor');
        } finally {
            setSubmitting(false);
        }
    };

    const actualizarStatus = async (ordenId, nuevoStatus) => {
        try {
            const response = await fetch(`${API_URL}/ordenes/${ordenId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nuevoStatus })
            });

            if (response.ok) {
                setSuccess(`✅ Estado actualizado a: ${nuevoStatus}`);
                setTimeout(() => setSuccess(''), 3000);
                fetchMisOrdenes();
            } else {
                setError('Error al actualizar estado');
            }
        } catch (error) {
            setError('Error de conexión');
        }
    };

    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        const colors = {
            'En revisión': '#ffc107',
            'En proceso de aceptación': '#17a2b8',
            'Busca de refacciones': '#007bff',
            'Trabajo en proceso': '#6f42c1',
            'Terminado': '#28a745',
            'Entregado': '#20c997',
            'Cancelado': '#dc3545'
        };
        return colors[status] || '#6c757d';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Terminado': return <CheckCircle size={14} />;
            case 'Cancelado': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No registrada';
        return new Date(fecha).toLocaleString('es-MX');
    };

    const formatearDinero = (monto) => {
        if (!monto) return '$0.00';
        return `$${parseFloat(monto).toLocaleString('es-MX')}`;
    };

    const puedeCotizar = (orden) => {
        return orden.status === 'En proceso de aceptación' && !orden.cotizacion_total;
    };

    const puedeIniciarTrabajo = (orden) => {
        return orden.status === 'Busca de refacciones' && orden.aceptacion_cliente === 1;
    };

    const ordenesFiltradas = filtroStatus === 'todos'
        ? ordenes
        : ordenes.filter(orden => orden.status === filtroStatus);

    return (
        <div className="taller-screen">
            {/* Navbar */}
            <nav className="taller-nav">
                <div className="taller-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="taller-nav-right">
                    <div className="user-info-taller">
                        <Wrench size={20} />
                        <div className="user-details">
                            <span className="user-name">{userData?.nombre || 'Mecánico'}</span>
                            <span className="user-role">Taller Mecánico</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-taller-btn">Salir</button>
                </div>
            </nav>

            <main className="taller-main">
                <header className="taller-header">
                    <div className="back-button" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>
                    <h1 className="taller-title">MIS <span className="red-text">ÓRDENES</span></h1>
                    <p className="taller-subtitle">GESTIÓN DE TRABAJOS ASIGNADOS</p>
                </header>

                {/* Alertas */}
                {error && (
                    <div className="alert-error">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}
                {success && (
                    <div className="alert-success">
                        <CheckCircle size={18} /> {success}
                    </div>
                )}

                {/* Filtros */}
                <div className="filtros-taller">
                    <div className="filter-group">
                        <label>Filtrar por estado:</label>
                        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="todos">Todas las órdenes</option>
                            <option value="En revisión">En revisión</option>
                            <option value="En proceso de aceptación">En proceso de aceptación</option>
                            <option value="Busca de refacciones">Busca de refacciones</option>
                            <option value="Trabajo en proceso">Trabajo en proceso</option>
                            <option value="Terminado">Terminado</option>
                            <option value="Entregado">Entregado</option>
                        </select>
                    </div>
                    <button onClick={fetchMisOrdenes} className="btn-refresh-taller">
                        <RefreshCw size={16} /> Actualizar
                    </button>
                </div>

                {loading ? (
                    <div className="loading-taller">
                        <div className="spinner-taller"></div>
                        <p>Cargando tus órdenes...</p>
                    </div>
                ) : ordenesFiltradas.length === 0 ? (
                    <div className="no-ordenes-taller">
                        <CheckCircle size={48} color="#10b981" />
                        <h3>No tienes órdenes asignadas</h3>
                        <p>Cuando te asignen una orden, aparecerá aquí</p>
                    </div>
                ) : (
                    <div className="ordenes-taller-grid">
                        {ordenesFiltradas.map(orden => (
                            <div key={orden.id} className={`orden-taller-card ${selectedOrden === orden.id ? 'expanded' : ''}`}>
                                {/* Cabecera de la orden */}
                                <div className="orden-taller-header" onClick={() => setSelectedOrden(selectedOrden === orden.id ? null : orden.id)}>
                                    <div className="orden-info">
                                        <div className="orden-number">
                                            <ClipboardList size={16} />
                                            <span>Orden #{orden.id}</span>
                                        </div>
                                        <div className="orden-status" style={{ backgroundColor: getStatusColor(orden.status) }}>
                                            {getStatusIcon(orden.status)}
                                            {orden.status}
                                        </div>
                                    </div>
                                    <div className="orden-fecha">
                                        <Calendar size={12} />
                                        {formatearFecha(orden.fecha_creacion)}
                                    </div>
                                </div>

                                {/* Contenido expandido */}
                                {selectedOrden === orden.id && (
                                    <div className="orden-taller-body">
                                        {/* Datos del Cliente */}
                                        <div className="info-seccion">
                                            <h4><User size={16} /> Datos del Cliente</h4>
                                            <div className="info-grid">
                                                <div className="info-row">
                                                    <span className="label">Nombre:</span>
                                                    <span>{orden.cliente_nombre} {orden.cliente_apellido_paterno}</span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label"><Phone size={12} /> Teléfono:</span>
                                                    <span>{orden.cliente_telefono || 'No registrado'}</span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label"><Mail size={12} /> Correo:</span>
                                                    <span>{orden.cliente_correo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Descripción del Problema */}
                                        <div className="info-seccion">
                                            <h4><FileText size={16} /> Problema Reportado</h4>
                                            <p className="problema-texto">{orden.descripcion_problema}</p>
                                        </div>

                                        {/* Fotos del Cliente */}
                                        {orden.fotos && orden.fotos.length > 0 && (
                                            <div className="info-seccion">
                                                <h4><Image size={16} /> Fotos del Equipo</h4>
                                                <div className="fotos-taller-grid">
                                                    {orden.fotos.map((foto, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={`${API_URL}${foto}`}
                                                            alt={`Foto ${idx + 1}`}
                                                            onClick={() => window.open(`${API_URL}${foto}`, '_blank')}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cotización existente */}
                                        {orden.cotizacion_total && (
                                            <div className="info-seccion cotizacion-existente">
                                                <h4><DollarSign size={16} /> Cotización Enviada</h4>
                                                <div className="cotizacion-detalle">
                                                    <div><strong>Mano de obra:</strong> {formatearDinero(orden.mano_obra_costo)}</div>
                                                    <div><strong>Refacciones:</strong> {orden.refacciones_necesarias || 'No especificadas'}</div>
                                                    <div><strong className="total">Total: {formatearDinero(orden.cotizacion_total)}</strong></div>
                                                    {orden.aceptacion_cliente === 1 && (
                                                        <div className="aceptada-badge">✓ Aceptada por el cliente</div>
                                                    )}
                                                    {orden.aceptacion_cliente === 0 && (
                                                        <div className="rechazada-badge">✗ Rechazada por el cliente</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Formulario de Cotización */}
                                        {puedeCotizar(orden) && (
                                            <div className="info-seccion cotizacion-form">
                                                <h4><DollarSign size={16} /> Generar Cotización</h4>
                                                <div className="form-cotizacion">
                                                    <div className="form-group">
                                                        <label>Refacciones necesarias</label>
                                                        <textarea
                                                            name="refacciones_necesarias"
                                                            value={cotizacionForm.refacciones_necesarias}
                                                            onChange={handleCotizacionChange}
                                                            placeholder="Ej: Filtro de aceite, Bujías, Correa de distribución..."
                                                            rows="3"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Costo de mano de obra *</label>
                                                        <input
                                                            type="number"
                                                            name="mano_obra_costo"
                                                            value={cotizacionForm.mano_obra_costo}
                                                            onChange={handleCotizacionChange}
                                                            placeholder="0.00"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Observaciones adicionales</label>
                                                        <textarea
                                                            name="observaciones_mecanico"
                                                            value={cotizacionForm.observaciones_mecanico}
                                                            onChange={handleCotizacionChange}
                                                            placeholder="Notas adicionales para el cliente..."
                                                            rows="2"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => enviarCotizacion(orden.id)}
                                                        disabled={submitting}
                                                        className="btn-enviar-cotizacion"
                                                    >
                                                        <Send size={16} />
                                                        {submitting ? 'Enviando...' : 'Enviar Cotización'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Acciones de Estado */}
                                        <div className="info-seccion acciones-estado">
                                            <h4><Settings size={16} /> Cambiar Estado</h4>
                                            <div className="botones-accion">
                                                {puedeIniciarTrabajo(orden) && (
                                                    <button onClick={() => actualizarStatus(orden.id, 'Trabajo en proceso')} className="btn-accion primary">
                                                        <Wrench size={14} /> Iniciar Trabajo
                                                    </button>
                                                )}
                                                {orden.status === 'Trabajo en proceso' && (
                                                    <button onClick={() => actualizarStatus(orden.id, 'Terminado')} className="btn-accion success">
                                                        <CheckCircle size={14} /> Marcar Terminado
                                                    </button>
                                                )}
                                                {orden.status === 'Terminado' && (
                                                    <button onClick={() => actualizarStatus(orden.id, 'Entregado')} className="btn-accion info">
                                                        <Package size={14} /> Marcar Entregado
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="taller-footer">
                <div className="footer-content">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="footer-tag">SISTEMA DE TALLER</span>
                </div>
            </footer>
        </div>
    );
};

export default Taller;