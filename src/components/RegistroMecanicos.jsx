import React from "react";
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
    ShieldCheck,
    KeyRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./registroUsuario.css";

const RegistroMecanicos = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Datos del mecánico:", data);
    };

    return (
        <div className="register-screen">
            {/* NAV */}
            <nav className="register-nav">
                <div className="register-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="register-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="register-avatar">AD</div>
                </div>
            </nav>

            {/* Botón atrás */}
            <div
                className="back-button"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
            >
                <ArrowLeft size={14} /> VOLVER AL INICIO
            </div>

            {/* CONTENEDOR */}
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
                            <label className="form-label" htmlFor="nombre">Nombre(s)</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input id="nombre" name="nombre" type="text" placeholder="NOMBRE" required />
                            </div>

                            <label className="form-label" htmlFor="apellidoPaterno">Apellido Paterno</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input id="apellidoPaterno" name="apellidoPaterno" type="text" placeholder="PATERNO" required />
                            </div>

                            <label className="form-label" htmlFor="apellidoMaterno">Apellido Materno</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input id="apellidoMaterno" name="apellidoMaterno" type="text" placeholder="MATERNO" required />
                            </div>

                            <label className="form-label" htmlFor="telefono">Teléfono</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={18} />
                                <input id="telefono" name="telefono" type="tel" placeholder="TELÉFONO" required />
                            </div>

                            <label className="form-label" htmlFor="correo">Correo Electrónico</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input id="correo" name="correo" type="email" placeholder="EMAIL" required />
                            </div>
                        </div>

                        <div className="register-col">
                            <label className="form-label" htmlFor="calle">Calle</label>
                            <div className="input-wrapper">
                                <Home className="input-icon" size={18} />
                                <input id="calle" name="calle" type="text" placeholder="CALLE" required />
                            </div>

                            <label className="form-label" htmlFor="numero">Número</label>
                            <div className="input-wrapper">
                                <Hash className="input-icon" size={18} />
                                <input id="numero" name="numero" type="text" placeholder="NÚMERO" required />
                            </div>

                            <label className="form-label" htmlFor="codigoPostal">Código Postal</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input id="codigoPostal" name="codigoPostal" type="number" placeholder="C.P." required />
                            </div>

                            <label className="form-label" htmlFor="colonia">Colonia</label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input id="colonia" name="colonia" type="text" placeholder="COLONIA" required />
                            </div>

                            <label className="form-label" htmlFor="ciudad">Ciudad</label>
                            <div className="input-wrapper">
                                <Building2 className="input-icon" size={18} />
                                <input id="ciudad" name="ciudad" type="text" placeholder="CIUDAD" required />
                            </div>
                        </div>

                        <div className="register-row-span">
                            <div className="triple-grid">
                                <div>
                                    <label className="form-label" htmlFor="usuario">Usuario</label>
                                    <div className="input-wrapper">
                                        <User className="input-icon" size={18} />
                                        <input id="usuario" name="usuario" type="text" placeholder="USUARIO" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label" htmlFor="contrasenia">Contraseña</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={18} />
                                        <input id="contrasenia" name="contrasenia" type="password" placeholder="********" required />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <label className="form-label" htmlFor="rol">Rol del Usuario</label>
                                <div className="input-wrapper">

                                    <select
                                        id="rol"
                                        name="rol"
                                        className="form-select"
                                        required
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

                        <button className="btn-register" type="submit">
                            Registrar
                        </button>
                    </form>
                </section>
            </main>

            <footer className="register-footer">
                <div className="footer-content">
                    <span className="red-text">MYSA</span> • Gestión de Personal
                    <span className="copyright">
                        © {new Date().getFullYear()} Todos los derechos reservados.
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default RegistroMecanicos;