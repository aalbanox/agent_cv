import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Progreso.css';

const ETAPAS = [
  (nombreArchivo) => `Extrayendo estructura y experiencia de ${nombreArchivo}`,
  () => 'Analizando requisitos clave y palabras clave ATS de la oferta',
  () => 'Reescribiendo logros con métricas de impacto',
  () => 'Generando comparativa lista para revisión'
];

const crearResultado = () => ({
  puntajeATS: 92,
  puestoDetectado: 'Perfil Objetivo',
  sugerencias: [
    {
      id: 'sugerencia-1',
      seccion: 'Experiencia',
      original: 'Responsable de preparar reportes semanales de ventas.',
      optimizado: 'Automaticé reportes semanales de ventas y reduje su preparación de 5 horas a 45 minutos.',
      motivo: 'Destaca una acción concreta y cuantifica el ahorro de tiempo.',
      estado: 'pendiente'
    },
    {
      id: 'sugerencia-2',
      seccion: 'Logros',
      original: 'Colaboré con el equipo para mejorar la atención al cliente.',
      optimizado: 'Coordiné mejoras en la atención al cliente que elevaron la satisfacción en un 18%.',
      motivo: 'Refuerza el impacto con un resultado medible.',
      estado: 'pendiente'
    },
    {
      id: 'sugerencia-3',
      seccion: 'Habilidades',
      original: 'Conocimientos de análisis y visualización de datos.',
      optimizado: 'Análisis de datos y creación de tableros de indicadores con SQL y Power BI.',
      motivo: 'Incluye herramientas y palabras clave relevantes para filtros ATS.',
      estado: 'pendiente'
    }
  ]
});

export default function Progreso() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [trabajo] = useState(() => {
    const storedTrabajo = sessionStorage.getItem('trabajoActual');
    if (!storedTrabajo) return null;

    try {
      const parsedTrabajo = JSON.parse(storedTrabajo);
      return parsedTrabajo && typeof parsedTrabajo.nombreArchivo === 'string'
        ? parsedTrabajo
        : null;
    } catch {
      return null;
    }
  });
  const [etapasCompletadas, setEtapasCompletadas] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!trabajo) {
      sessionStorage.removeItem('trabajoActual');
      navigate('/subir-cv', { replace: true });
    }
  }, [trabajo, navigate]);

  useEffect(() => {
    if (!trabajo || isComplete) return undefined;

    const timer = setTimeout(() => {
      const siguienteEtapa = etapasCompletadas + 1;
      setEtapasCompletadas(siguienteEtapa);

      if (siguienteEtapa === ETAPAS.length) {
        sessionStorage.setItem('resultadoOptimizacion', JSON.stringify(crearResultado()));
        setIsComplete(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [trabajo, etapasCompletadas, isComplete]);

  useEffect(() => {
    if (!isComplete) return undefined;
    const timer = setTimeout(() => navigate('/aprobar'), 2500);
    return () => clearTimeout(timer);
  }, [isComplete, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const progreso = Math.round((etapasCompletadas / ETAPAS.length) * 100);

  return (
    <div className="progreso-page">
      <header className="progreso-topbar">
        <Link to="/" className="progreso-brand" aria-label="AgenteCV, inicio">
          <span className="progreso-brand-mark" aria-hidden="true">
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
          <span className="progreso-brand-name">AgenteCV</span>
        </Link>

        <div className="progreso-account">
          <span className="progreso-account-email">{usuario.email || 'Mi cuenta'}</span>
          <button type="button" className="progreso-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="progreso-main">
        <section className="progreso-panel" aria-labelledby="progreso-title">
          <span className="progreso-eyebrow">En preparación</span>
          <h1 id="progreso-title">Dando forma a tu próxima oportunidad.</h1>
          <p className="progreso-intro">
            {trabajo
              ? `Estamos trabajando sobre ${trabajo.nombreArchivo}. Puedes seguir cada etapa aquí.`
              : 'Estamos preparando tu espacio de trabajo.'}
          </p>

          <div
            className="progreso-meter"
            role="progressbar"
            aria-label="Progreso de optimización"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progreso}
          >
            <div className="progreso-meter-track">
              <div className="progreso-meter-fill" style={{ width: `${progreso}%` }} />
            </div>
            <span className="progreso-meter-value">{progreso}%</span>
          </div>

          <ol className="progreso-stages" aria-live="polite">
            {ETAPAS.map((etapa, index) => {
              const isDone = index < etapasCompletadas;
              const isCurrent = index === etapasCompletadas && !isComplete;
              const status = isDone ? 'completed' : isCurrent ? 'current' : 'pending';

              return (
                <li className={`progreso-stage progreso-stage--${status}`} key={index}>
                  <span className="progreso-stage-indicator" aria-hidden="true">
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="progreso-spinner" />
                    ) : (
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    )}
                  </span>
                  <span className="progreso-stage-title">{etapa(trabajo?.nombreArchivo || 'tu CV')}</span>
                  <span className="progreso-stage-status">
                    {isDone ? 'Completado' : isCurrent ? 'En curso' : 'Pendiente'}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="progreso-cold-start">
            <span className="progreso-cold-start-mark" aria-hidden="true">i</span>
            <p>
              Si el servidor estaba en reposo, el arranque en frío puede tomar unos segundos extra.
            </p>
          </div>

          {isComplete && (
            <div className="progreso-complete" role="status">
              <p>Tu propuesta está lista para revisar.</p>
              <button type="button" onClick={() => navigate('/aprobar')}>
                Ver propuesta de cambios <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
