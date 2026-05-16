import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Taller.css';
import {
    Send, ArrowLeft, Settings, Camera, Calendar, ClipboardList, Wrench,
    User, Phone, Mail, DollarSign, Package, FileText, Image,
    CheckCircle, AlertCircle, RefreshCw, Clock, Eye, Save
} from 'lucide-react';
import { getSession, clearSession } from './authUtils';
import { useConfig } from '../context/ConfigContext';
import { ToastContainer } from './ToastNotification';

const Taller = () => {
    const { URL } = useConfig();
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
    const [notifications, setNotifications] = useState([]);

    const [editandoCotizacion, setEditandoCotizacion] = useState(null);
    const [cotizacionEditForm, setCotizacionEditForm] = useState({
        refacciones_necesarias: '',
        mano_obra_costo: '',
        observaciones_mecanico: ''
    });
    const [updating, setUpdating] = useState(false);

    const showNotification = (message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type, duration }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const iniciarEdicionCotizacion = (orden) => {
        setEditandoCotizacion(orden.id);
        setCotizacionEditForm({
            refacciones_necesarias: orden.refacciones_necesarias || '',
            mano_obra_costo: orden.mano_obra_costo || '',
            observaciones_mecanico: orden.observaciones_mecanico || ''
        });
    };

    const actualizarCotizacion = async (ordenId) => {
        if (!cotizacionEditForm.mano_obra_costo) {
            showNotification('Por favor ingresa el costo de mano de obra', 'warning');
            return;
        }

        setUpdating(true);
        setError('');

        try {
            const response = await fetch(`${URL}/ordenes/${ordenId}/actualizar-cotizacion-mecanico`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refacciones_necesarias: cotizacionEditForm.refacciones_necesarias,
                    mano_obra_costo: cotizacionEditForm.mano_obra_costo,
                    observaciones_mecanico: cotizacionEditForm.observaciones_mecanico
                })
            });

            if (response.ok) {
                showNotification('Cotizacion actualizada exitosamente. El cliente debera aceptarla nuevamente.', 'success', 5000);
                setEditandoCotizacion(null);
                setCotizacionEditForm({
                    refacciones_necesarias: '',
                    mano_obra_costo: '',
                    observaciones_mecanico: ''
                });
                fetchMisOrdenes();
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || 'Error al actualizar cotizacion', 'error');
            }
        } catch (error) {
            showNotification('Error de conexion al servidor', 'error');
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const session = getSession();
        console.log("Sesion Mecanico:", session);

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
            const response = await fetch(`${URL}/ordenes?rol=mecanico&usuarioId=${session.id}`);
            const data = await response.json();
            console.log('Mis ordenes:', data);
            setOrdenes(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar tus ordenes');
            showNotification('Error al cargar tus ordenes', 'error');
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
            showNotification('Por favor ingresa el costo de mano de obra', 'warning');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const cotizacion_total = parseFloat(cotizacionForm.mano_obra_costo);

            const response = await fetch(`${URL}/ordenes/${ordenId}/cotizacion-mecanico`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refacciones_necesarias: cotizacionForm.refacciones_necesarias,
                    mano_obra_costo: cotizacionForm.mano_obra_costo,
                    observaciones_mecanico: cotizacionForm.observaciones_mecanico
                })
            });

            if (response.ok) {
                showNotification('Cotizacion enviada exitosamente', 'success');
                setCotizacionForm({
                    refacciones_necesarias: '',
                    mano_obra_costo: '',
                    observaciones_mecanico: ''
                });
                setSelectedOrden(null);
                fetchMisOrdenes();
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || 'Error al enviar cotizacion', 'error');
            }
        } catch (error) {
            showNotification('Error de conexion al servidor', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const actualizarStatus = async (ordenId, nuevoStatus) => {
        try {
            const response = await fetch(`${URL}/ordenes/${ordenId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nuevoStatus })
            });

            if (response.ok) {
                showNotification(`Estado actualizado a: ${nuevoStatus}`, 'success');
                fetchMisOrdenes();
            } else {
                showNotification('Error al actualizar estado', 'error');
            }
        } catch (error) {
            showNotification('Error de conexion', 'error');
        }
    };

    const handleLogout = () => {
        clearSession();
        navigate('/login');
        showNotification('Sesion cerrada correctamente', 'info');
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
            <ToastContainer notifications={notifications} removeNotification={removeNotification} />

            <nav className="taller-nav">
                <div className="taller-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRICOLA
                </div>
                <div className="taller-nav-right">
                    <div className="user-info-taller">
                        <Wrench size={20} />
                        <div className="user-details">
                            <span className="user-name">{userData?.nombre || 'Mecanico'}</span>
                            <span className="user-role">Taller Mecanico</span>
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
                    <h1 className="taller-title">MIS <span className="red-text">ORDENES</span></h1>
                    <p className="taller-subtitle">GESTION DE TRABAJOS ASIGNADOS</p>
                </header>

                <div className="filtros-taller">
                    <div className="filter-group">
                        <label>Filtrar por estado:</label>
                        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="todos">Todas las ordenes</option>
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
                        <p>Cargando tus ordenes...</p>
                    </div>
                ) : ordenesFiltradas.length === 0 ? (
                    <div className="no-ordenes-taller">
                        <CheckCircle size={48} color="#10b981" />
                        <h3>No tienes ordenes asignadas</h3>
                        <p>Cuando te asignen una orden, aparecera aqui</p>
                    </div>
                ) : (
                    <div className="ordenes-taller-grid">
                        {ordenesFiltradas.map(orden => (
                            <div key={orden.id} className={`orden-taller-card ${selectedOrden === orden.id ? 'expanded' : ''}`}>
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

                                {selectedOrden === orden.id && (
                                    <div className="orden-taller-body">
                                        <div className="info-seccion">
                                            <h4><User size={16} /> Datos del Cliente</h4>
                                            <div className="info-grid">
                                                <div className="info-row">
                                                    <span className="label">Nombre:</span>
                                                    <span>{orden.cliente_nombre} {orden.cliente_apellido_paterno}</span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label"><Phone size={12} /> Telefono:</span>
                                                    <span>{orden.cliente_telefono || 'No registrado'}</span>
                                                </div>
                                                <div className="info-row">
                                                    <span className="label"><Mail size={12} /> Correo:</span>
                                                    <span>{orden.cliente_correo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="info-seccion">
                                            <h4><FileText size={16} /> Problema Reportado</h4>
                                            <p className="problema-texto">{orden.descripcion_problema}</p>
                                        </div>

                                        {orden.fotos && orden.fotos.length > 0 && (
                                            <div className="info-seccion">
                                                <h4><Image size={16} /> Fotos del Equipo</h4>
                                                <div className="fotos-taller-grid">
                                                    {orden.fotos.map((foto, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={`${URL}${foto}`}
                                                            alt={`Foto ${idx + 1}`}
                                                            onClick={() => window.open(`${URL}${foto}`, '_blank')}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {!puedeCotizar(orden) && orden.cotizacion_total && (
                                            <div className="info-seccion cotizacion-existente">
                                                <h4><DollarSign size={16} /> Cotizacion {orden.status === 'Busca de refacciones' ? 'Actual' : 'Enviada'}</h4>
                                                <div className="cotizacion-detalle">
                                                    <div><strong>Mano de obra:</strong> {formatearDinero(orden.mano_obra_costo)}</div>
                                                    <div><strong>Refacciones:</strong> {orden.refacciones_necesarias || 'No especificadas'}</div>
                                                    <div><strong className="total">Total: {formatearDinero(orden.cotizacion_total)}</strong></div>
                                                    {orden.aceptacion_cliente === 1 && (
                                                        <div className="aceptada-badge">Aceptada por el cliente</div>
                                                    )}
                                                    {orden.aceptacion_cliente === 0 && (
                                                        <div className="rechazada-badge">Rechazada por el cliente</div>
                                                    )}
                                                    {orden.aceptacion_cliente === null && orden.status === 'Busca de refacciones' && (
                                                        <div className="pendiente-badge">Esperando respuesta del cliente</div>
                                                    )}
                                                </div>

                                                {orden.status === 'Busca de refacciones' && orden.aceptacion_cliente === 1 && (
                                                    <button
                                                        onClick={() => iniciarEdicionCotizacion(orden)}
                                                        className="btn-editar-cotizacion"
                                                        style={{ marginTop: '12px', width: '100%' }}
                                                    >
                                                        <RefreshCw size={14} /> Actualizar Cotizacion (Agregar mas refacciones)
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {editandoCotizacion === orden.id && (
                                            <div className="info-seccion cotizacion-form edit-mode">
                                                <h4><RefreshCw size={16} /> Actualizar Cotizacion</h4>
                                                <div className="form-cotizacion">
                                                    <div className="form-group">
                                                        <label>Refacciones adicionales o actualizadas</label>
                                                        <textarea
                                                            name="refacciones_necesarias"
                                                            value={cotizacionEditForm.refacciones_necesarias}
                                                            onChange={(e) => setCotizacionEditForm(prev => ({ ...prev, refacciones_necesarias: e.target.value }))}
                                                            placeholder="Ej: Filtro de aceite, Bujias, Correa de distribucion, Sensor de oxigeno..."
                                                            rows="3"
                                                        />
                                                        <small>Puedes agregar mas refacciones o modificar las existentes</small>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Costo de mano de obra actualizado *</label>
                                                        <input
                                                            type="number"
                                                            name="mano_obra_costo"
                                                            value={cotizacionEditForm.mano_obra_costo}
                                                            onChange={(e) => setCotizacionEditForm(prev => ({ ...prev, mano_obra_costo: e.target.value }))}
                                                            placeholder="0.00"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Observaciones actualizadas</label>
                                                        <textarea
                                                            name="observaciones_mecanico"
                                                            value={cotizacionEditForm.observaciones_mecanico}
                                                            onChange={(e) => setCotizacionEditForm(prev => ({ ...prev, observaciones_mecanico: e.target.value }))}
                                                            placeholder="Notas adicionales para el cliente sobre los cambios..."
                                                            rows="2"
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button
                                                            onClick={() => actualizarCotizacion(orden.id)}
                                                            disabled={updating}
                                                            className="btn-enviar-cotizacion"
                                                        >
                                                            <Send size={16} />
                                                            {updating ? 'Actualizando...' : 'Actualizar Cotizacion'}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditandoCotizacion(null)}
                                                            className="btn-cancelar"
                                                            style={{ background: '#6c757d' }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {puedeCotizar(orden) && (
                                            <div className="info-seccion cotizacion-form">
                                                <h4><DollarSign size={16} /> Generar Cotizacion</h4>
                                                <div className="form-cotizacion">
                                                    <div className="form-group">
                                                        <label>Refacciones necesarias</label>
                                                        <textarea
                                                            name="refacciones_necesarias"
                                                            value={cotizacionForm.refacciones_necesarias}
                                                            onChange={handleCotizacionChange}
                                                            placeholder="Ej: Filtro de aceite, Bujias, Correa de distribucion..."
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
                                                        {submitting ? 'Enviando...' : 'Enviar Cotizacion'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

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
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRICOLA</span>
                    <span className="footer-tag">SISTEMA DE TALLER</span>
                </div>
            </footer>
        </div>
    );
};

export default Taller;