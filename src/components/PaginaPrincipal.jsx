import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isInterno, isMecanicos } from './authUtils';
import {
    Tractor, User, Phone, MapPin, Tag, X, Menu, Pencil, Check, LogOut, AlertCircle
} from 'lucide-react';
import './PaginaPrincipal.css';

const API_BASE = 'https://mysasilao-back-end-production.up.railway.app';

const PaginaPrincipal = () => {
    const navigate = useNavigate();
    const [showAd, setShowAd] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anuncio, setAnuncio] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [editForm, setEditForm] = useState({ titulo: '', descripcion: '', pie: '' });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const userRole = localStorage.getItem('role');
    const isAdmin = isInterno();
    const isMecanico = isMecanicos();
    
    const canSeeInternos = isAdmin || isMecanico;

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200",
            title: "Nueva Serie 2026",
            label: "Lanzamiento Exclusivo"
        },
        {
            image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=1200",
            title: "Refacciones Originales",
            label: "Mantenimiento Premium"
        },
        {
            image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=1200",
            title: "Soluciones de Riego",
            label: "Eficiencia Hídrica"
        }
    ];

    const heroAd = {
        titleBlack: "Tecnología",
        titleRed: "de Vanguardia",
        desc: "Equipos de última generación para maximizar tus cosechas con inteligencia artificial aplicada al campo.",
        badge: "INNOVACIÓN AGRÍCOLA 2026"
    };

    const fetchAnuncio = async () => {
        try {
            const res = await fetch(`${API_BASE}/anuncios`);
            const data = await res.json();
            if (data && data.length > 0) {
                setAnuncio(data[0]);
            }
        } catch (err) {
            console.error('Error al cargar anuncio', err);
        }
    };

    useEffect(() => {
        fetchAnuncio();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const openEdit = () => {
        if (!anuncio) return;
        setEditForm({
            titulo: anuncio.titulo,
            descripcion: anuncio.descripcion,
            pie: anuncio.pie ?? '',
        });
        setSaveError('');
        setShowEditModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const res = await fetch(`${API_BASE}/anuncios/${anuncio.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (data.success) {
                await fetchAnuncio();
                setShowEditModal(false);
            } else {
                setSaveError(data.message);
            }
        } catch (err) {
            setSaveError('Error de conexión con el servidor');
        }
        setSaving(false);
    };

    const triggerLogout = () => {
        localStorage.clear();
        setMenuOpen(false);
        setShowLogoutAlert(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };

    return (
        <div className="landing-container">
            {showLogoutAlert && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 10000, background: '#fff', padding: '16px 24px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderLeft: '4px solid #e53e3e',
                    animation: 'slideDown 0.4s ease-out'
                }}>
                    <div style={{ background: '#fff5f5', padding: '8px', borderRadius: '50%' }}>
                        <AlertCircle size={20} color="#e53e3e" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1a202c' }}>Sesión Finalizada</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>Redirigiendo al inicio...</p>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0, 0, 0, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        style={{
                            background: '#ffffff', borderRadius: 10, padding: 28,
                            width: '100%', maxWidth: 420, boxSizing: 'border-box',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: 1, color: '#000000', textTransform: 'uppercase' }}>
                                Modificar Anuncio
                            </h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { key: 'titulo', label: 'Título', placeholder: 'Ej. Bono de $50,000 MXN en Serie 8700' },
                                { key: 'descripcion', label: 'Descripción', placeholder: 'Válido al mencionar este anuncio...' },
                                { key: 'pie', label: 'Pie de anuncio', placeholder: 'Texto secundario opcional' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#aaa', textTransform: 'uppercase' }}>
                                        {label}
                                    </label>
                                    {key === 'descripcion' ? (
                                        <textarea
                                            rows={3}
                                            value={editForm[key]}
                                            onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                            placeholder={placeholder}
                                            style={{
                                                background: '#fff', border: '1px solid rgba(0,0,0,0.15)',
                                                borderRadius: 4, padding: '6px 10px',
                                                color: '#000', fontSize: 12, resize: 'vertical',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                    ) : (
                                        <input
                                            value={editForm[key]}
                                            onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                            placeholder={placeholder}
                                            style={{
                                                background: '#fff', border: '1px solid rgba(0,0,0,0.15)',
                                                borderRadius: 4, padding: '6px 10px',
                                                color: '#000', fontSize: 12,
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {saveError && (
                            <p style={{ color: '#e55', fontSize: 11, marginTop: 10 }}>{saveError}</p>
                        )}

                        <button
                            className="btn-modificar-ad"
                            style={{
                                marginTop: 16, width: '100%', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'GUARDANDO...' : (<><Check size={14} /> GUARDAR CAMBIOS</>)}
                        </button>
                    </div>
                </div>
            )}

            {showAd && anuncio && (
                <div className="ads-sidebar-custom">
                    <div className="custom-ad-card">
                        <button className="custom-ad-close" onClick={() => setShowAd(false)}>
                            <X size={18} stroke="white" strokeWidth={2} />
                        </button>

                        <div className="custom-ad-header">
                            <div className="custom-ad-icon-container">
                                <Tag className="custom-ad-icon" />
                            </div>
                            <span className="custom-ad-badge">Descubre lo nuevo</span>
                        </div>

                        <div className="custom-ad-body">
                            <h2 className="custom-ad-title">{anuncio.titulo}</h2>
                            <p className="custom-ad-text">{anuncio.descripcion}</p>
                            {anuncio.pie && (
                                <p className="custom-ad-text" style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                                    {anuncio.pie}
                                </p>
                            )}
                            {isAdmin && (
                                <button
                                    className="btn-modificar-ad"
                                    style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}
                                    onClick={openEdit}
                                >
                                    <Pencil size={13} /> Modificar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <nav className="navbar">
                <div className="logo-container">
                    <Tractor size={35} className="logo-icon" strokeWidth={1.5} />
                    <div className="logo-text">
                        <h2 className="brand-main">MAQUINARIA Y</h2>
                        <h3 className="brand-sub">SERVICIO AGRÍCOLA</h3>
                    </div>
                </div>

                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                    <a href="/productos" onClick={() => setMenuOpen(false)}>Productos</a>
                    <a href="/contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
                    <a href="/sucursales" onClick={() => setMenuOpen(false)}>Sucursales</a>
                    <a href="/acercaDe" onClick={() => setMenuOpen(false)}>Acerca De</a>
                    <a href="/cliente" onClick={() => setMenuOpen(false)}>Solicitudes</a>
                    {isAdmin && (
                        <a href="/registroMecanicos" onClick={() => setMenuOpen(false)}>
                            Registrar
                        </a>
                    )}
                    {isAdmin && (
                        <a href="/internos" onClick={() => setMenuOpen(false)}>
                            Internos
                        </a>
                    )}
                    {canSeeInternos && (
                        <a href="/taller" onClick={() => setMenuOpen(false)}>
                            Mecánicos
                        </a>
                    )}
                    <a href="/login" onClick={() => setMenuOpen(false)}>
                        <User size={20} className="nav-user-icon" />
                    </a>
                    <button
                        onClick={triggerLogout}
                        className="logout-nav-btn"
                        style={{
                            background: 'none', border: 'none', color: '#e53e3e',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: '8px', padding: '0 15px', fontSize: '1rem', fontWeight: '600'
                        }}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <section className="top-carousel">
                <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {slides.map((slide, index) => (
                        <div className="slide-item" key={index}>
                            <img src={slide.image} alt={slide.title} />
                            <div className="slide-overlay">
                                <span className="slide-label">{slide.label}</span>
                                <h4 className="slide-name">{slide.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="carousel-dots">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`dot ${currentSlide === i ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                </div>
            </section>

            <main className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <MapPin size={12} strokeWidth={3} /> {heroAd.badge}
                    </div>
                    <h1 className="hero-title">
                        <span className="hero-black">{heroAd.titleBlack}</span> <br />
                        <span className="hero-red">{heroAd.titleRed}</span>
                    </h1>
                    <p className="hero-description">{heroAd.desc}</p>
                    <div className="hero-actions">
                        <button className="btn-red">
                            Ver Equipos <Tag size={18} />
                        </button>
                        <button className="btn-dark">Contacto Directo</button>
                    </div>
                </div>
            </main>

            <section className="stats-bar">
                <div className="stat-card">
                    <span className="stat-number">20+</span>
                    <span className="stat-label">AÑOS DE EXPERIENCIA</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">CLIENTES ACTIVOS</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">CALIDAD GARANTIZADA</span>
                </div>
            </section>

            <footer className="main-footer">
                <div className="footer-grid">
                    <div className="footer-info">
                        <div className="logo-container light">
                            <Tractor size={30} className="logo-icon" strokeWidth={1.5} />
                            <div className="logo-text">
                                <h2 className="brand-main">MAQUINARIA Y</h2>
                                <h3 className="brand-sub">SERVICIO AGRÍCOLA</h3>
                            </div>
                        </div>
                        <p className="footer-about">
                            Somos una empresa independiente dedicada a brindar las mejores
                            soluciones mecánicas y comerciales para el sector agropecuario en México.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">SERVICIOS</h4>
                        <ul className="footer-list">
                            <li>Mantenimiento Mayor</li>
                            <li>Venta de Implementos</li>
                            <li>Crédito Refaccionario</li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">SOPORTE</h4>
                        <ul className="footer-list">
                            <li>Contacto</li>
                            <li>Sucursales</li>
                            <li>Preguntas Frecuentes</li>
                            <li>Bolsa de Trabajo</li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">ATENCIÓN</h4>
                        <div className="schedule-box">
                            <div className="schedule-line">
                                <span>Lun - Vie:</span>
                                <span>08:45 - 17:30</span>
                            </div>
                            <div className="schedule-line">
                                <span>Sábado:</span>
                                <span>08:45 - 13:30</span>
                            </div>
                            <div className="schedule-line red-text">
                                <span>Domingo:</span>
                                <span>Cerrado</span>
                            </div>
                        </div>
                        <p className="footer-location">
                            <MapPin size={14} /> Silao de la Victoria, Gto.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2024 Maquinaria y Servicio Agrícola. Todos los derechos reservados.</p>
                </div>
            </footer>

            <a
                href="https://wa.me/5214621121749?text=Hola,%20me%20gustaría%20recibir%20información%20sobre%20los%20productos%20y%20servicios%20de%20Maquinaria%20y%20Servicio%20Agrícola."
                target="_blank"
                rel="noopener noreferrer"
                className="wa-floating"
            >
                <Phone size={22} /> Soporte directo por WhatsApp
            </a>
        </div>
    );
};

export default PaginaPrincipal;