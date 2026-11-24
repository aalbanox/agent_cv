// Simulación temporal del backend de autenticación (CU01)
export const loginUsuario = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve({
          token: "token-falso-jwt-12345",
          usuario: { email, rol: email.includes("admin") ? "admin" : "usuario" }
        });
      } else {
        reject(new Error("Credenciales inválidas. La contraseña debe tener al menos 6 caracteres."));
      }
    }, 800);
  });
};

export const registrarUsuario = async (nombre, email, password, codigoInvitacion) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!nombre || !email || password.length < 6) {
        reject(new Error("Completa todos los campos (contraseña mín. 6 caracteres)."));
        return;
      }
      resolve({
        mensaje: "Cuenta creada correctamente",
        token: "token-falso-jwt-67890",
        usuario: { nombre, email, rol: "usuario" }
      });
    }, 800);
  });
};

export const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};