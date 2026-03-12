import React from "react";
import { User, ArrowLeft, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./recuperarContrasenia.css";

const RecuperarContrasenia = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: aquí conectas a tu endpoint de recuperación
        // por ejemplo: POST /auth/forgot-password { email }
        console.log("Solicitud de recuperación enviada");
    };

    return (
        <div className="recover-screen">
            {/* NAV */}
            <nav className="recover-nav">
                <div className="recover-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="recover-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="recover-avatar">JD</div>
                </div>
            </nav>

            {/* Back */}
            <div
                className="back-button"
                onClick={() => navigate("/login")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/login")}
            >
                <ArrowLeft size={16} /> Atrás
            </div>

            {/* CONTENIDO */}
            <main className="recover-container">
                <section className="recover-form">
                    <div className="recover-icon-wrap">
                        <Mail size={36} />
                    </div>

                    <div className="recover-label">Recuperar contraseña</div>
                    <h1 className="recover-title">Ingresa tu correo electrónico</h1>
                    <p className="recover-subtitle">
                        Te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    <div className="recover-divider" />

                    <form className="recover-form-box" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label className="form-label" htmlFor="email">
                                Correo electrónico
                            </label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="CORREO@EJEMPLO.COM"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            {/* <div className="form-help">Escribe el correo asociado a tu cuenta.</div> */}
                        </div>

                        <button type="submit" className="btn-recover">
                            <Send size={18} />
                            Enviar
                        </button>

                        <div className="recover-hint">
                            ¿Recordaste tu contraseña?{" "}
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
        </div>
    );
};

export default RecuperarContrasenia;