import React from 'react';
import { Send, ArrowLeft, MapPin, Phone, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import './Sucursales.css';

const Sucursales = () => {
    const navigate = useNavigate();
    const position = [20.9432, -101.4287];

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
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>

                    <h1 className="main-title">SUCURSALES</h1>
                    <p className="main-subtitle">
                        Encuentra nuestra unidad de servicio más cercana. Ofrecemos cobertura total en el corazón del Bajío.
                    </p>

                    <div className="branch-card">
                        <div className="card-header">
                            <h2>SILAO <span>(Matriz)</span></h2>
                            <ArrowLeft size={20} className="arrow-rotate" />
                        </div>

                        <div className="info-list">
                            <div className="info-item">
                                <MapPin size={20} className="red-icon" />
                                <p>Carretera Silao Romita km3, San Juan de los Duran, Silao Gto CP36283</p>
                            </div>
                            <div className="info-item">
                                <Phone size={20} className="red-icon" />
                                <p>+52 472 722 4366</p>
                            </div>
                            <div className="info-item">
                                <Clock size={20} className="red-icon" />
                                <div>
                                    <p>Lun-Vie: 08:45 AM - 05:30 PM</p>
                                    <span className="small-text">Sáb: 08:45 AM - 01:30 PM</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn-directions-full">
                            CÓMO LLEGAR <Send size={16} />
                        </button>
                    </div>
                </div>
                <div className="map-panel-full">
                    <MapContainer center={position} zoom={15} zoomControl={true} className="leaflet-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={position} />
                    </MapContainer>

                    <div className="coords-box">
                        <span className="coords-label">UBICACIÓN EXACTA</span>
                        <div className="coords-val">20.9432° N, 101.4287° W</div>
                        <div className="coords-sub">Parque Industrial San Juan</div>
                    </div>
                </div>
            </div>
            <footer className="sucursales-footer">
                <div className="footer-brand-low">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="copy-text">© 2024 Maquinaria y Servicio Agrícola. Todos los derechos reservados.</span>
                </div>
            </footer>
        </div>
    );
};

export default Sucursales;