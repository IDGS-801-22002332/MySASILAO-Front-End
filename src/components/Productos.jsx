import React, { useState, useEffect } from 'react';
import { ArrowLeft, Tag, Hash } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './Productos.css';
import { useConfig } from '../context/ConfigContext';

const CATEGORIA_MAP = {
    'Todos': '',
    'Tractores': 'tractor',
    'Sembradora': 'sembradora',
    'Subsuelo': 'svh',
    'Cultivadoras': 'cultivadora',
    'Otros': 'otros',
};

const CATEGORIA_ICON = {
    'Todos': '',
    'Tractores': '',
    'Sembradora': '',
    'Subsuelo': '',
    'Cultivadoras': '',
    'Otros': '',
};

const CATEGORIA_KEY_MAP = {
    'Tractores': 'tractor',
    'Sembradora': 'sembradora',
    'Subsuelo': 'svh',
    'Cultivadoras': 'cultivadora',
    'Otros': 'otros',
};

const Productos = () => {
    const { URL } = useConfig();
    const [categoria, setCategoria] = useState('Todos');
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const categorias = ["Todos", "Tractores", "Sembradora", "Subsuelo", "Cultivadoras", "Otros"];

    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            setError(null);

            try {
                const categoryParam = CATEGORIA_MAP[categoria];
                const url = categoryParam
                    ? `${URL}/productos?category=${categoryParam}`
                    : `${URL}/productos`;

                const res = await fetch(url);
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                const data = await res.json();

                if (categoryParam) {
                    const filtrados = data.filter((p) => {
                        const nombre = (p.Nombre || '').toLowerCase();
                        const idStr = String(p.IdProducto || '').toLowerCase();
                        const cat = (p.Categoria || p.categoria || p.category || '').toLowerCase();
                        const key = categoryParam.toLowerCase();
                        return nombre.includes(key) || idStr.includes(key) || cat.includes(key);
                    });
                    setProductos(filtrados.length > 0 ? filtrados : data);
                } else {
                    setProductos(data);
                }
            } catch (err) {
                console.error('Error al obtener productos:', err);
                setError('No se pudieron cargar los productos. Verifica que el servidor esté activo.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [categoria]);

    return (
        <div className="productos-layout">
            <nav className="sucursales-nav">
                <div className="nav-logo">
                    <strong>MAQUINARIA Y</strong> SERVICIO AGRÍCOLA
                </div>
                <div className="nav-icons">
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
                            {CATEGORIA_ICON[cat]} {cat}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="productos-grid">

                {loading && (
                    <div className="state-message">Cargando productos...</div>
                )}

                {!loading && error && (
                    <div className="state-message error">{error}</div>
                )}

                {!loading && !error && productos.length === 0 && (
                    <div className="state-message">No hay productos en esta categoría.</div>
                )}

                {!loading && !error && productos.map((producto) => (
                    <div key={producto.IdProducto} className="product-card">

                        <div className="product-banner">
                            <span className="product-banner-icon">
                                {CATEGORIA_ICON[categoria] ?? '⚙️'}
                            </span>
                        </div>

                        <div className="product-info">
                            <span className="product-tag">
                                <Tag size={10} style={{ marginRight: 4 }} />
                                {categoria === 'Todos' ? 'MAQUINARIA' : categoria.toUpperCase()}
                            </span>

                            <h3 className="product-name">{producto.Nombre}</h3>

                            <p className="product-id">
                                <Hash size={11} style={{ marginRight: 3 }} />
                                ID: {producto.IdProducto}
                            </p>
                        </div>

                    </div>
                ))}

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