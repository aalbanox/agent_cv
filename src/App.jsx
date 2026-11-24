import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// Componente para proteger rutas privadas
function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Pantallas temporales para probar la navegación (las irás reemplazando)
function SubirCVTemporal() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  return (
    <div style={{ padding: "24px" }}>
      <h2>Carga de CV y Oferta (CU02, CU03)</h2>
      <p>Sesión iniciada como: <strong>{usuario.email}</strong> ({usuario.rol})</p>
      <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro/>} />
        <Route
          path="/subir-cv"
          element={
            <RutaProtegida>
              <SubirCVTemporal />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}