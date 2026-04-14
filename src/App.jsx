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
import RegistroMecanicos from "./components/registroMecanicos.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CodigoRecuperacion from "./components/codigoRecuperacion.jsx";
import CambiarContrasenia from "./components/cambiarContrasenia.jsx";
import { Navigate } from "react-router-dom";
import { Tractor } from 'lucide-react'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PaginaPrincipal />} />
                <Route path="/sucursales" element={<Sucursales />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/acercaDe" element={<AcercaDe />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/taller" element={<Taller />} />
                <Route path="/cliente" element={<ClienteSeguimiento />} />
                <Route path="/internos" element={<Internos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registroUsuario" element={<RegistroUsuario />} />
                <Route path="/recuperarContrasenia" element={<RecuperarContrasenia />} />
                <Route path="/registroMecanicos" element={<RegistroMecanicos />} />

                {/* Rutas protegidas */}
                <Route
                    path="/codigo-recuperacion"
                    element={
                        <PrivateRoute>
                            <CodigoRecuperacion />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cambiar-contrasenia"
                    element={
                        <PrivateRoute requireCodeVerification={true}>
                            <CambiarContrasenia />
                        </PrivateRoute>
                    }
                />

                {/* Redirigir a login por defecto */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;