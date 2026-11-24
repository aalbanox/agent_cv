import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import SubirCV from "./pages/SubirCV";
import Progreso from "./pages/Progreso";

// Componente para proteger rutas privadas
function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
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
              <SubirCV />
            </RutaProtegida>
          }
        />
        <Route
          path="/progreso"
          element={
            <RutaProtegida>
              <Progreso />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}