import React, { useState } from "react";
import {
    User,
    UserPlus,
    Mail,
    Lock,
    Phone,
    Home,
    Hash,
    MapPin,
    Building2,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./registroUsuario.css";

const API_BASE = 'http://localhost:3000';

const RegistroMecanicos = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        if (type === 'error') {
            setTimeout(() => setAlert(null), 3500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_BASE}/login/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                showAlert('success', 'Usuario registrado exitosamente.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                showAlert('error', result.message || 'Error al registrar usuario.');
            }
        } catch (err) {
            showAlert('error', 'Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-screen">
            {alert && (
                <div style={{
                    position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                    minWidth: 280, fontSize: 13, fontWeight: 600, color: '#fff',
                    background: alert.type === 'success' ? '#1a7a3f' : '#c0392b',
                    animation: 'fadeInDown 0.25s ease'
                }}>
                    {alert.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {alert.message}
                </div>
            )}

            <nav className="register-nav">
                <div className="register-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="register-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="register-avatar">AD</div>
                </div>
            </nav>

            <div className="back-button" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <ArrowLeft size={14} /> VOLVER AL INICIO
            </div>

            <main className="register-container">
                <section className="register-form">
                    <div className="register-icon-wrap">
                        <UserPlus size={36} />
                    </div>

                    <div className="register-label">Panel de Administración</div>
                    <h1 className="register-title">Registro de Mecánicos e Internos</h1>
                    <div className="register-divider" />

                    <form className="register-form-grid" onSubmit={handleSubmit}>
                        <div className="register-col">
                            <label className="form-label">Nombre(s)</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input name="nombre" type="text" placeholder="NOMBRE" required disabled={loading} />
                            </div>

                            <label className="form-label">Apellido Paterno</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input name="apellidoPaterno" type="text" placeholder="PATERNO" required disabled={loading} />
                            </div>

                            <label className="form-label">Apellido Materno</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input name="apellidoMaterno" type="text" placeholder="MATERNO" required disabled={loading} />
                            </div>

                            <label className="form-label">Teléfono</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={18} />
                                <input name="telefono" type="tel" placeholder="TELÉFONO" required disabled={loading} />
                            </div>

                            <label className="form-label">Correo Electrónico</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input name="correo" type="email" placeholder="EMAIL" required disabled={loading} />
                            </div>
                        </div>

                        <div className="register-col">
                            <label className="form-label">Calle</label>
                            <div className="input-wrapper">
                                <Home className="input-icon" size={18} />
                                <input name="calle" type="text" placeholder="CALLE" required disabled={loading} />
                            </div>

                            <label className="form-label">Número</label>
                            <div className="input-wrapper">
                                <Hash className="input-icon" size={18} />
                                <input name="numero" type="text" placeholder="NÚMERO" required disabled={loading} />
                            </div>

                            <label className="form-label">Código Postal</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input name="codigoPostal" type="number" placeholder="C.P." required disabled={loading} />
                            </div>

                            <label className="form-label">Colonia</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input name="colonia" type="text" placeholder="COLONIA" required disabled={loading} />
                            </div>

                            <label className="form-label">Ciudad</label>
                            <div className="input-wrapper">
                                <Building2 className="input-icon" size={18} />
                                <input name="ciudad" type="text" placeholder="CIUDAD" required disabled={loading} />
                            </div>
                        </div>

                        <div className="register-row-span">
                            <div className="triple-grid">
                                <div>
                                    <label className="form-label">Usuario</label>
                                    <div className="input-wrapper">
                                        <User className="input-icon" size={18} />
                                        <input name="usuario" type="text" placeholder="USUARIO" required disabled={loading} />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Contraseña</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={18} />
                                        <input name="contrasenia" type="password" placeholder="********" required disabled={loading} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <label className="form-label">Rol del Usuario</label>
                                <div className="input-wrapper">
                                    <select
                                        name="rol"
                                        className="form-select"
                                        required
                                        disabled={loading}
                                        onChange={(e) => { e.target.style.color = e.target.value === "" ? "#9ca3af" : "#000000" }}
                                        style={{ color: "#9ca3af" }}
                                    >
                                        <option value="" disabled selected>Selecciona un rol</option>
                                        <option value="Mecanico" style={{ color: "#000000" }}>Mecánico</option>
                                        <option value="Interno" style={{ color: "#000000" }}>Interno</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button className="btn-register" type="submit" disabled={loading}>
                            {loading ? <Loader size={20} className="spin" /> : "Registrar"}
                        </button>
                    </form>
                </section>
            </main>

            <footer className="register-footer">
                <div className="footer-content">
                    <span className="red-text">MYSA</span> • Gestión de Personal
                    <span className="copyright">© {new Date().getFullYear()} Todos los derechos reservados.</span>
                </div>
            </footer>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default RegistroMecanicos;