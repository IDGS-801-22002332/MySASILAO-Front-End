import React, { useState } from "react";
import {
    User, UserPlus, Mail, Lock, Phone,
    Home, Hash, MapPin, Building2, ArrowLeft,
    CheckCircle, XCircle, Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./registroUsuario.css";
import { useConfig } from '../context/ConfigContext';



const RegistroUsuario = () => {
    const { URL } = useConfig();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        correo: "",
        calle: "",
        numero: "",
        codigoPostal: "",
        colonia: "",
        ciudad: "",
        usuario: "",
        contrasenia: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const showAlert = (type, message) => {
        setAlert({ type, message });
        if (type === "error") setTimeout(() => setAlert(null), 3500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const res = await fetch(`${URL}/login/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    codigo: null,
                    rol: "cliente",
                }),
            });

            const data = await res.json();

            if (data.success) {
                showAlert("success", "¡Cuenta creada correctamente! Redirigiendo...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                showAlert("error", data.message || "No se pudo crear la cuenta.");
            }
        } catch {
            showAlert("error", "No se pudo conectar con el servidor.");
        }

        setLoading(false);
    };

    return (
        <div className="register-screen">

            {alert && (
                <div style={{
                    position: "fixed", top: 24, left: "50%",
                    transform: "translateX(-50%)", zIndex: 9999,
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 20px", borderRadius: 8,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                    minWidth: 280, maxWidth: 420,
                    fontSize: 13, fontWeight: 600, color: "#fff",
                    background: alert.type === "success" ? "#1a7a3f" : "#c0392b",
                    animation: "fadeInDown 0.25s ease",
                }}>
                    {alert.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {alert.message}
                </div>
            )}

            <nav className="register-nav">
                <div className="register-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="register-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="register-avatar">JD</div>
                </div>
            </nav>

            <div
                className="back-button"
                onClick={() => navigate("/login")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/login")}
            >
                <ArrowLeft size={16} /> Atrás
            </div>

            <main className="register-container">
                <section className="register-form">
                    <div className="register-icon-wrap">
                        <UserPlus size={36} />
                    </div>

                    <div className="register-label">Crear cuenta</div>
                    <h1 className="register-title">Registro de Usuario</h1>
                    <div className="register-divider" />

                    <form className="register-form-grid" onSubmit={handleSubmit}>

                        <div className="register-col">
                            <label className="form-label" htmlFor="nombre">Nombre(s)</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input id="nombre" type="text" placeholder="NOMBRE(S)"
                                    value={form.nombre} onChange={set("nombre")}
                                    autoComplete="given-name" required />
                            </div>

                            <label className="form-label" htmlFor="apellidoPaterno">Apellido Paterno</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input id="apellidoPaterno" type="text" placeholder="APELLIDO PATERNO"
                                    value={form.apellidoPaterno} onChange={set("apellidoPaterno")}
                                    autoComplete="family-name" required />
                            </div>

                            <label className="form-label" htmlFor="apellidoMaterno">Apellido Materno</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input id="apellidoMaterno" type="text" placeholder="APELLIDO MATERNO"
                                    value={form.apellidoMaterno} onChange={set("apellidoMaterno")}
                                    autoComplete="additional-name" required />
                            </div>

                            <label className="form-label" htmlFor="telefono">Número de teléfono</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={18} />
                                <input id="telefono" type="tel" placeholder="TELÉFONO"
                                    value={form.telefono} onChange={set("telefono")}
                                    autoComplete="tel" required />
                            </div>

                            <label className="form-label" htmlFor="correo">Correo electrónico</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input id="correo" type="email" placeholder="CORREO ELECTRÓNICO"
                                    value={form.correo} onChange={set("correo")}
                                    autoComplete="email" required />
                            </div>
                        </div>

                        <div className="register-col">
                            <label className="form-label" htmlFor="calle">Calle</label>
                            <div className="input-wrapper">
                                <Home className="input-icon" size={18} />
                                <input id="calle" type="text" placeholder="CALLE"
                                    value={form.calle} onChange={set("calle")}
                                    autoComplete="address-line1" required />
                            </div>

                            <label className="form-label" htmlFor="numero">Número exterior</label>
                            <div className="input-wrapper">
                                <Hash className="input-icon" size={18} />
                                <input id="numero" type="text" placeholder="NÚMERO EXTERIOR"
                                    value={form.numero} onChange={set("numero")} required />
                            </div>

                            <label className="form-label" htmlFor="codigoPostal">Código postal</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input id="codigoPostal" type="text" placeholder="CÓDIGO POSTAL"
                                    value={form.codigoPostal} onChange={set("codigoPostal")}
                                    inputMode="numeric" pattern="[0-9]{5}" title="Ingresa 5 dígitos"
                                    autoComplete="postal-code" required />
                            </div>

                            <label className="form-label" htmlFor="colonia">Colonia</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input id="colonia" type="text" placeholder="COLONIA"
                                    value={form.colonia} onChange={set("colonia")}
                                    autoComplete="address-line2" required />
                            </div>

                            <label className="form-label" htmlFor="ciudad">Ciudad</label>
                            <div className="input-wrapper">
                                <Building2 className="input-icon" size={18} />
                                <input id="ciudad" type="text" placeholder="CIUDAD"
                                    value={form.ciudad} onChange={set("ciudad")}
                                    autoComplete="address-level2" required />
                            </div>
                        </div>

                        <div className="register-row-span">
                            <div>
                                <label className="form-label" htmlFor="usuario">Usuario</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input id="usuario" type="text" placeholder="USUARIO"
                                        value={form.usuario} onChange={set("usuario")}
                                        autoComplete="username" required />
                                </div>
                            </div>

                            <div>
                                <label className="form-label" htmlFor="contrasenia">Contraseña</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input id="contrasenia" type="password" placeholder="CONTRASEÑA"
                                        value={form.contrasenia} onChange={set("contrasenia")}
                                        autoComplete="new-password" required />
                                </div>
                            </div>
                        </div>

                        <button className="btn-register" type="submit" disabled={loading}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {loading
                                ? <><Loader size={18} className="spin" /> Registrando...</>
                                : "Crear cuenta"
                            }
                        </button>

                        <div className="recover-hint">
                            ¿Ya tienes cuenta?{" "}
                            <button type="button" className="link-inline" onClick={() => navigate("/login")}>
                                Inicia sesión
                            </button>
                        </div>
                    </form>
                </section>
            </main>

            <footer className="register-footer">
                <div className="footer-content">
                    <span className="red-text">MYSA</span> • Plataforma de registro
                    <span className="copyright">© {new Date().getFullYear()} Todos los derechos reservados.</span>
                </div>
            </footer>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default RegistroUsuario;