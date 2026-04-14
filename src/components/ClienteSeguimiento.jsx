import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Camera, CheckCircle2, XCircle, User, Lock, ClipboardList, RefreshCw, 
    Image, DollarSign, Wrench, Package, MessageSquare, CheckCircle, AlertCircle,
    Clock, Phone, Mail, Calendar, FileText, ThumbsUp, ThumbsDown, PlusCircle,
    Loader2, CreditCard, Tag, ChevronDown, ChevronUp, Eye, Maximize2, Minimize2
} from 'lucide-react';
import { getSession, clearSession } from './authUtils';
import './ClienteSeguimiento.css';

const API_URL = 'https://mysasilao-back-end-production.up.railway.app';

const ClienteSeguimiento = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        descripcion_problema: ''
    });
    const [fotos, setFotos] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [processingOrder, setProcessingOrder] = useState(null);
    const [ordenAbierta, setOrdenAbierta] = useState(null);

    const toggleOrden = (id) => {
        setOrdenAbierta(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        const session = getSession();
        console.log("SESSION ACTUAL:", session);
        if (session && session.id) {
            setIsLoggedIn(true);
            setUserData(session);
            fetchOrdenes(session.id);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchOrdenes = async (usuarioId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/ordenes?rol=cliente&usuarioId=${usuarioId}`);
            const data = await response.json();
            console.log('Órdenes obtenidas:', data);
            setOrdenes(data);
        } catch (error) {
            console.error('Error al cargar órdenes:', error);
            setError('Error al cargar tus órdenes');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFotos(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const formDataToSend = new FormData();
        formDataToSend.append('cliente_nombre', userData.nombre || '');
        formDataToSend.append('cliente_apellido_paterno', userData.apellidoPaterno || '');
        formDataToSend.append('cliente_apellido_materno', userData.apellidoMaterno || '');
        formDataToSend.append('cliente_correo', userData.correo || '');
        formDataToSend.append('cliente_telefono', userData.telefono || '');
        formDataToSend.append('descripcion_problema', formData.descripcion_problema);
        formDataToSend.append('creado_por', userData.id || '');

        fotos.forEach(foto => {
            formDataToSend.append('fotos', foto);
        });

        try {
            const response = await fetch(`${API_URL}/ordenes`, {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                setFormData({ descripcion_problema: '' });
                setFotos([]);
                const fileInput = document.getElementById('fotos-input');
                if (fileInput) fileInput.value = '';
                await fetchOrdenes(userData.id);
                alert('✅ Solicitud creada exitosamente');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al crear la solicitud');
            }
        } catch (error) {
            setError('Error de conexión al servidor');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAceptarRechazar = useCallback(async (ordenId, aceptado) => {
        if (processingOrder === ordenId) {
            return;
        }

        const ordenActual = ordenes.find(o => o.id === ordenId);
        
        if (ordenActual.aceptacion_cliente !== null && ordenActual.aceptacion_cliente !== undefined) {
            alert('⚠️ Esta cotización ya fue procesada');
            return;
        }

        if (ordenActual.status !== 'En proceso de aceptación') {
            alert(`⚠️ No puedes procesar esta cotización porque la orden está en estado: ${ordenActual.status}`);
            return;
        }

        if (!ordenActual.cotizacion_total || ordenActual.cotizacion_total <= 0) {
            alert('⚠️ No hay una cotización válida');
            return;
        }

        setProcessingOrder(ordenId);

        try {
            const response = await fetch(`${API_URL}/ordenes/${ordenId}/aceptar-cliente`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aceptado })
            });

            if (response.ok) {
                const result = await response.json();
                
                setOrdenes(prevOrdenes =>
                    prevOrdenes.map(orden =>
                        orden.id === ordenId
                            ? { ...orden, status: result.status, aceptacion_cliente: aceptado ? 1 : 0 }
                            : orden
                    )
                );
                
                const mensaje = aceptado 
                    ? '✅ Cotización aceptada. El mecánico buscará las refacciones.' 
                    : '❌ Cotización rechazada. Se ha cancelado la orden.';
                alert(mensaje);
                
                await fetchOrdenes(userData.id);
                setOrdenAbierta(null);
            } else {
                const errorData = await response.json();
                alert(`❌ Error: ${errorData.message || 'No se pudo procesar'}`);
                await fetchOrdenes(userData.id);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión al servidor');
        } finally {
            setProcessingOrder(null);
        }
    }, [ordenes, userData?.id, fetchOrdenes]);

    const handleLogout = () => {
        clearSession();
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
    };

    const getStatusColor = (status) => {
        const colors = {
            'En revisión': '#f59e0b',
            'En proceso de aceptación': '#3b82f6',
            'Busca de refacciones': '#8b5cf6',
            'Trabajo en proceso': '#ec489a',
            'Terminado': '#10b981',
            'Entregado': '#06b6d4',
            'Cancelado': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Terminado': return <CheckCircle size={16} />;
            case 'Cancelado': return <XCircle size={16} />;
            case 'En revisión': return <Clock size={16} />;
            case 'Trabajo en proceso': return <Wrench size={16} />;
            case 'En proceso de aceptación': return <Clock size={16} />;
            case 'Busca de refacciones': return <Package size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const debeMostrarBotonesDecision = (orden) => {
        return orden.status === 'En proceso de aceptación' && 
               (orden.aceptacion_cliente === null || orden.aceptacion_cliente === undefined) &&
               orden.cotizacion_total > 0 &&
               processingOrder !== orden.id;
    };

    const formatearDinero = (monto) => {
        if (!monto || monto <= 0) return null;
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    return (
        <div className="cliente-screen">
            {!isLoggedIn && (
                <div className="modal-overlay-blur">
                    <div className="auth-alert-card">
                        <div className="auth-alert-icon">
                            <Lock size={48} color="#e63946" />
                        </div>
                        <h2>ACCESO RESTRINGIDO</h2>
                        <p>Para consultar el avance de tu equipo, por favor inicia sesión.</p>
                        <button className="btn-login-redirect" onClick={() => navigate('/login')}>
                            INICIAR SESIÓN
                        </button>
                        <button className="btn-back-home" onClick={() => navigate('/')}>
                            VOLVER AL MENÚ
                        </button>
                    </div>
                </div>
            )}

            <div className={`content-wrapper ${!isLoggedIn ? 'content-blurred' : ''}`}>
                <nav className="cliente-nav">
                    <div className="cliente-logo">
                        <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                    </div>
                    <div className="nav-icons">
                        <div className="user-avatar" onClick={handleLogout} title="Cerrar Sesión">
                            {userData?.usuario?.substring(0, 2).toUpperCase() || '??'}
                        </div>
                    </div>
                </nav>

                <main className="cliente-main">
                    <header className="cliente-header">
                        <div className="back-button" onClick={() => navigate("/")}>
                            <ArrowLeft size={14} /> VOLVER AL INICIO
                        </div>
                        <h1 className="cliente-title">ESTADO DE <span className="red-text">SERVICIO</span></h1>
                        <p className="cliente-subtitle">CONSULTA EL AVANCE DE TU EQUIPO EN TIEMPO REAL</p>
                    </header>

                    <div className="two-column-layout">
                        {/* COLUMNA IZQUIERDA - FORMULARIO */}
                        <div className="form-column">
                            <div className="form-card">
                                <h2 className="form-title">
                                    <ClipboardList size={20} /> NUEVA SOLICITUD DE SERVICIO
                                </h2>

                                {error && <div className="error-message">{error}</div>}

                                {userData && (
                                    <div className="user-info-card">
                                        <div className="user-info-header">
                                            <User size={18} />
                                            <span>Información del Cliente</span>
                                        </div>
                                        <div className="user-info-grid">
                                            <div className="user-info-item">
                                                <label>Nombre completo:</label>
                                                <span>{userData.nombre} {userData.apellidoPaterno} {userData.apellidoMaterno}</span>
                                            </div>
                                            <div className="user-info-item">
                                                <label><Phone size={14} /> Teléfono:</label>
                                                <span>{userData.telefono || 'No registrado'}</span>
                                            </div>
                                            <div className="user-info-item">
                                                <label><Mail size={14} /> Correo:</label>
                                                <span>{userData.correo}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="cliente-form">
                                    <div className="form-group">
                                        <label><FileText size={14} /> Descripción del Problema *</label>
                                        <textarea
                                            name="descripcion_problema"
                                            value={formData.descripcion_problema}
                                            onChange={handleInputChange}
                                            required
                                            rows="6"
                                            className="form-textarea"
                                            placeholder="Describa detalladamente el problema que presenta su equipo..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><Camera size={14} /> Fotografías (máx. 5)</label>
                                        <input
                                            id="fotos-input"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="form-file"
                                        />
                                        <small className="form-help">
                                            <Image size={12} /> Sube hasta 5 fotos (JPG, PNG, GIF)
                                        </small>
                                        {fotos.length > 0 && (
                                            <div className="fotos-preview">
                                                <small><Camera size={12} /> {fotos.length} archivo(s)</small>
                                            </div>
                                        )}
                                    </div>

                                    <button type="submit" disabled={submitting} className="btn-submit">
                                        {submitting ? <Loader2 size={18} className="spin" /> : <PlusCircle size={18} />}
                                        {submitting ? 'ENVIANDO...' : 'CREAR SOLICITUD'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA - LISTA DE ÓRDENES */}
                        <div className="ordenes-column">
                            <div className="ordenes-card">
                                <div className="ordenes-header">
                                    <h2 className="form-title">
                                        <ClipboardList size={20} /> MIS SOLICITUDES
                                    </h2>
                                    <button onClick={() => fetchOrdenes(userData?.id)} className="btn-refresh" title="Actualizar">
                                        <RefreshCw size={16} />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="loading-spinner">
                                        <Loader2 size={24} className="spin" /> Cargando...
                                    </div>
                                ) : ordenes.length === 0 ? (
                                    <div className="no-ordenes">
                                        <ClipboardList size={48} color="#999" />
                                        <p>No tienes solicitudes registradas</p>
                                        <small>Completa el formulario para crear tu primera solicitud</small>
                                    </div>
                                ) : (
                                    <div className="ordenes-list">
                                        {ordenes.map(orden => {
                                            const isOpen = ordenAbierta === orden.id;
                                            const mostrarBotones = debeMostrarBotonesDecision(orden);
                                            const estaProcesando = processingOrder === orden.id;
                                            const tieneCotizacion = orden.cotizacion_total > 0;

                                            return (
                                                <div key={orden.id} className={`orden-card ${isOpen ? 'open' : ''}`}>
                                                    {/* Header siempre visible */}
                                                    <div className="orden-tab" onClick={() => toggleOrden(orden.id)}>
                                                        <div className="orden-tab-left">
                                                            <div className="orden-id">
                                                                <Tag size={14} /> Orden #{orden.id}
                                                            </div>
                                                            <div className="orden-status" style={{ backgroundColor: getStatusColor(orden.status) }}>
                                                                {getStatusIcon(orden.status)}
                                                                {orden.status}
                                                            </div>
                                                            {tieneCotizacion && orden.status === 'En proceso de aceptación' && (
                                                                <div className="pending-badge">
                                                                    <Clock size={12} /> ¡Requiere tu respuesta!
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="orden-tab-right">
                                                            <Calendar size={14} />
                                                            {new Date(orden.fecha_creacion).toLocaleDateString()}
                                                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </div>
                                                    </div>

                                                    {/* Contenido expandible CON SCROLL */}
                                                    {isOpen && (
                                                        <div className="orden-content-expanded">
                                                            <div className="orden-content-scroll">
                                                                {/* Fecha detallada */}
                                                                <div className="info-row-expanded">
                                                                    <Calendar size={16} />
                                                                    <span><strong>Fecha de creación:</strong> {new Date(orden.fecha_creacion).toLocaleString()}</span>
                                                                </div>

                                                                {/* Problema */}
                                                                <div className="info-section-expanded">
                                                                    <h4><FileText size={16} /> Problema reportado</h4>
                                                                    <p className="problema-texto-expanded">{orden.descripcion_problema}</p>
                                                                </div>

                                                                {/* Fotos */}
                                                                {orden.fotos && orden.fotos.length > 0 && (
                                                                    <div className="info-section-expanded">
                                                                        <h4><Image size={16} /> Fotografías del equipo</h4>
                                                                        <div className="fotos-grid-expanded">
                                                                            {orden.fotos.map((foto, idx) => (
                                                                                <img
                                                                                    key={idx}
                                                                                    src={`${API_URL}${foto}`}
                                                                                    alt={`Foto ${idx + 1}`}
                                                                                    className="foto-expanded"
                                                                                    onClick={() => window.open(`${API_URL}${foto}`, '_blank')}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Cotización */}
                                                                {tieneCotizacion && (
                                                                    <div className={`info-section-expanded cotizacion-expanded ${orden.status === 'En proceso de aceptación' ? 'highlight' : ''}`}>
                                                                        <h4><DollarSign size={16} /> Detalle de la Cotización</h4>
                                                                        <div className="cotizacion-grid-expanded">
                                                                            <div className="cotizacion-row">
                                                                                <span className="label">Mano de obra:</span>
                                                                                <span className="value">{formatearDinero(orden.mano_obra_costo)}</span>
                                                                            </div>
                                                                            {orden.refacciones_necesarias && (
                                                                                <div className="cotizacion-row">
                                                                                    <span className="label">Refacciones:</span>
                                                                                    <span className="value refacciones">{orden.refacciones_necesarias}</span>
                                                                                </div>
                                                                            )}
                                                                            <div className="cotizacion-row total">
                                                                                <span className="label">Total:</span>
                                                                                <span className="value">{formatearDinero(orden.cotizacion_total)}</span>
                                                                            </div>
                                                                            {orden.observaciones_mecanico && (
                                                                                <div className="observaciones-expanded">
                                                                                    <MessageSquare size={14} />
                                                                                    <span>{orden.observaciones_mecanico}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {orden.aceptacion_cliente === 1 && (
                                                                            <div className="aceptada-expanded">
                                                                                <ThumbsUp size={16} /> Cotización aceptada
                                                                            </div>
                                                                        )}
                                                                        {orden.aceptacion_cliente === 0 && (
                                                                            <div className="rechazada-expanded">
                                                                                <ThumbsDown size={16} /> Cotización rechazada
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Mecánico asignado */}
                                                                {orden.mecanico_asignado_nombre && (
                                                                    <div className="info-row-expanded">
                                                                        <Wrench size={16} />
                                                                        <span><strong>Mecánico asignado:</strong> {orden.mecanico_asignado_nombre}</span>
                                                                    </div>
                                                                )}

                                                                {/* Fechas importantes */}
                                                                <div className="fechas-grid-expanded">
                                                                    {orden.fecha_asignacion && (
                                                                        <div className="fecha-item">
                                                                            <Clock size={12} />
                                                                            <span>Asignado: {new Date(orden.fecha_asignacion).toLocaleDateString()}</span>
                                                                        </div>
                                                                    )}
                                                                    {orden.fecha_terminado && (
                                                                        <div className="fecha-item">
                                                                            <CheckCircle size={12} />
                                                                            <span>Terminado: {new Date(orden.fecha_terminado).toLocaleDateString()}</span>
                                                                        </div>
                                                                    )}
                                                                    {orden.fecha_entregado && (
                                                                        <div className="fecha-item">
                                                                            <Package size={12} />
                                                                            <span>Entregado: {new Date(orden.fecha_entregado).toLocaleDateString()}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Botones FIJOS en la parte inferior */}
                                                            {mostrarBotones && (
                                                                <div className="botones-fijos">
                                                                    <button
                                                                        className="btn-aceptar"
                                                                        onClick={() => handleAceptarRechazar(orden.id, true)}
                                                                        disabled={estaProcesando}
                                                                    >
                                                                        {estaProcesando ? <Loader2 size={20} className="spin" /> : <ThumbsUp size={20} />}
                                                                        {estaProcesando ? 'PROCESANDO...' : 'ACEPTAR COTIZACIÓN'}
                                                                    </button>
                                                                    <button
                                                                        className="btn-rechazar"
                                                                        onClick={() => handleAceptarRechazar(orden.id, false)}
                                                                        disabled={estaProcesando}
                                                                    >
                                                                        {estaProcesando ? <Loader2 size={20} className="spin" /> : <ThumbsDown size={20} />}
                                                                        {estaProcesando ? 'PROCESANDO...' : 'RECHAZAR COTIZACIÓN'}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="sucursales-footer">
                    <div className="footer-brand-low">
                        <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                        <span className="copy-text">© 2024 Maquinaria y Servicio Agrícola.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ClienteSeguimiento;