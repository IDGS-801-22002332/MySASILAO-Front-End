// PrivateRoute.jsx - Componente para rutas protegidas
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecuperacion } from "../context/RecuperacionContext";

const PrivateRoute = ({ children, requireCodeVerification = false }) => {
    const { correoRecuperacion, codigoVerificado } = useRecuperacion();

    if (requireCodeVerification) {
        // Para la ruta de cambiar contraseña
        if (!correoRecuperacion || !codigoVerificado) {
            return <Navigate to="/recuperar-contrasenia" replace />;
        }
    } else {
        // Para la ruta de código de recuperación
        if (!correoRecuperacion) {
            return <Navigate to="/recuperar-contrasenia" replace />;
        }
    }

    return children;
};

export default PrivateRoute;