import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, ArrowLeft } from 'lucide-react';
import './login.css';

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // lógica de login
    };

    return (
        <div className="login-screen">
            <nav className="login-nav">
                <div className="login-logo-brand">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="login-nav-right">
                    <User size={20} strokeWidth={1.5} />
                    <div className="login-avatar">JD</div>
                </div>
            </nav>
            <br />
            <div
                className="back-button"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
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
                            />
                        </div>
                        <div className="input-wrapper">
                            <Lock size={16} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-login">
                            <LogIn size={18} />
                            Iniciar Sesión
                        </button>

                        <div className="login-hint">
                            ¿No tienes cuenta?
                            <button type="button"
                                className="link-inline"
                                onClick={() => navigate("/registroUsuario")}>
                                Registrate
                            </button>
                        </div>
                        <br />

                        <div className="login-hint">
                            ¿Olvidaste tu contraseña?
                            <button type="button"
                                className="link-inline"
                                onClick={() => navigate("/recuperarContrasenia")}>
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
        </div>
    );
};

export default Login;