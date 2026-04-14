import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Check, Loader, CheckCircle } from "lucide-react";
import { useRecuperacion } from "../context/RecuperacionContext";
import axios from "axios";
import "./cambiarContrasenia.css";

const CambiarContrasenia = () => {
    const navigate = useNavigate();

    const {
        correoRecuperacion,
        codigoVerificado,
        codigoActual,
        limpiarRecuperacion
    } = useRecuperacion();

    const [formData, setFormData] = useState({
        nuevaContrasenia: "",
        confirmarContrasenia: ""
    });

    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);  // ← NUEVO

    useEffect(() => {
        if (!correoRecuperacion || !codigoVerificado || !codigoActual) {
            navigate("/recuperar-contrasenia");
        }
    }, [correoRecuperacion, codigoVerificado, codigoActual, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.nuevaContrasenia !== formData.confirmarContrasenia) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (formData.nuevaContrasenia.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://mysasilao-back-end-production.up.railway.app/login/reset-password",
                {
                    correo: correoRecuperacion,
                    codigo: codigoActual,
                    nuevaContrasenia: formData.nuevaContrasenia
                }
            );

            if (response.data.success) {
                limpiarRecuperacion();
                setSuccess(true);           
                setTimeout(() => {
                    navigate("/login");     
                }, 2500);
            } else {
                setError(response.data.message || "Error al actualizar contraseña");
            }
        } catch (error) {
            console.error(error);
            setError("Error en el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-screen">
            {success && (
                <div className="success-overlay">
                    <div className="success-card">
                        <div className="success-icon">
                            <CheckCircle size={48} strokeWidth={1.5} />
                        </div>
                        <p className="success-label">¡Listo!</p>
                        <h2 className="success-title">Contraseña Actualizada</h2>
                        <div className="success-divider" />
                        <p className="success-message">
                            Tu contraseña ha sido cambiada correctamente.<br />
                            Serás redirigido al inicio de sesión.
                        </p>
                        <div className="success-loader">
                            <div className="success-progress" />
                        </div>
                    </div>
                </div>
            )}

            <div className="back-button" onClick={() => navigate("/codigo-recuperacion")}>
                <ArrowLeft size={14} /> VOLVER ATRÁS
            </div>

            <form className="change-form" onSubmit={handleSubmit}>
                <div className="change-icon-wrap">
                    <Lock size={32} strokeWidth={1.5} />
                </div>
                <p className="change-label">Seguridad</p>
                <h1 className="change-title">Cambiar Contraseña</h1>
                <div className="change-divider" />
                <div className="change-input-wrapper">
                    <Lock size={16} className="change-input-icon" />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={formData.nuevaContrasenia}
                        onChange={(e) =>
                            setFormData({ ...formData, nuevaContrasenia: e.target.value })
                        }
                        disabled={loading}
                    />
                </div>

                <div className="change-input-wrapper">
                    <Lock size={16} className="change-input-icon" />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmarContrasenia}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmarContrasenia: e.target.value })
                        }
                        disabled={loading}
                    />
                </div>

                {error && <p className="change-error">{error}</p>}

                <button className="btn-change" disabled={loading}>
                    {loading
                        ? <><Loader size={18} className="spin" /> Actualizando...</>
                        : <><Check size={18} /> Actualizar Contraseña</>
                    }
                </button>

            </form>
        </div>
    );
};

export default CambiarContrasenia;