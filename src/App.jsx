import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "./components/PaginaPrincipal.jsx";
import Sucursales from "./components/Sucursales.jsx";
import Productos from "./components/Productos.jsx";
import AcercaDe from "./components/AcercaDe.jsx";
import Contacto from "./components/Contacto.jsx";
import Taller from "./components/Taller.jsx";
import ClienteSeguimiento from "./components/ClienteSeguimiento.jsx";
import Internos from "./components/Internos.jsx";
import Login from "./components/login.jsx";
import RegistroUsuario from "./components/registroUsuario.jsx";
import RecuperarContrasenia from "./components/recuperarContrasenia.jsx";

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

            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>

            <Routes>
                <Route path="/registroUsuario" element={<RegistroUsuario />} />
            </Routes>

            <Routes>
                <Route path="/recuperarContrasenia" element={<RecuperarContrasenia />} />
            </Routes>
        </Router>
    );
}

export default App;