import React, { useState } from 'react';
import { Send, ArrowLeft, MapPin, Phone, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import './Sucursales.css';

const Sucursales = () => {

    const navigate = useNavigate();

    const destination = [20.927077, -101.449252];

    const [userLocation, setUserLocation] = useState(null);
    const [route, setRoute] = useState([]);

    const getRoute = () => {

        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización");
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

                const routeLatLng = coordinates.map(coord => [coord[1], coord[0]]);

                setRoute(routeLatLng);

            } catch (error) {
                console.error(error);
                alert("No se pudo calcular la ruta");
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
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>

                    <h1 className="main-title">SUCURSALES</h1>

                    <p className="main-subtitle">
                        Encuentra nuestra unidad de servicio más cercana.
                        Ofrecemos cobertura total en el corazón del Bajío.
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

                        <button
                            className="btn-directions-full"
                            onClick={getRoute}
                        >
                            CÓMO LLEGAR <Send size={16} />
                        </button>

                    </div>
                </div>

                <div className="map-panel-full">

                    <MapContainer
                        center={destination}
                        zoom={15}
                        zoomControl={true}
                        className="leaflet-full"
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={destination} />

                        {userLocation && (
                            <Marker position={userLocation} />
                        )}

                        {route.length > 0 && (
                            <Polyline
                                positions={route}
                                pathOptions={{ color: 'blue', weight: 5 }}
                            />
                        )}

                    </MapContainer>

                    <div className="coords-box">
                        <span className="coords-label">UBICACIÓN EXACTA</span>
                        <div className="coords-val">20.927077° N, -101.449252° W</div>
                        <div className="coords-sub">Parque Industrial San Juan</div>
                    </div>

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