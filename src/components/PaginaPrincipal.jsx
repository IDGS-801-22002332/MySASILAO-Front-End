import React from 'react';
import {
    Tractor,
    User,
    ArrowRight,
    Phone,
    Facebook,
    Instagram,
    Twitter,
    MapPin
} from 'lucide-react';
import './PaginaPrincipal.css';

const PaginaPrincipal = () => {
    return (
        <div className="landing-container">
            <nav className="navbar">
                <div className="logo-container">
                    <Tractor size={35} className="logo-icon" strokeWidth={1.5} />
                    <div className="logo-text">
                        <h2 className="brand-main">MAQUINARIA Y</h2>
                        <h3 className="brand-sub">SERVICIO AGRÍCOLA</h3>
                    </div>
                </div>

                <div className="nav-menu">
                    <a href="/productos">Productos</a>
                    <a href="/contacto">Contacto</a>
                    <a href="/acercaDe">Acerca de</a>
                    <a href="/sucursales">Sucursales</a>
                    <a href="/taller">Taller</a>
                    <a href="/cliente">Clientes</a>
                    <a href="/internos">Internos</a>
                    <User size={20} className="nav-user-icon" />
                </div>
            </nav>
            <main className="hero-section">
                <div className="hero-badge">
                    <MapPin size={12} strokeWidth={3} /> EL CAMPO NO SE DETIENE
                </div>
                <h1 className="hero-title">
                    Impulsa tu <br />
                    <span className="text-red">Productividad</span>
                </h1>
                <p className="hero-description">
                    Soluciones integrales en maquinaria, mantenimiento preventivo y
                    planes de financiamiento diseñados para el productor moderno.
                </p>
                <div className="hero-actions">
                    <button className="btn-red">
                        Explorar Equipos <ArrowRight size={18} />
                    </button>
                    <button className="btn-dark">Servicio Técnico</button>
                </div>
            </main>
            <section className="plan-display">
                <div className="plan-card">
                    <Tractor size={80} strokeWidth={1.2} className="plan-card-icon" />
                    <h2 className="plan-title">Plan 2026</h2>
                    <p className="plan-subtitle">Financiamiento Directo</p>
                </div>
            </section>
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
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">SOPORTE TÉCNICO</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">REFACCIONES ORIGINALES</span>
                </div>
            </section>
            <br />
            <br />
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
                        <div className="footer-socials">
                            <Facebook size={18} />
                            <Instagram size={18} />
                            <Twitter size={18} />
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">SERVICIOS</h4>
                        <ul className="footer-list">
                            <li>Mantenimiento Mayor</li>
                            <li>Diagnóstico por Escáner</li>
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
            <div className="wa-floating">
                <Phone size={20} fill="white" /> Soporte Directo
            </div>
        </div>
    );
};

export default PaginaPrincipal;