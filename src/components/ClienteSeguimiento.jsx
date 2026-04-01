import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle2, XCircle, User, Lock } from 'lucide-react';
import { getSession, clearSession } from './authUtils';
import './ClienteSeguimiento.css';

const ClienteSeguimiento = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const session = getSession();
        if (session && session.usuario) {
            setIsLoggedIn(true);
            setUserData(session);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        clearSession();
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
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
                            {userData ? userData.usuario.substring(0, 2).toUpperCase() : '??'}
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
                        <br />

                    </header>

                    <div className="cliente-content-card">
                        <div className="cliente-section">
                            <div className="section-label">
                                <Camera size={18} /> EVIDENCIA DE INGRESO
                            </div>
                            <div className="img-container-view">
                                <img src="https://via.placeholder.com/600x300" alt="Ingreso de equipo" />
                            </div>
                        </div>

                        <div className="cliente-info-grid">
                            <div className="info-item-box">
                                <label>STATUS ACTUAL</label>
                                <input type="text" value="EN ESPERA DE REFACCIONES" readOnly className="input-black" />
                            </div>
                            <div className="info-item-box">
                                <label>REFACCIONES SOLICITADAS</label>
                                <textarea
                                    readOnly
                                    className="input-black"
                                    defaultValue={"• Filtro de aceite hidráulico\n• Empaque de culata\n• Kit de sellos para pistón principal"}
                                />
                            </div>
                        </div>

                                                <h2 className="cliente-subtitle">
                            <span
                                className="red-text"
                                onClick={() => navigate("/nueva-cotizacion")}
                                style={{ cursor: "pointer", textDecoration: "underline" }}
                            >
                                Hacer una nueva cotización
                            </span>
                        </h2>

                        <div className="cotizacion-decision-box">
                            <div className="cotizacion-text">
                                <h3>¿ACEPTA LA COTIZACIÓN DE REFACCIONES?</h3>
                                <p>Al confirmar, el técnico procederá con la instalación inmediata.</p>
                            </div>
                            <div className="decision-buttons">
                                <button className="btn-decision no">
                                    <XCircle size={20} /> NO
                                </button>
                                <button className="btn-decision si">
                                    <CheckCircle2 size={20} /> SÍ
                                </button>
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