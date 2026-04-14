import { createContext, useContext, useState, useEffect } from "react";

const RecuperacionContext = createContext(null);

export const RecuperacionProvider = ({ children }) => {
    const [correoRecuperacion, setCorreoRecuperacion] = useState(null);
    const [codigoVerificado, setCodigoVerificado] = useState(false);
    const [codigoActual, setCodigoActual] = useState(null);

    useEffect(() => {
        const correo = sessionStorage.getItem("correoRecuperacion");
        const codigo = sessionStorage.getItem("codigoActual");
        const verificado = sessionStorage.getItem("codigoVerificado");

        if (correo) setCorreoRecuperacion(correo);
        if (codigo) setCodigoActual(codigo);
        if (verificado === "true") setCodigoVerificado(true);
    }, []);

    const iniciarRecuperacion = (correo) => {
        setCorreoRecuperacion(correo);
        setCodigoVerificado(false);
        setCodigoActual(null);

        sessionStorage.setItem("correoRecuperacion", correo);
        sessionStorage.removeItem("codigoActual");
        sessionStorage.removeItem("codigoVerificado");
    };

    const marcarCodigoVerificado = (codigo) => {
        setCodigoVerificado(true);
        setCodigoActual(codigo);

        sessionStorage.setItem("codigoActual", codigo);
        sessionStorage.setItem("codigoVerificado", "true");
    };

    const limpiarRecuperacion = () => {
        setCorreoRecuperacion(null);
        setCodigoVerificado(false);
        setCodigoActual(null);

        sessionStorage.clear();
    };

    return (
        <RecuperacionContext.Provider value={{
            correoRecuperacion,
            codigoVerificado,
            codigoActual,
            iniciarRecuperacion,
            marcarCodigoVerificado,
            limpiarRecuperacion,
        }}>
            {children}
        </RecuperacionContext.Provider>
    );
};

export const useRecuperacion = () => {
    const context = useContext(RecuperacionContext);
    if (!context) {
        throw new Error("useRecuperacion debe usarse dentro de RecuperacionProvider");
    }
    return context;
};