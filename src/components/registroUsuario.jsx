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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./registroUsuario.css";

const RegistroUsuario = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: procesa los datos o conecta con tu API
        console.log("Formulario de registro enviado");
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
                    <div className="register-avatar">JD</div>
                </div>
            </nav>

            {/* Botón atrás */}
            <div
                className="back-button"
                onClick={() => navigate("/login")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && navigate("/login")
                }
            >
                <ArrowLeft size={16} /> Atrás
            </div>

            {/* CONTENEDOR */}
            <main className="register-container">
                <section className="register-form">
                    <div className="register-icon-wrap">
                        <UserPlus size={36} />
                    </div>

                    <div className="register-label">Crear cuenta</div>
                    <h1 className="register-title">Registro de Usuario</h1>
                    <div className="register-divider" />

                    {/* FORMULARIO EN 2 COLUMNAS */}
                    <form className="register-form-grid" onSubmit={handleSubmit}>
                        {/* Columna izquierda */}
                        <div className="register-col">
                            {/* Nombre(s) */}
                            <label className="form-label" htmlFor="nombre">
                                Nombre(s)
                            </label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    placeholder="NOMBRE(S)"
                                    autoComplete="given-name"
                                    required
                                />
                            </div>

                            {/* Apellido Paterno */}
                            <label className="form-label" htmlFor="apPat">
                                Apellido Paterno
                            </label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    id="apPat"
                                    name="apPat"
                                    type="text"
                                    placeholder="APELLIDO PATERNO"
                                    autoComplete="family-name"
                                    required
                                />
                            </div>

                            {/* Apellido Materno */}
                            <label className="form-label" htmlFor="apMat">
                                Apellido Materno
                            </label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    id="apMat"
                                    name="apMat"
                                    type="text"
                                    placeholder="APELLIDO MATERNO"
                                    autoComplete="additional-name"
                                    required
                                />
                            </div>

                            {/* Teléfono */}
                            <label className="form-label" htmlFor="numTel">
                                Número de teléfono
                            </label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={18} />
                                <input
                                    id="numTel"
                                    name="numTel"
                                    type="tel"
                                    placeholder="TELÉFONO"
                                    autoComplete="tel"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <label className="form-label" htmlFor="email">
                                Correo electrónico
                            </label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="CORREO ELECTRÓNICO"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div className="register-col">
                            {/* Calle */}
                            <label className="form-label" htmlFor="calle">
                                Calle
                            </label>
                            <div className="input-wrapper">
                                <Home className="input-icon" size={18} />
                                <input
                                    id="calle"
                                    name="calle"
                                    type="text"
                                    placeholder="CALLE"
                                    autoComplete="address-line1"
                                    required
                                />
                            </div>

                            {/* Número Exterior */}
                            <label className="form-label" htmlFor="numExt">
                                Número exterior
                            </label>
                            <div className="input-wrapper">
                                <Hash className="input-icon" size={18} />
                                <input
                                    id="numExt"
                                    name="numExt"
                                    type="text"
                                    placeholder="NÚMERO EXTERIOR"
                                    required
                                />
                            </div>

                            {/* Código Postal */}
                            <label className="form-label" htmlFor="cp">
                                Código postal
                            </label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input
                                    id="cp"
                                    name="cp"
                                    type="text"
                                    placeholder="CÓDIGO POSTAL"
                                    inputMode="numeric"
                                    pattern="[0-9]{5}"
                                    title="Ingresa 5 dígitos"
                                    autoComplete="postal-code"
                                    required
                                />
                            </div>

                            {/* Colonia */}
                            <label className="form-label" htmlFor="col">
                                Colonia
                            </label>
                            <div className="input-wrapper">
                                <MapPin className="input-icon" size={18} />
                                <input
                                    id="col"
                                    name="col"
                                    type="text"
                                    placeholder="COLONIA"
                                    autoComplete="address-line2"
                                    required
                                />
                            </div>

                            {/* Ciudad */}
                            <label className="form-label" htmlFor="ciudad">
                                Ciudad
                            </label>
                            <div className="input-wrapper">
                                <Building2 className="input-icon" size={18} />
                                <input
                                    id="ciudad"
                                    name="ciudad"
                                    type="text"
                                    placeholder="CIUDAD"
                                    autoComplete="address-level2"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fila completa (usuario y password) */}
                        <div className="register-row-span">
                            <div>
                                <label className="form-label" htmlFor="usuario">
                                    Usuario
                                </label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        id="usuario"
                                        name="usuario"
                                        type="text"
                                        placeholder="USUARIO"
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label" htmlFor="password">
                                    Contraseña
                                </label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="CONTRASEÑA"
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botón */}
                        <button className="btn-register" type="submit">
                            Crear cuenta
                        </button>

                        <div className="recover-hint">
                            ¿Ya tienes Cuenta?{" "}
                            <button
                                type="button"
                                className="link-inline"
                                onClick={() => navigate("/login")}
                            >
                                Inicia sesión
                            </button>
                        </div>
                    </form>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="register-footer">
                <div className="footer-content">
                    <span className="red-text">MYSA</span> • Plataforma de registro
                    <span className="copyright">
                        © {new Date().getFullYear()} Todos los derechos reservados.
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default RegistroUsuario;