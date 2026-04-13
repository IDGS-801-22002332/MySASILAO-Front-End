import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle2, XCircle, User, Lock, ClipboardList, RefreshCw, Image } from 'lucide-react';
import { getSession, clearSession } from './authUtils';
import './ClienteSeguimiento.css';

const API_URL = 'http://localhost:3000'; 

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
                document.getElementById('fotos-input').value = '';
                await fetchOrdenes(userData.id);
                alert('Solicitud creada exitosamente');
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

    const handleAceptarRechazar = async (ordenId, aceptado) => {
        try {
            const response = await fetch(`${API_URL}/ordenes/${ordenId}/aceptar-cliente`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                alert(aceptado ? 'Cotización aceptada - Buscando refacciones' : 'Cotización rechazada');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            alert('Error de conexión al servidor');
        }
    };

    const handleLogout = () => {
        clearSession();
        setIsLoggedIn(false);
        setUserData(null);
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

    const mostrarBotonesDecision = (orden) => {
        return orden.status === 'Busca de refacciones' && orden.aceptacion_cliente === null;
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
                        <div
                            className="user-avatar"
                            onClick={handleLogout}
                            style={{ cursor: 'pointer' }}
                            title="Cerrar Sesión"
                        >
                            {userData?.usuario?.substring(0, 2).toUpperCase() || '??'}
                        </div>
                    </div>
                </nav>

                <main className="cliente-main">
                    <header className="cliente-header">
                        <div className="back-button" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
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
                                                <label>Teléfono:</label>
                                                <span>{userData.telefono || 'No registrado'}</span>
                                            </div>
                                            <div className="user-info-item">
                                                <label>Correo electrónico:</label>
                                                <span>{userData.correo}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="cliente-form">
                                    <div className="form-group">
                                        <label>Descripción del Problema *</label>
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
                                        <label>Fotografías (máx. 5)</label>
                                        <input
                                            id="fotos-input"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="form-file"
                                        />
                                        <small className="form-help">
                                            Sube hasta 5 fotos del equipo o del problema (formatos: JPG, PNG, GIF)
                                        </small>
                                        {fotos.length > 0 && (
                                            <div className="fotos-preview">
                                                <small>{fotos.length} archivo(s) seleccionado(s)</small>
                                            </div>
                                        )}
                                    </div>

                                    <button type="submit" disabled={submitting} className="btn-submit">
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
                                    <button
                                        onClick={() => fetchOrdenes(userData?.id)}
                                        className="btn-refresh"
                                        title="Actualizar"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="loading-spinner">Cargando órdenes...</div>
                                ) : ordenes.length === 0 ? (
                                    <div className="no-ordenes">
                                        <p>No tienes solicitudes registradas</p>
                                        <small>Completa el formulario para crear tu primera solicitud</small>
                                    </div>
                                ) : (
                                    <div className="ordenes-list">
                                        {ordenes.map(orden => {
                                            const isOpen = ordenAbierta === orden.id;

                                            return (
                                                <div
                                                    key={orden.id}
                                                    className={`orden-card ${isOpen ? 'open' : ''}`}
                                                >
                                                    <div
                                                        className="orden-tab"
                                                        onClick={() => toggleOrden(orden.id)}
                                                    >
                                                        <div className="orden-tab-left">
                                                            <div className="orden-id">Orden #{orden.id}</div>
                                                            <div
                                                                className="orden-status"
                                                                style={{ backgroundColor: getStatusColor(orden.status) }}
                                                            >
                                                                {orden.status}
                                                            </div>
                                                        </div>

                                                        <div className="orden-tab-right">
                                                            {new Date(orden.fecha_creacion).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <div className={`orden-content ${isOpen ? 'show' : ''}`}>
                                                        <div className="orden-body">
                                                            <div className="orden-fecha">
                                                                Fecha: {new Date(orden.fecha_creacion).toLocaleString()}
                                                            </div>

                                                            {orden.descripcion_problema && (
                                                                <div className="orden-descripcion">
                                                                    <strong>Problema reportado:</strong>
                                                                    <p>{orden.descripcion_problema}</p>
                                                                </div>
                                                            )}

                                                            {/* 🔥 SECCIÓN DE FOTOS AGREGADA */}
                                                            {orden.fotos && orden.fotos.length > 0 && (
                                                                <div className="orden-fotos">
                                                                    <strong><Image size={14} /> Fotografías del equipo:</strong>
                                                                    <div className="fotos-miniaturas" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                                                        {orden.fotos.map((foto, idx) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={`${API_URL}${foto}`}
                                                                                alt={`Foto ${idx + 1}`}
                                                                                className="foto-thumbnail"
                                                                                onClick={() => window.open(`${API_URL}${foto}`, '_blank')}
                                                                                style={{
                                                                                    width: '80px',
                                                                                    height: '80px',
                                                                                    objectFit: 'cover',
                                                                                    borderRadius: '8px',
                                                                                    cursor: 'pointer',
                                                                                    border: '2px solid #e0e0e0',
                                                                                    transition: 'transform 0.2s'
                                                                                }}
                                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {orden.refacciones_necesarias && (
                                                                <div className="orden-refacciones">
                                                                    <strong>Refacciones necesarias:</strong>
                                                                    <pre>{orden.refacciones_necesarias}</pre>
                                                                </div>
                                                            )}

                                                            {orden.cotizacion_total && (
                                                                <div className="orden-cotizacion">
                                                                    <strong>Cotización total:</strong> $
                                                                    {parseFloat(orden.cotizacion_total).toLocaleString('es-MX')}
                                                                </div>
                                                            )}

                                                            {orden.mano_obra_costo && (
                                                                <div className="orden-mano-obra">
                                                                    <strong>Mano de obra:</strong> $
                                                                    {parseFloat(orden.mano_obra_costo).toLocaleString('es-MX')}
                                                                </div>
                                                            )}

                                                            {orden.mecanico_asignado_nombre && (
                                                                <div className="orden-mecanico">
                                                                    <strong>Mecánico:</strong> {orden.mecanico_asignado_nombre}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {mostrarBotonesDecision(orden) && (
                                                            <div className="orden-buttons">
                                                                <button
                                                                    className="btn-decision aceptar"
                                                                    onClick={() => handleAceptarRechazar(orden.id, true)}
                                                                >
                                                                    <CheckCircle2 size={18} /> ACEPTAR
                                                                </button>

                                                                <button
                                                                    className="btn-decision rechazar"
                                                                    onClick={() => handleAceptarRechazar(orden.id, false)}
                                                                >
                                                                    <XCircle size={18} /> RECHAZAR
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
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