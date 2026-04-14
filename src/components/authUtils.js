const SESSION_KEY = 'msa_session';

/**
 * Guarda la sesión tras un login exitoso
 * @param {{ usuario: string, rol: string, id: number }} data
 */
export const saveSession = (data) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

/**
 * Devuelve el objeto de sesión actual o null si no hay sesión
 * @returns {{ usuario: string, rol: string, id: number }} | null
 */
export const getSession = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const isInterno = () => {
    const session = getSession();
    return session?.rol === 'Interno';
};

export const isMecanicos = () => {
    const session = getSession();
    return session?.rol === 'Mecanico';
};
