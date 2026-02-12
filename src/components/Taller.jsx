import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Settings, Camera, Calendar, ClipboardList, Wrench } from 'lucide-react';
import './Taller.css';

const Taller = () => {
    const navigate = useNavigate();

    return (
        <div className="taller-screen">
            <nav className="taller-nav">
                <div className="taller-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="taller-nav-right">
                    <Wrench size={20} strokeWidth={1.5} />
                    <div className="taller-avatar">JD</div>
                </div>
            </nav>

            <main className="taller-main">
                <header className="taller-header">
                    <div
                        className="back-button"
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <ArrowLeft size={14} /> VOLVER AL INICIO
                    </div>
                    <h1 className="taller-title">REGISTRO DE <span className="red-text">SERVICIO</span></h1>
                    <p className="taller-subtitle">CONTROL DE INGRESO Y MANTENIMIENTO DE EQUIPO</p>
                </header>

                <form className="taller-form">

                    <div className="form-section">
                        <div className="section-header">
                            <Settings size={20} className="red-text" />
                            <h3>DATOS DEL CLIENTE Y EQUIPO</h3>
                        </div>
                        <div className="input-grid">
                            <div className="field">
                                <label>NOMBRE DEL CLIENTE</label>
                                <input type="text" placeholder="EJ. JUAN PÉREZ" />
                            </div>
                            <div className="field">
                                <label>DATOS DEL EQUIPO (MODELO)</label>
                                <input type="text" placeholder="EJ. JOHN DEERE 6125M" />
                            </div>
                            <div className="field">
                                <label>NÚMERO DE SERIE</label>
                                <input type="text" placeholder="VIN / SERIE" />
                            </div>
                            <div className="field">
                                <label>NÚMERO DE HORAS</label>
                                <input type="number" placeholder="0000 HRS" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <Camera size={20} className="red-text" />
                            <h3>EVIDENCIA FOTOGRÁFICA</h3>
                        </div>
                        <div className="photo-grid">
                            <div className="photo-upload">
                                <label>FOTO DE INGRESO</label>
                                <div className="upload-box">SUBIR ARCHIVO</div>
                            </div>
                            <div className="photo-upload">
                                <label>FOTO DE SALIDA</label>
                                <div className="upload-box">SUBIR ARCHIVO</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <ClipboardList size={20} className="red-text" />
                            <h3>REPORTE TÉCNICO</h3>
                        </div>
                        <div className="full-field">
                            <label>OBSERVACIONES</label>
                            <textarea placeholder="DETALLE EL ESTADO DEL EQUIPO..."></textarea>
                        </div>
                        <div className="full-field">
                            <label>REFACCIONES SOLICITADAS</label>
                            <textarea placeholder="LISTADO DE PIEZAS..."></textarea>
                        </div>
                        <div className="field">
                            <label>RECEPCIÓN DE TRABAJO (QUIÉN RECIBE)</label>
                            <input type="text" placeholder="NOMBRE DEL TÉCNICO" />
                        </div>
                    </div>

                    <div className="form-section no-border">
                        <div className="section-header">
                            <Calendar size={20} className="red-text" />
                            <h3>CONTROL DE STATUS</h3>
                        </div>
                        <div className="input-grid">
                            <div className="field">
                                <label>FECHA DE INGRESO</label>
                                <input type="date" />
                            </div>
                            <div className="field">
                                <label>FECHA DE SALIDA</label>
                                <input type="date" />
                            </div>
                            <div className="field">
                                <label>STATUS DEL SERVICIO</label>
                                <select>
                                    <option>EN REVISIÓN</option>
                                    <option>ESPERANDO REFACCIONES</option>
                                    <option>EN TRABAJO</option>
                                    <option>LISTO PARA ENTREGA</option>
                                    <option>ENTREGADO</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="taller-submit">
                        GUARDAR REGISTRO EN TALLER <Send size={18} />
                    </button>
                </form>
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

export default Taller;