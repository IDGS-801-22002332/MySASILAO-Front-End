import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Users, Handshake, ArrowLeft, ShoppingCart, BookOpen } from 'lucide-react';
import './AcercaDe.css';

const AcercaDe = () => {
    const navigate = useNavigate();

    return (
        <div className="about-module">
            <nav className="sucursales-nav">
                <div className="nav-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="nav-icons">
                    <BookOpen size={20} strokeWidth={1.5} />
                    <div className="user-avatar">JD</div>
                </div>
            </nav>

            <main className="about-main-wrapper">
                <div
                    className="back-button"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    <ArrowLeft size={14} /> VOLVER AL INICIO
                </div>

                <section className="about-hero-section">
                    <span className="label-red">NUESTRA HISTORIA</span>
                    <h1 className="heavy-title">
                        ACERCA DE <span className="red-highlight">NOSOTROS</span>
                    </h1>
                    <p className="description-text">
                        CONOCE MÁS SOBRE NUESTRA TRAYECTORIA Y COMPROMISO DESDE 1999.
                    </p>
                </section>
                <section className="about-cards-full-grid">

                    <div className="industrial-card">
                        <div className="card-icon-wrap">
                            <Truck size={40} />
                        </div>
                        <h2>NUESTROS INICIOS</h2>
                        <div className="divider-red"></div>
                        <p>
                            EMPRESA MAQUINARIA Y SERVICIO AGRÍCOLA SE FUNDÓ EN EL AÑO DE 1999 EN LA CIUDAD DE SILAO,
                            CON LA VENTA DE MAQUINARIA AGRÍCOLA COMO SU PRINCIPAL ACTIVIDAD, ASÍ AUMENTANDO SU PRESENCIA
                            EN DIFERENTES MUNICIPIOS DE GUANAJUATO.
                        </p>
                    </div>

                    <div className="industrial-card featured">
                        <div className="card-icon-wrap">
                            <Users size={40} />
                        </div>
                        <h2>CRECIMIENTO SOSTENIDO</h2>
                        <div className="divider-red"></div>
                        <p>
                            DESDE SUS INICIOS, HA EXPERIMENTADO UN CRECIMIENTO SOSTENIDO GRACIAS AL COMPROMISO CON EL SERVICIO,
                            LA CALIDAD Y LA ATENCIÓN; ESTOS PILARES NOS HAN PERMITIDO MANTENER UNA BASE DE CLIENTES LEALES.
                        </p>
                    </div>

                    <div className="industrial-card">
                        <div className="card-icon-wrap">
                            <Handshake size={40} />
                        </div>
                        <h2>CALIDAD Y SERVICIO</h2>
                        <div className="divider-red"></div>
                        <p>
                            LA DEDICACIÓN A OFRECER PRODUCTOS Y SERVICIOS DE ALTA CALIDAD, JUNTO CON UNA ATENCIÓN AL CLIENTE EXCEPCIONAL,
                            HA SIDO CRUCIAL PARA ESTABLECER UNA SÓLIDA REPUTACIÓN EN EL MERCADO.
                        </p>
                    </div>

                </section>
            </main>

            <footer className="about-footer-strip">
                <div className="footer-content">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="copyright">© 2024 Todos los derechos reservados.</span>
                </div>
            </footer>
        </div>
    );
};

export default AcercaDe;
