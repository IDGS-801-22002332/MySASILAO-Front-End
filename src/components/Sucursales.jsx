import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft, MapPin, Phone, Clock, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import { isInterno } from './authUtils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Sucursales.css';

const API_BASE = 'https://mysasilao-back-end-production.up.railway.app/sucursales';

const isAdmin = isInterno();

const divIcon = new L.divIcon({
    html: `<div style="background-color: #e53e3e; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
    className: 'custom-marker',
    iconSize: [15, 15],
    iconAnchor: [7, 7]
});

const emptyForm = {
    nombre: '',
    latitud: '',
    longitud: '',
    direccion: '',
    telefono: '',
    horarios: '',
};

const Sucursales = () => {

    const navigate = useNavigate();

    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchSucursales = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setSucursales(data);
            if (data.length > 0 && !selectedSucursal) {
                setSelectedSucursal(data[0]);
            }
        } catch (err) {
            console.error('Error al cargar sucursales', err);
        }
    };

    useEffect(() => {
        fetchSucursales();
    }, []);

    const handleInsert = async () => {
        setLoading(true);
        setFormError('');
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    latitud: parseFloat(form.latitud),
                    longitud: parseFloat(form.longitud),
                }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchSucursales();
                closeForm();
            } else {
                setFormError(data.message);
            }
        } catch (err) {
            setFormError('Error de conexión con el servidor');
        }
        setLoading(false);
    };

    const handleUpdate = async () => {
        setLoading(true);
        setFormError('');
        try {
            const res = await fetch(`${API_BASE}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    latitud: parseFloat(form.latitud),
                    longitud: parseFloat(form.longitud),
                }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchSucursales();
                closeForm();
            } else {
                setFormError(data.message);
            }
        } catch (err) {
            setFormError('Error de conexión con el servidor');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta sucursal?')) return;
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                if (selectedSucursal?.id === id) {
                    setSelectedSucursal(null);
                    setRoute([]);
                }
                await fetchSucursales();
            }
        } catch (err) {
            console.error('Error al eliminar', err);
        }
    };

    const openNew = () => {
        setForm(emptyForm);
        setEditingId(null);
        setFormError('');
        setShowForm(true);
    };

    const openEdit = (s) => {
        setForm({
            nombre: s.nombre,
            latitud: String(s.latitud),
            longitud: String(s.longitud),
            direccion: s.direccion,
            telefono: s.telefono,
            horarios: s.horarios,
        });
        setEditingId(s.id);
        setFormError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setFormError('');
    };

    const destination = selectedSucursal
        ? [parseFloat(selectedSucursal.latitud), parseFloat(selectedSucursal.longitud)]
        : [20.927077, -101.449252];

    const getRoute = () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización');
            return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            setUserLocation([userLat, userLng]);
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();
                const coordinates = data.routes[0].geometry.coordinates;
                setRoute(coordinates.map(coord => [coord[1], coord[0]]));
            } catch (error) {
                console.error(error);
                alert('No se pudo calcular la ruta');
            }
        });
    };

    return (
        <div className="layout-wrapper">

            <nav className="sucursales-nav">
                <div className="nav-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="nav-icons">
                    <Send size={20} strokeWidth={1.5} />
                    <div className="user-avatar">JD</div>
                </div>
            </nav>

            <div className="sucursales-main-container">
                <div className="side-panel">

                    <div
                        className="back-button"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                        <h1 className="main-title" style={{ margin: 0 }}>SUCURSALES</h1>
                        {isAdmin && (
                            <button
                                className="btn-directions-full"
                                style={{ width: 'auto', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
                                onClick={openNew}
                            >
                                <Plus size={14} /> AGREGAR
                            </button>
                        )}
                    </div>

                    <p className="main-subtitle">
                        Encuentra nuestra unidad de servicio más cercana.
                        Ofrecemos cobertura total en el corazón del Bajío.
                    </p>

                    {isAdmin && showForm && (
                        <div className="branch-card" style={{ marginBottom: 16 }}>
                            <div className="card-header" style={{ marginBottom: 12 }}>
                                <h2>{editingId ? 'EDITAR SUCURSAL' : 'NUEVA SUCURSAL'}</h2>
                                <button
                                    onClick={closeForm}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #999)' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="info-list" style={{ gap: 8 }}>
                                {[
                                    { key: 'nombre', label: 'Nombre', placeholder: 'Ej. Silao (Matriz)' },
                                    { key: 'direccion', label: 'Dirección', placeholder: 'Carretera...' },
                                    { key: 'telefono', label: 'Teléfono', placeholder: '+52 472...' },
                                    { key: 'horarios', label: 'Horarios', placeholder: 'Lun-Vie: 08:45 - 17:30' },
                                    { key: 'latitud', label: 'Latitud', placeholder: '20.927077' },
                                    { key: 'longitud', label: 'Longitud', placeholder: '-101.449252' },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.6, textTransform: 'uppercase' }}>
                                            {label}
                                        </label>
                                        <input
                                            value={form[key]}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                            placeholder={placeholder}
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid rgba(0,0,0,0.15)',
                                                borderRadius: 4,
                                                padding: '6px 10px',
                                                color: '#000000',
                                                fontSize: 12,
                                                width: '100%',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {formError && (
                                <p style={{ color: '#e55', fontSize: 11, marginTop: 8 }}>{formError}</p>
                            )}

                            <button
                                className="btn-directions-full"
                                style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                onClick={editingId ? handleUpdate : handleInsert}
                                disabled={loading}
                            >
                                {loading ? 'GUARDANDO...' : (<><Check size={14} /> {editingId ? 'ACTUALIZAR' : 'GUARDAR'}</>)}
                            </button>
                        </div>
                    )}

                    {sucursales.map((s) => (
                        <div
                            key={s.id}
                            className="branch-card"
                            style={{
                                marginBottom: 12,
                                outline: selectedSucursal?.id === s.id ? '2px solid #e53e3e' : 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => { setSelectedSucursal(s); setRoute([]); }}
                        >
                            <div className="card-header">
                                <h2>{s.nombre}</h2>
                                {isAdmin && (
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button
                                            title="Editar"
                                            onClick={(e) => { e.stopPropagation(); openEdit(s); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3e76e5', opacity: 0.7 }}
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            title="Eliminar"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', opacity: 0.85 }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="info-list">
                                <div className="info-item">
                                    <MapPin size={20} className="red-icon" />
                                    <p>{s.direccion}</p>
                                </div>
                                <div className="info-item">
                                    <Phone size={20} className="red-icon" />
                                    <p>{s.telefono}</p>
                                </div>
                                <div className="info-item">
                                    <Clock size={20} className="red-icon" />
                                    <p>{s.horarios}</p>
                                </div>
                            </div>

                            <button
                                className="btn-directions-full"
                                onClick={(e) => { e.stopPropagation(); setSelectedSucursal(s); getRoute(); }}
                            >
                                CÓMO LLEGAR <Send size={16} />
                            </button>
                        </div>
                    ))}

                </div>

                <div className="map-panel-full">

                    <MapContainer
                        center={destination}
                        zoom={15}
                        zoomControl={true}
                        className="leaflet-full"
                        key={destination.join(',')}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {selectedSucursal && (
                            <Marker position={destination} icon={divIcon} />
                        )}
                        {userLocation && <Marker position={userLocation} />}
                        {route.length > 0 && (
                            <Polyline positions={route} pathOptions={{ color: 'blue', weight: 5 }} />
                        )}
                    </MapContainer>

                    {selectedSucursal && (
                        <div className="coords-box">
                            <span className="coords-label">UBICACIÓN EXACTA</span>
                            <div className="coords-val">
                                {parseFloat(selectedSucursal.latitud).toFixed(6)}° N,&nbsp;
                                {parseFloat(selectedSucursal.longitud).toFixed(6)}° W
                            </div>
                            <div className="coords-sub">{selectedSucursal.nombre}</div>
                        </div>
                    )}

                </div>
            </div>

            <footer className="sucursales-footer">
                <div className="footer-brand-low">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="copy-text">
                        © 2024 Maquinaria y Servicio Agrícola. Todos los derechos reservados.
                    </span>
                </div>
            </footer>

        </div>
    );
};

export default Sucursales;