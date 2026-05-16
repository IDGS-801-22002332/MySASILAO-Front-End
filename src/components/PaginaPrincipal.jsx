import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isInterno, isMecanicos, getSession } from './authUtils';
import {
    Tractor, User, Phone, MapPin, Tag, X, Menu, Pencil, Check, LogOut, AlertCircle,
    Plus, Trash2, Image as ImageIcon, Upload, RefreshCw
} from 'lucide-react';
import './PaginaPrincipal.css';
import { useConfig } from '../context/ConfigContext';


const PaginaPrincipal = () => {
    const { URL } = useConfig();

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

    // Estado para el carrusel
    const [slides, setSlides] = useState([]);
    const [loadingCarrusel, setLoadingCarrusel] = useState(false);
    const [showCarruselModal, setShowCarruselModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editSlideModal, setEditSlideModal] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [editSlideForm, setEditSlideForm] = useState({ title: '', label: '' });

    const userRole = localStorage.getItem('role');
    const isAdmin = isInterno();
    const isMecanico = isMecanicos();
    const canSeeInternos = isAdmin || isMecanico;

    const heroAd = {
        titleBlack: "Tecnología",
        titleRed: "de Vanguardia",
        desc: "Equipos de última generación para maximizar tus cosechas y mejorar tu vida.",
        badge: "INNOVACIÓN AGRÍCOLA 2026"
    };

    // Cargar imágenes del carrusel desde el backend
    const fetchCarrusel = async () => {
        setLoadingCarrusel(true);
        try {
            const response = await fetch(`${URL}/carrusel`);
            const data = await response.json();
            console.log('Datos del carrusel:', data);

            if (Array.isArray(data) && data.length > 0) {
                const slidesFormateados = data.map(item => ({
                    id: item.id,
                    image: `${URL}${item.imagen}`,
                    title: '',
                    label: ''
                }));
                setSlides(slidesFormateados);
            } else {
                setSlides([]);
            }
        } catch (error) {
            console.error('Error al cargar carrusel:', error);
            setSlides([]);
        } finally {
            setLoadingCarrusel(false);
        }
    };

    // Subir nueva imagen al carrusel
    const handleUploadImage = async () => {
        if (!selectedImage) {
            alert('Por favor selecciona una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('imagen', selectedImage);

        setUploading(true);
        try {
            const response = await fetch(`${URL}/carrusel`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Imagen agregada exitosamente');
                setSelectedImage(null);
                setShowCarruselModal(false);
                fetchCarrusel();
                // Reiniciar el input file
                document.getElementById('file-input').value = '';
            } else {
                alert('Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        } finally {
            setUploading(false);
        }
    };

    // Eliminar la última imagen del carrusel
    const handleDeleteLastImage = async () => {
        if (slides.length === 0) {
            alert('No hay imágenes para eliminar');
            return;
        }

        const ultimaImagen = slides[slides.length - 1];

        if (!confirm(`¿Eliminar esta imagen? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const response = await fetch(`${URL}/carrusel/${ultimaImagen.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Imagen eliminada exitosamente');
                fetchCarrusel(); // Recargar lista
            } else {
                alert('Error al eliminar la imagen');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };


    const fetchAnuncio = async () => {
        try {
            const res = await fetch(`${URL}/anuncios`);
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
        fetchCarrusel();
    }, []);

    useEffect(() => {
        if (slides.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 5000);
            return () => clearInterval(timer);
        }
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
            const res = await fetch(`${URL}/anuncios/${anuncio.id}`, {
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
        sessionStorage.clear();
        setMenuOpen(false);
        setShowLogoutAlert(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };

    return (
        <div className="landing-container">
            {/* ... (código existente de alertas y modales) ... */}
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

            {/* Modal para subir imagen al carrusel */}
            {showCarruselModal && (
                <div className="modal-overlay" onClick={() => setShowCarruselModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Plus size={20} /> Agregar imagen al carrusel</h3>
                            <button onClick={() => setShowCarruselModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Seleccionar imagen *</label>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                    className="file-input"
                                />
                            </div>
                            {selectedImage && (
                                <div className="image-preview">
                                    <img src={URL.createObjectURL(selectedImage)} alt="Vista previa" />
                                    <p>{selectedImage.name}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowCarruselModal(false)} className="btn-cancel">Cancelar</button>
                            <button onClick={handleUploadImage} disabled={uploading} className="btn-submit">
                                {uploading ? <RefreshCw size={16} className="spin" /> : <Upload size={16} />}
                                {uploading ? 'Subiendo...' : 'Subir imagen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar título/label de imagen */}
            {editSlideModal && editingSlide && (
                <div className="modal-overlay" onClick={() => setEditSlideModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Pencil size={20} /> Editar información</h3>
                            <button onClick={() => setEditSlideModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={editSlideForm.title}
                                    onChange={(e) => setEditSlideForm({ ...editSlideForm, title: e.target.value })}
                                    placeholder="Ej: Nueva Serie 2026"
                                />
                            </div>
                            <div className="form-group">
                                <label>Etiqueta</label>
                                <input
                                    type="text"
                                    value={editSlideForm.label}
                                    onChange={(e) => setEditSlideForm({ ...editSlideForm, label: e.target.value })}
                                    placeholder="Ej: Lanzamiento Exclusivo"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setEditSlideModal(false)} className="btn-cancel">Cancelar</button>
                            <button onClick={handleEditSlide} className="btn-submit">
                                <Check size={16} /> Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar anuncio (existente) */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Pencil size={20} /> Modificar Anuncio</h3>
                            <button onClick={() => setShowEditModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={editForm.titulo}
                                    onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))}
                                    placeholder="Ej. Bono de $50,000 MXN en Serie 8700"
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    rows={3}
                                    value={editForm.descripcion}
                                    onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
                                    placeholder="Válido al mencionar este anuncio..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Pie de anuncio</label>
                                <input
                                    type="text"
                                    value={editForm.pie}
                                    onChange={e => setEditForm(f => ({ ...f, pie: e.target.value }))}
                                    placeholder="Texto secundario opcional"
                                />
                            </div>
                            {saveError && <p className="error-text">{saveError}</p>}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowEditModal(false)} className="btn-cancel">Cancelar</button>
                            <button onClick={handleSave} disabled={saving} className="btn-submit">
                                {saving ? <RefreshCw size={16} className="spin" /> : <Check size={16} />}
                                {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Anuncio lateral (existente) */}
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
                                <button className="btn-modificar-ad" onClick={openEdit}>
                                    <Pencil size={13} /> Modificar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar (existente) */}
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
                        <a href="/registroMecanicos" onClick={() => setMenuOpen(false)}>Registrar</a>
                    )}
                    {isAdmin && (
                        <a href="/internos" onClick={() => setMenuOpen(false)}>Internos</a>
                    )}
                    {canSeeInternos && (
                        <a href="/taller" onClick={() => setMenuOpen(false)}>Mecánicos</a>
                    )}
                    <a href="/login" onClick={() => setMenuOpen(false)}>
                        <User size={20} className="nav-user-icon" />
                    </a>
                    <button onClick={triggerLogout} className="logout-nav-btn">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            {/* Carrusel con botones de administración */}
            <section className="top-carousel">
                {isAdmin && (
                    <div className="carrusel-admin-buttons">
                        <button onClick={() => setShowCarruselModal(true)} className="admin-btn add-btn">
                            <Plus size={16} /> Agregar imagen
                        </button>
                        <button onClick={handleDeleteLastImage} className="admin-btn delete-btn">
                            <Trash2 size={16} /> Eliminar última
                        </button>
                    </div>
                )}

                {slides.length === 0 ? (
                    <div className="carrusel-empty">
                        <p>No hay imágenes en el carrusel</p>
                        {isAdmin && <small>Haz clic en "Agregar imagen" para añadir una</small>}
                    </div>
                ) : (
                    <>
                        <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {slides.map((slide, index) => (
                                <div className="slide-item" key={slide.id}>
                                    <img src={slide.image} alt={`Slide ${index + 1}`} />
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
                    </>
                )}
            </section>

            {/* Resto del contenido (hero-section, stats-bar, footer, etc.) - mantener igual */}
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