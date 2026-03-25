import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, ArrowLeft, CheckCircle, XCircle, Loader } from 'lucide-react';
import { saveSession } from './authUtils';
import './login.css';

const API_BASE = 'http://localhost:3000';

const Login = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario]   = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [alert, setAlert] = useState(null);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        if (type === 'error') {
            setTimeout(() => setAlert(null), 3500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario.trim() || !password.trim()) {
            showAlert('error', 'Por favor completa usuario y contraseña.');
            return;
        }

        setLoading(true);
        setAlert(null);

        try {
            const res  = await fetch(`${API_BASE}/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ usuario, contrasenia: password }),
            });

            const data = await res.json();

            if (data.success) {
                saveSession({ usuario: data.usuario, rol: data.rol });
                showAlert('success', `¡Bienvenido, ${data.usuario}!`);
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                showAlert('error', data.message || 'Usuario o contraseña incorrectos.');
            }
        } catch (err) {
            showAlert('error', 'No se pudo conectar con el servidor. Intenta más tarde.');
        }

        setLoading(false);
    };

    return (
        <div className="login-screen">
            {alert && (
                <div
                    style={{
                        position: 'fixed',
                        top: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 20px',
                        borderRadius: 8,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                        minWidth: 280,
                        maxWidth: 420,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#fff',
                        background: alert.type === 'success' ? '#1a7a3f' : '#c0392b',
                        animation: 'fadeInDown 0.25s ease',
                    }}
                >
                    {alert.type === 'success'
                        ? <CheckCircle size={18} />
                        : <XCircle size={18} />
                    }
                    {alert.message}
                </div>
            )}

            <nav className="login-nav">
                <div className="login-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="login-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="login-avatar">MSA</div>
                </div>
            </nav>

            <br />

            <div
                className="back-button"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            >
                <ArrowLeft size={14} /> VOLVER AL INICIO
            </div>

            <div className="login-container">
                <div className="login-form">
                    <div className="login-icon-wrap">
                        <User size={32} strokeWidth={1.5} />
                    </div>

                    <p className="login-label">Bienvenido</p>
                    <h1 className="login-title">Iniciar Sesión</h1>
                    <div className="login-divider" />

                    <form className="login-form-box" onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <User size={16} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="input-wrapper">
                            <Lock size={16} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                            {loading
                                ? <><Loader size={18} className="spin" /> Verificando...</>
                                : <><LogIn size={18} /> Iniciar Sesión</>
                            }
                        </button>

                        <div className="login-hint">
                            ¿No tienes cuenta?
                            <button
                                type="button"
                                className="link-inline"
                                onClick={() => navigate('/registroUsuario')}
                            >
                                Regístrate
                            </button>
                        </div>
                        <br />
                        <div className="login-hint">
                            ¿Olvidaste tu contraseña?
                            <button
                                type="button"
                                className="link-inline"
                                onClick={() => navigate('/recuperarContrasenia')}
                            >
                                Recuperar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <footer className="login-footer">
                <div className="footer-content">
                    <span className="red-text">MSA</span>
                    <span>MAQUINARIA Y SERVICIO AGRÍCOLA</span>
                    <span className="copyright">© 2024 Todos los derechos reservados</span>
                </div>
            </footer>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Login;