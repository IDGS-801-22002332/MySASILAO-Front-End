import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import './Contacto.css';

const Contacto = () => {
    const navigate = useNavigate();

    return (
        <div className="contact-screen">
            <nav className="contact-nav">
                <div className="contact-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="contact-nav-right">
                    <Mail size={20} strokeWidth={1.5} />
                    <div className="contact-avatar">JD</div>
                </div>
            </nav>

            <main className="contact-main">
                <section className="contact-header-section">
                    <div
                        className="back-button"
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>
                    <h1 className="contact-main-title">PONTE EN <span className="red-text">CONTACTO</span></h1>
                    <p className="contact-subtitle">ESTAMOS LISTOS PARA IMPULSAR TU PRODUCTIVIDAD</p>
                </section>

                <div className="contact-grid-container">
                    <div className="contact-channels">
                        <div className="channel-card">
                            <div className="channel-icon"><Phone size={24} /></div>
                            <h3>LLÁMANOS</h3>
                            <p>+52 1 462 175 9155</p>
                            <span>Atención inmediata</span>
                        </div>
                        <div className="channel-card">
                            <div className="channel-icon"><Mail size={24} /></div>
                            <h3>ESCRÍBENOS</h3>
                            <p>contacto@mysasilao.com</p>
                            <span>Respuesta en menos de 24h</span>
                        </div>
                        <div className="channel-card">
                            <div className="channel-icon"><MapPin size={24} /></div>
                            <h3>MATRIZ</h3>
                            <p>Silao, Guanajuato</p>
                            <span>Carretera Silao Romita km3</span>
                        </div>
                    </div>
                    <form className="contact-form-box">
                        <div className="form-header">
                            <h2>ENVÍA UN <span className="red-text">MENSAJE</span></h2>
                            <p>Completa el formulario y un asesor se pondrá en contacto contigo.</p>
                        </div>

                        <div className="input-group">
                            <input type="text" placeholder="NOMBRE COMPLETO" required />
                        </div>
                        <input type="email" placeholder="CORREO ELECTRÓNICO" required />

                        <input type="text" placeholder="ASUNTO (EJ. COTIZACIÓN TRACTOR)" required />

                        <textarea placeholder="¿CÓMO PODEMOS AYUDARTE?" rows="5"></textarea>

                        <button type="submit" className="contact-submit-btn">
                            ENVIAR MENSAJE <MessageSquare size={18} />
                        </button>
                    </form>
                </div>
            </main>
            <footer className="contact-footer">
                <div className="contact-footer-info">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="contact-copy">© 2024 Todos los derechos reservados.</span>
                </div>
            </footer>
        </div>
    );
};

export default Contacto;