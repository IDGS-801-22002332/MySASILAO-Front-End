import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "./components/PaginaPrincipal.jsx";
import Sucursales from "./components/Sucursales.jsx";
import Productos from "./components/Productos.jsx";
import AcercaDe from "./components/AcercaDe.jsx";
import Contacto from "./components/Contacto.jsx";
import Taller from "./components/Taller.jsx";
import ClienteSeguimiento from "./components/ClienteSeguimiento.jsx";
import Internos from "./components/Internos.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PaginaPrincipal />} />
            </Routes>
            <Routes>
                <Route path="/sucursales" element={<Sucursales />} />
            </Routes>
            <Routes>
                <Route path="/productos" element={<Productos />} />
            </Routes>
            <Routes>
                <Route path="/acercaDe" element={<AcercaDe />} />
            </Routes>
            <Routes>
                <Route path="/contacto" element={<Contacto />} />
            </Routes>
            <Routes>
                <Route path="/taller" element={<Taller />} />
            </Routes>
            <Routes>
                <Route path="/cliente" element={<ClienteSeguimiento />} />
            </Routes>
            <Routes>
                <Route path="/internos" element={<Internos />} />
            </Routes>
        </Router>
    );
}

export default App;
