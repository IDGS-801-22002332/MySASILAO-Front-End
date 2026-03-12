import React, { useState } from 'react';
import { Search, ShoppingCart, Eye, Filter, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './Productos.css';

const Productos = () => {
    const [categoria, setCategoria] = useState('Todos');
    const navigate = useNavigate();

    const categorias = ["Todos", "Tractores", "Sembradora", "Subsuelo", "Cultivadoras", "Otros"];

    return (
        <div className="productos-layout">
            <nav className="sucursales-nav">
                <div className="nav-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="nav-icons">
                    <ShoppingCart size={20} strokeWidth={1.5} />
                    <div className="user-avatar">JD</div>
                </div>
            </nav>

            <header className="productos-header">
                <div
                    className="back-button"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    <ArrowLeft size={14} /> VOLVER AL INICIO
                </div>

                <div className="header-content">
                    <h1 className="title-heavy">
                        NUESTRO <span className="red-text">CATÁLOGO</span>
                    </h1>
                    <p className="catalog-subtitle">
                        Equipamiento de alta potencia para el productor moderno.
                    </p>
                </div>

                <nav className="category-nav">
                    {categorias.map((cat) => (
                        <button
                            key={cat}
                            className={`cat-btn ${categoria === cat ? 'active' : ''}`}
                            onClick={() => setCategoria(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

            </header>

            <main className="productos-grid">
                <div className="product-card">
                    <div className="product-image">
                        <img src="https://via.placeholder.com/400x300" alt="Tractor" />
                        <div className="image-overlay">
                            <button className="icon-action"><Eye size={20} /></button>
                            <button className="icon-action"><ShoppingCart size={20} /></button>
                        </div>
                    </div>
                    <div className="product-info">
                        <span className="product-tag">TRACTORES</span>
                        <h3>Serie ***</h3>
                        <p>Motor ***</p>
                        <div className="product-footer">
                            <span className="price">Desde ***</span>
                            <button className="btn-cotizar-small">COTIZAR</button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="sucursales-footer">
                <div className="footer-brand-low">
                    <strong>MAQUINARIA</strong> <span className="red-text">SERVICIO AGRÍCOLA</span>
                    <span className="copy-text">
                        © 2024 Maquinaria y Servicio Agrícola. Todos los derechos reservados.
                    </span>
                </div>
            </footer>

        </div>
    );
};

export default Productos;
