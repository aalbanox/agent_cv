import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/authService';
import './Login.css';

export default function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanNombre = nombre.trim();
    const cleanEmail = email.trim();
    const cleanCodigo = codigoInvitacion.trim();

    if (!cleanNombre) {
      setError('Introduce tu nombre completo.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Introduce un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await registrarUsuario(cleanNombre, cleanEmail, password, cleanCodigo);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/subir-cv');
    } catch (err) {
      setError(err?.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <header className="login-header">
          <Link to="/" className="login-brand">
            <span className="login-brand-mark" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </span>
            <span className="login-brand-name">AgenteCV</span>
          </Link>
        </header>

        <section className="login-form-container">
          <div className="login-title-block">
            <h1>Crear cuenta</h1>
            <p>Prepara tu espacio de trabajo y adapta tu currículum a cada oportunidad.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-field">
              <label htmlFor="registro-nombre">Nombre completo</label>
              <input
                id="registro-nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre completo"
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="registro-email">Correo electrónico</label>
              <input
                id="registro-email"
                name="email"
                type="email"
                placeholder="nombre@correo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="registro-password">Contraseña</label>
              <div className="login-password-wrapper">
                <input
                  id="registro-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="registro-codigo">Código de invitación (opcional)</label>
              <input
                id="registro-codigo"
                name="codigoInvitacion"
                type="text"
                placeholder="Introduce tu código"
                value={codigoInvitacion}
                onChange={(e) => setCodigoInvitacion(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-submit" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>

          <p className="login-register-prompt">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login">Iniciar sesión</Link>
          </p>
        </section>

        <footer className="login-footer">
          <span>© {new Date().getFullYear()} AgenteCV</span>
          <div className="login-footer-links">
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/terminos">Términos</Link>
          </div>
        </footer>
      </main>

      <aside className="login-aside" aria-label="Vista previa de AgenteCV">
        <div className="login-aside-inner">
          <span className="login-aside-tag">Edición de currículum</span>
          <h2 className="login-aside-headline">
            Menos relleno. Más impacto en cada postulación.
          </h2>

          <article className="login-sample-card">
            <div className="sample-card-header">
              <div>
                <p className="sample-name">Laura Méndez</p>
                <p className="sample-role">Analista de Datos · Perfil Senior</p>
              </div>
              <span className="sample-badge">ATS 94 / 100</span>
            </div>

            <div className="sample-section">
              <span className="sample-label">Texto original</span>
              <p className="sample-old">
                Responsable de crear reportes semanales y revisar métricas de ventas.
              </p>
            </div>

            <div className="sample-section sample-section--refined">
              <span className="sample-label sample-label--accent">Versión optimizada</span>
              <p className="sample-new">
                Automaticé tableros de seguimiento comercial en SQL y Power BI, reduciendo el tiempo de reporte en <strong>6 horas semanales</strong>.
              </p>
            </div>
          </article>

          <ul className="login-aside-notes">
            <li>Control de versiones por vacante</li>
            <li>Formato limpio legible por sistemas ATS</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
