import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Camera, Wrench, CheckCircle2, XCircle, User } from 'lucide-react';
import './ClienteSeguimiento.css';

const ClienteSeguimiento = () => {
    const navigate = useNavigate();

    return (
        <div className="cliente-screen">
            <nav className="cliente-nav">
                <div className="cliente-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="nav-icons">
                    <User size={20} strokeWidth={1.5} />
                    <div className="user-avatar">JD</div>
                </div>
            </nav>

            <main className="cliente-main">
                <header className="cliente-header">
                    <div
                        className="back-button"
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>
                    <h1 className="cliente-title">ESTADO DE <span className="red-text">SERVICIO</span></h1>
                    <p className="cliente-subtitle">CONSULTA EL AVANCE DE TU EQUIPO EN TIEMPO REAL</p>
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
                                value="• Filtro de aceite hidráulico&#10;• Empaque de culata&#10;• Kit de sellos para pistón principal"
                            />
                        </div>
                    </div>

                    {/* Sección de Decisión: Cotización */}
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
                    <span className="copy-text">© 2024 Maquinaria y Servicio Agrícola. Todos los derechos reservados.</span>
                </div>
            </footer>
        </div>
    );
};

export default ClienteSeguimiento;