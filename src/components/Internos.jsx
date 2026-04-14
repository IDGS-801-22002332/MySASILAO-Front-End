// src/Internos.jsx - VERSIÓN CON NUEVO DISEÑO MINIMALISTA
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ClipboardList, Clock, FileText, Activity,
    Wrench, Users, User, Phone, Mail, Calendar, DollarSign, CheckCircle,
    XCircle, AlertCircle, RefreshCw, Search, Filter, Eye, UserPlus, Camera,
    CalendarDays, UsersRound, CircleCheckBig, BookmarkCheck, Package, ListChecks,
    CirclePlay, X
} from 'lucide-react';
import { getSession, clearSession } from './authUtils';
import './Internos.css'; 

const API_URL = 'https://mysasilao-back-end-production.up.railway.app';

const Internos = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [ordenes, setOrdenes] = useState([]);
    const [ordenesSinAsignar, setOrdenesSinAsignar] = useState([]);
    const [ordenesAsignadas, setOrdenesAsignadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mecanicos, setMecanicos] = useState([]);
    const [selectedOrden, setSelectedOrden] = useState(null);
    const [selectedMecanico, setSelectedMecanico] = useState({});
    const [asignando, setAsignando] = useState({});
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState('');
    const [tabActiva, setTabActiva] = useState('sinAsignar');

    const [alerta, setAlerta] = useState({
        visible: false,
        mensaje: '',
        tipo: ''
    });

    const mostrarAlerta = (mensaje, tipo = 'success') => {
        setAlerta({ visible: true, mensaje, tipo });
        setTimeout(() => {
            setAlerta({ visible: false, mensaje: '', tipo: '' });
        }, 3000);
    };

    useEffect(() => {
        const session = getSession();
        if (!session || (session.rol !== 'Interno' && session.rol !== 'Admin')) {
            navigate('/login');
            return;
        }
        setUserData(session);
        fetchOrdenes();
        fetchMecanicos();
    }, []);

    const fetchOrdenes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/ordenes?rol=interno`);
            const data = await response.json();
            setOrdenes(data);
            const sinAsignar = data.filter(orden => !orden.mecanico_asignado_id);
            const asignadas = data.filter(orden => orden.mecanico_asignado_id);
            setOrdenesSinAsignar(sinAsignar);
            setOrdenesAsignadas(asignadas);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar órdenes');
        } finally {
            setLoading(false);
        }
    };

    const fetchMecanicos = async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios?rol=Mecanico`);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data)) setMecanicos(data);
            else setMecanicos([]);
        } catch (error) {
            console.error('Error al cargar mecánicos:', error);
            setMecanicos([]);
        }
    };

    const asignarMecanico = async (ordenId, mecanicoId) => {
        if (!mecanicoId) {
            mostrarAlerta('Por favor selecciona un mecánico', 'error');
            return;
        }
        setAsignando(prev => ({ ...prev, [ordenId]: true }));
        try {
            const response = await fetch(`${API_URL}/ordenes/${ordenId}/asignar-mecanico`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mecanico_id: parseInt(mecanicoId) })
            });
            if (response.ok) {
                mostrarAlerta('Mecánico asignado exitosamente', 'success');
                fetchOrdenes();
                setSelectedMecanico(prev => ({ ...prev, [ordenId]: '' }));
                setSelectedOrden(null);
            } else {
                const errorData = await response.json();
                mostrarAlerta(errorData.message || 'No se pudo asignar', 'error');
            }
        } catch (error) {
            mostrarAlerta('Error de conexión al servidor', 'error');
        } finally {
            setAsignando(prev => ({ ...prev, [ordenId]: false }));
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
                mostrarAlerta(`Estado actualizado a: ${nuevoStatus}`, 'success');
                fetchOrdenes();
            } else {
                mostrarAlerta('Error al actualizar estado', 'error');
            }
        } catch (error) {
            mostrarAlerta('Error de conexión', 'error');
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
            case 'Cancelado': return <XCircle size={14} />;
            case 'En revisión': return <AlertCircle size={14} />;
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

    const filtrarOrdenes = (ordenesList) => {
        if (!busqueda) return ordenesList;
        return ordenesList.filter(orden =>
            orden.id.toString().includes(busqueda) ||
            orden.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
            orden.cliente_apellido_paterno?.toLowerCase().includes(busqueda.toLowerCase()) ||
            orden.mecanico_asignado_nombre?.toLowerCase().includes(busqueda.toLowerCase())
        );
    };

    const ordenesMostradas = tabActiva === 'sinAsignar'
        ? filtrarOrdenes(ordenesSinAsignar)
        : filtrarOrdenes(ordenes);

    // Filtro adicional por estado en la pestaña "todas"
    const ordenesFiltradasFinal = tabActiva === 'todas' && filtroStatus !== 'todos'
        ? ordenesMostradas.filter(orden => orden.status === filtroStatus)
        : ordenesMostradas;

    return (
        <div className="internos-screen">
            {/* Navbar estilo cliente */}
            <nav className="internos-nav">
                <div className="internos-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="internos-nav-right">
                    <div className="portal-tag">CONTROL INTERNO</div>
                    <div className="user-info-header">
                        <div className="user-avatar-small">
                            {userData?.usuario?.substring(0, 2).toUpperCase() || 'IN'}
                        </div>
                        <span className="user-name-header">{userData?.nombre || 'Interno'}</span>
                        <button onClick={handleLogout} className="logout-btn-header">Salir</button>
                    </div>
                </div>
            </nav>

            <main className="internos-container">
                {alerta.visible && (
                    <div className={`custom-alert ${alerta.tipo}`}>
                        {alerta.mensaje}
                    </div>
                )}
                
                <header className="internos-header">
                    <button className="internos-back" onClick={() => navigate('/')}>
                        <ArrowLeft size={16} /> REGRESAR AL DASHBOARD
                    </button>
                    <h1 className="internos-title">GESTIÓN DE <span className="red-text">OPERACIONES</span></h1>
                    <p className="internos-subtitle">ASIGNACIÓN DE MECÁNICOS Y SEGUIMIENTO DE ÓRDENES</p>
                </header>

                {/* Estadísticas rápidas - Estilo minimalista */}
                <div className="stats-grid">
                    <div className="stat-card-interno">
                        <UserPlus size={24} className="stat-icon" />
                        <span className="stat-number">{ordenesSinAsignar.length}</span>
                        <span className="stat-label">Por Asignar</span>
                    </div>
                    <div className="stat-card-interno">
                        <Wrench size={24} className="stat-icon" />
                        <span className="stat-number">{ordenesAsignadas.length}</span>
                        <span className="stat-label">En Proceso</span>
                    </div>
                    <div className="stat-card-interno">
                        <Users size={24} className="stat-icon" />
                        <span className="stat-number">{mecanicos.length}</span>
                        <span className="stat-label">Mecánicos</span>
                    </div>
                    <div className="stat-card-interno">
                        <CheckCircle size={24} className="stat-icon" />
                        <span className="stat-number">{ordenes.filter(o => o.status === 'Terminado').length}</span>
                        <span className="stat-label">Terminados</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${tabActiva === 'sinAsignar' ? 'active' : ''}`}
                        onClick={() => setTabActiva('sinAsignar')}
                    >
                        <UserPlus size={18} />
                        Órdenes sin Asignar ({ordenesSinAsignar.length})
                    </button>
                    <button
                        className={`tab-btn ${tabActiva === 'todas' ? 'active' : ''}`}
                        onClick={() => setTabActiva('todas')}
                    >
                        <Eye size={18} />
                        Todas las Órdenes ({ordenes.length})
                    </button>
                </div>

                {/* Filtros y búsqueda */}
                <div className="filtros-container">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por #orden, cliente o mecánico..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {tabActiva === 'todas' && (
                        <div className="filtros-status">
                            <Filter size={18} />
                            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                                <option value="todos">Todos los estados</option>
                                <option value="En revisión">En revisión</option>
                                <option value="En proceso de aceptación">En proceso de aceptación</option>
                                <option value="Busca de refacciones">Busca de refacciones</option>
                                <option value="Trabajo en proceso">Trabajo en proceso</option>
                                <option value="Terminado">Terminado</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                    )}

                    <button onClick={fetchOrdenes} className="btn-refresh-header">
                        <RefreshCw size={16} /> Actualizar
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando órdenes...</p>
                    </div>
                ) : ordenesFiltradasFinal.length === 0 ? (
                    <div className="no-ordenes">
                        {tabActiva === 'sinAsignar' ? (
                            <>
                                <CheckCircle size={48} color="#28a745" />
                                <h3>¡Todas las órdenes están asignadas!</h3>
                                <p>No hay órdenes pendientes de asignar a mecánicos</p>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={48} color="#ffc107" />
                                <h3>No hay órdenes</h3>
                                <p>No se encontraron órdenes con los filtros seleccionados</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="ordenes-grid-interno">
                        {ordenesFiltradasFinal.map(orden => (
                            <div key={orden.id} className={`orden-card-interno ${selectedOrden === orden.id ? 'selected' : ''}`}>
                                {/* Cabecera de la orden - Estilo acordeón */}
                                <div className="orden-card-header" onClick={() => setSelectedOrden(selectedOrden === orden.id ? null : orden.id)}>
                                    <div className="orden-header-left">
                                        <div className="orden-id">
                                            <span className="label">ORDEN #</span>
                                            <strong>{orden.id}</strong>
                                        </div>
                                        <div
                                            className="orden-status-badge"
                                            style={{ backgroundColor: getStatusColor(orden.status) }}
                                        >
                                            {getStatusIcon(orden.status)}
                                            {orden.status}
                                        </div>
                                        {!orden.mecanico_asignado_id && (
                                            <div className="sin-asignar-badge">
                                                SIN ASIGNAR
                                            </div>
                                        )}
                                    </div>
                                    <div className="orden-header-right">
                                        <span className="orden-fecha">
                                            <Calendar size={12} />
                                            {formatearFecha(orden.fecha_creacion)}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido expandible */}
                                {selectedOrden === orden.id && (
                                    <div className="orden-card-body">
                                        {/* Información del Cliente */}
                                        <div className="info-section">
                                            <h4><User size={14} /> DATOS DEL CLIENTE</h4>
                                            <div className="info-grid">
                                                <div className="info-item">
                                                    <span className="info-label">Nombre completo:</span>
                                                    <span className="info-value">{orden.cliente_nombre} {orden.cliente_apellido_paterno} {orden.cliente_apellido_materno}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label"><Phone size={12} /> Teléfono:</span>
                                                    <span className="info-value">{orden.cliente_telefono || 'No registrado'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label"><Mail size={12} /> Correo:</span>
                                                    <span className="info-value">{orden.cliente_correo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Descripción del Problema */}
                                        <div className="info-section">
                                            <h4><FileText size={14} /> DESCRIPCIÓN DEL PROBLEMA</h4>
                                            <p className="problema-descripcion">{orden.descripcion_problema}</p>
                                        </div>

                                        {/* Fotos */}
                                        {orden.fotos && orden.fotos.length > 0 && (
                                            <div className="info-section">
                                                <h4><Camera size={14} /> FOTOGRAFÍAS</h4>
                                                <div className="fotos-grid">
                                                    {orden.fotos.map((foto, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={`${API_URL}${foto}`}
                                                            alt={`Foto ${idx + 1}`}
                                                            className="foto-miniatura"
                                                            onClick={() => window.open(`${API_URL}${foto}`, '_blank')}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Asignación de Mecánico */}
                                        <div className="info-section asignacion-section">
                                            <h4><Wrench size={14} /> ASIGNACIÓN DE MECÁNICO</h4>
                                            {orden.mecanico_asignado_nombre ? (
                                                <div className="mecanico-asignado">
                                                    <CheckCircle size={16} color="#28a745" />
                                                    <span><strong>Mecánico asignado:</strong> {orden.mecanico_asignado_nombre}</span>
                                                    {orden.fecha_asignacion && (
                                                        <span className="fecha-asignacion">(Asignado: {formatearFecha(orden.fecha_asignacion)})</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="asignacion-control">
                                                    <select
                                                        value={selectedMecanico[orden.id] || ''}
                                                        onChange={(e) => setSelectedMecanico(prev => ({ ...prev, [orden.id]: e.target.value }))}
                                                        disabled={asignando[orden.id]}
                                                        className="mecanico-select"
                                                    >
                                                        <option value="">-- Seleccionar mecánico --</option>
                                                        {mecanicos.map(mec => (
                                                            <option key={mec.id} value={mec.id}>
                                                                {mec.nombre} {mec.apellido_paterno} - {mec.especialidad || 'Mecánico General'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => asignarMecanico(orden.id, selectedMecanico[orden.id])}
                                                        disabled={asignando[orden.id] || !selectedMecanico[orden.id]}
                                                        className="btn-asignar-mecanico"
                                                    >
                                                        {asignando[orden.id] ? 'Asignando...' : 'Asignar Mecánico'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Cotización */}
                                        {(orden.cotizacion_total || orden.mano_obra_costo) && (
                                            <div className="info-section cotizacion-box">
                                                <h4><DollarSign size={14} /> COTIZACIÓN</h4>
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <span className="info-label">Mano de obra:</span>
                                                        <span className="info-value">{formatearDinero(orden.mano_obra_costo)}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="info-label">Refacciones:</span>
                                                        <span className="info-value">{orden.refacciones_necesarias || 'No especificadas'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="info-label">Total:</span>
                                                        <span className="info-value total">{formatearDinero(orden.cotizacion_total)}</span>
                                                    </div>
                                                    {orden.aceptacion_cliente === 1 && (
                                                        <div className="info-item aceptado-badge">
                                                            <CheckCircle size={14} color="#28a745" />
                                                            <span className="info-value">✓ Cotización aceptada por el cliente</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cronología */}
                                        <div className="info-section fechas-section">
                                            <h4><Calendar size={14} /> CRONOLOGÍA</h4>
                                            <div className="fechas-grid">
                                                {orden.fecha_creacion && <div className="fecha-item"><span><CalendarDays size={12} /> Creada:</span> {formatearFecha(orden.fecha_creacion)}</div>}
                                                {orden.fecha_asignacion && <div className="fecha-item"><span><UsersRound size={12} /> Asignada:</span> {formatearFecha(orden.fecha_asignacion)}</div>}
                                                {orden.fecha_aceptacion_cliente && <div className="fecha-item"><span><CircleCheckBig size={12} /> Aceptada:</span> {formatearFecha(orden.fecha_aceptacion_cliente)}</div>}
                                                {orden.fecha_terminado && <div className="fecha-item"><span><BookmarkCheck size={12} /> Terminada:</span> {formatearFecha(orden.fecha_terminado)}</div>}
                                                {orden.fecha_entregado && <div className="fecha-item"><span><Package size={12} /> Entregada:</span> {formatearFecha(orden.fecha_entregado)}</div>}
                                            </div>
                                        </div>

                                        {/* Acciones de estado */}
                                        {orden.mecanico_asignado_id && (
                                            <div className="orden-actions">
                                                <h4>Cambiar Estado</h4>
                                                <div className="action-buttons">
                                                    {orden.status === 'En revisión' && (
                                                        <button onClick={() => actualizarStatus(orden.id, 'En proceso de aceptación')} className="btn-action">
                                                            <ListChecks size={14} /> En proceso de aceptación
                                                        </button>
                                                    )}
                                                    {orden.status === 'Busca de refacciones' && orden.aceptacion_cliente === 1 && (
                                                        <button onClick={() => actualizarStatus(orden.id, 'Trabajo en proceso')} className="btn-action primary">
                                                            <CirclePlay size={14} /> Iniciar Trabajo
                                                        </button>
                                                    )}
                                                    {orden.status === 'Trabajo en proceso' && (
                                                        <button onClick={() => actualizarStatus(orden.id, 'Terminado')} className="btn-action success">
                                                            <BookmarkCheck size={14} /> Marcar Terminado
                                                        </button>
                                                    )}
                                                    {orden.status === 'Terminado' && (
                                                        <button onClick={() => actualizarStatus(orden.id, 'Entregado')} className="btn-action info">
                                                            <Package size={14} /> Marcar Entregado
                                                        </button>
                                                    )}
                                                    {orden.status !== 'Cancelado' && orden.status !== 'Entregado' && orden.status !== 'Terminado' && (
                                                        <button onClick={() => actualizarStatus(orden.id, 'Cancelado')} className="btn-action danger">
                                                            <X size={14} /> Cancelar Orden
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="internos-footer">
                <div className="footer-content">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="footer-tag">SISTEMA INTERNO V.2.0</span>
                </div>
            </footer>
        </div>
    );
};

export default Internos;