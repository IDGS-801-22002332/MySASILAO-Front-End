import React, { useState, useEffect } from "react";
import { ArrowLeft, KeyRound, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecuperacion } from "../context/RecuperacionContext";
import axios from "axios";
import "./codigoRecuperacion.css";

import { useConfig } from "../context/ConfigContext";

const CodigoRecuperacion = () => {
    const { URL } = useConfig();
    const navigate = useNavigate();
    const { correoRecuperacion, marcarCodigoVerificado } = useRecuperacion();

    const [codigo, setCodigo] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!correoRecuperacion) {
            navigate("/recuperar-contrasenia");
        }
    }, [correoRecuperacion, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (codigo.length !== 6) {
            setError("El código debe tener 6 dígitos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${URL}/login/verify-code`,
                {
                    correo: correoRecuperacion,
                    codigo
                }
            );

            if (response.data.success) {
                marcarCodigoVerificado(codigo);
                navigate("/cambiar-contrasenia");
            } else {
                setError(response.data.message || "Código incorrecto");
                setCodigo("");
            }
        } catch (error) {
            setError("Error al verificar el código");
        } finally {
            setLoading(false);
        }
    };

    const reenviarCodigo = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${URL}/login/forgot-password`,
                { correo: correoRecuperacion }
            );

            if (response.data.success) {
                alert("Código reenviado");
                setCodigo("");
            }
        } catch (error) {
            setError("Error al reenviar código");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="code-screen">
            <div onClick={() => navigate("/recuperar-contrasenia")}>
                <ArrowLeft /> Atrás
            </div>

            <h1>Ingresa el código</h1>

            <form onSubmit={handleSubmit}>
                <div className="code-icon-wrap">
                    <KeyRound size={32} strokeWidth={1.5} />
                </div>
                <p className="code-label">Verificación</p>
                <h1 className="code-title">Ingresa el código</h1>
                <div className="code-divider" />
                <input
                    value={codigo}
                    onChange={(e) =>
                        setCodigo(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={6}
                />

                {error && <p>{error}</p>}

                <button disabled={loading}>
                    <Check />
                    {loading ? "Verificando..." : "Verificar"}
                </button>

                <button type="button" onClick={reenviarCodigo}>
                    Reenviar código
                </button>
            </form>
        </div>
    );
};

export default CodigoRecuperacion;