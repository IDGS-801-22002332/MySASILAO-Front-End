// authUtils.js
// Utilidades centrales para manejar la sesión del usuario

const SESSION_KEY = 'msa_session';

/**
 * Guarda la sesión tras un login exitoso
 * @param {{ usuario: string, rol: string }} data
 */
export const saveSession = (data) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

/**
 * Devuelve el objeto de sesión actual o null si no hay sesión
 * @returns {{ usuario: string, rol: string } | null}
 */
export const getSession = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/**
 * Elimina la sesión (logout)
 */
export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

/**
 * Devuelve true si el usuario tiene rol "Interno"
 */
export const isInterno = () => {
    const session = getSession();
    return session?.rol === 'Interno';
};
