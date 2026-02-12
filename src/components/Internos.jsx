import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, ClipboardList, Clock, FileText, Activity } from 'lucide-react';
import './Internos.css';

const Internos = () => {
    const navigate = useNavigate();

    return (
        <div className="internos-screen">
            <nav className="internos-nav">
                <div className="internos-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="internos-nav-right">
                    <div className="admin-badge">CONTROL INTERNO</div>
                    <div className="internos-user-icon">JD</div>
                </div>
            </nav>

            <main className="internos-container">
                <header className="internos-header">
                    <button className="internos-back" onClick={() => navigate('/')}>
                        <ArrowLeft size={16} /> REGRESAR AL DASHBOARD
                    </button>
                    <h1 className="internos-title">GESTIÓN DE <span className="red-text">OPERACIONES</span></h1>
                    <p className="internos-subtitle">MONITOREO TÉCNICO Y LOGÍSTICA DE TALLER</p>
                </header>

                <div className="internos-grid">
                    <section className="internos-card">
                        <div className="internos-section-title">
                            <ClipboardList size={20} className="red-text" />
                            <h3>DETALLES DE LA ORDEN</h3>
                        </div>

                        <div className="internos-form-view">
                            <div className="internos-field">
                                <label><FileText size={14} /> REFACCIONES REQUERIDAS</label>
                                <textarea 
                                    readOnly 
                                    className="data-black"
                                    value="• 02 Filtros de Aire Heavy Duty&#10;• 01 Sensor de Presión de Aceite&#10;• 20L Aceite SAE 15W-40"
                                />
                            </div>

                            <div className="internos-row">
                                <div className="internos-field">
                                    <label><Clock size={14} /> FECHA DE INGRESO</label>
                                    <input type="text" value="11 FEB 2026 - 09:30 AM" readOnly className="data-black" />
                                </div>
                                <div className="internos-field">
                                    <label><Activity size={14} /> STATUS DEL EQUIPO</label>
                                    <div className="status-pill-container">
                                        <input type="text" value="ESPERANDO REFACCIONES" readOnly className="data-black status-input" />
                                    </div>
                                </div>
                            </div>
                            <div className="internos-field">
                                <label>ELECCIÓN DE COTIZACIÓN (CLIENTE)</label>
                                <div className="cotizacion-status-box approved">
                                    <div className="status-indicator-dot"></div>
                                    <span className="data-black">COTIZACIÓN ACEPTADA POR EL CLIENTE</span>
                                </div>
                            </div>
                        </div>

                        <div className="internos-actions">
                            <button className="btn-update">ACTUALIZAR STATUS</button>
                            <button className="btn-print">IMPRIMIR ORDEN</button>
                        </div>
                    </section>
                    <aside className="internos-sidebar">
                        <div className="summary-box">
                            <h4>RESUMEN LOGÍSTICO</h4>
                            <div className="summary-item">
                                <span>TIEMPO EN TALLER:</span>
                                <strong>48 HORAS</strong>
                            </div>
                            <div className="summary-item">
                                <span>PRIORIDAD:</span>
                                <strong className="red-text">ALTA</strong>
                            </div>
                            <div className="summary-item">
                                <span>TÉCNICO ASIGNADO:</span>
                                <strong>ING. R. RAMÍREZ</strong>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="internos-footer">
                <div className="footer-content">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="footer-tag">SISTEMA INTERNO V.2.0</span>
                </div>
            </footer>
        </div>
    );
};

export default Internos;