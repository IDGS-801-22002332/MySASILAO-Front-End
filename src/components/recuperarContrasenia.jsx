import React, { useState } from "react";
import { User, ArrowLeft, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecuperacion } from "../context/RecuperacionContext";
import axios from "axios";
import "./recuperarContrasenia.css";
import { useConfig } from "../context/ConfigContext";

const RecuperarContrasenia = () => {
    const { URL } = useConfig();
    const navigate = useNavigate();
    const { iniciarRecuperacion } = useRecuperacion();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await axios.post(`${URL}/login/forgot-password`, {
                correo: email
            });

            if (response.data.success) {
                iniciarRecuperacion(email);
                setSuccess(true);
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate("/codigo-recuperacion");
                }, 2000);
            } else {
                setError(response.data.message || "Error al enviar el código");
            }
        } catch (error) {
            setError("Error al conectar con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recover-screen">
            <nav className="recover-nav">
                <div className="recover-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="recover-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="recover-avatar">JD</div>
                </div>
            </nav>

            <div
                className="back-button"
                onClick={() => navigate("/login")}
                role="button"
                tabIndex={0}
            >
                <ArrowLeft size={16} /> Atrás
            </div>

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

                    {success ? (
                        <div className="success-message">
                            <Send size={24} />
                            <p>¡Código enviado! Redirigiendo...</p>
                        </div>
                    ) : (
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="btn-recover" disabled={loading}>
                                <Send size={18} />
                                {loading ? "Enviando..." : "Enviar"}
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
                    )}
                </section>
            </main>
        </div>
    );
};

export default RecuperarContrasenia;