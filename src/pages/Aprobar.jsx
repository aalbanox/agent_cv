import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Aprobar.css';

const leerDatosSesion = () => {
  const trabajoGuardado = sessionStorage.getItem('trabajoActual');
  const resultadoGuardado = sessionStorage.getItem('resultadoOptimizacion');
  if (!trabajoGuardado || !resultadoGuardado) return null;

  try {
    const trabajo = JSON.parse(trabajoGuardado);
    const resultado = JSON.parse(resultadoGuardado);
    const sugerenciasValidas = Array.isArray(resultado?.sugerencias) &&
      resultado.sugerencias.every((sugerencia) =>
        sugerencia &&
        typeof sugerencia.id === 'string' &&
        typeof sugerencia.seccion === 'string' &&
        typeof sugerencia.original === 'string' &&
        typeof sugerencia.optimizado === 'string' &&
        typeof sugerencia.motivo === 'string'
      );

    if (
      typeof trabajo?.nombreArchivo !== 'string' ||
      typeof resultado?.puestoDetectado !== 'string' ||
      typeof resultado?.puntajeATS !== 'number' ||
      !sugerenciasValidas
    ) {
      return null;
    }

    return {
      trabajo,
      resultado: {
        ...resultado,
        sugerencias: resultado.sugerencias.map((sugerencia) => ({
          ...sugerencia,
          estado: ['aceptado', 'descartado'].includes(sugerencia.estado)
            ? sugerencia.estado
            : 'pendiente'
        }))
      }
    };
  } catch {
    return null;
  }
};

export default function Aprobar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [datos] = useState(leerDatosSesion);
  const [sugerencias, setSugerencias] = useState(
    () => datos?.resultado.sugerencias || []
  );
  const [descargaExitosa, setDescargaExitosa] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState('');

  useEffect(() => {
    if (!datos) {
      navigate('/subir-cv', { replace: true });
    }
  }, [datos, navigate]);

  useEffect(() => {
    if (!datos) return;
    sessionStorage.setItem(
      'resultadoOptimizacion',
      JSON.stringify({ ...datos.resultado, sugerencias })
    );
  }, [datos, sugerencias]);

  const cambiarEstado = (id, estado) => {
    setDescargaExitosa(false);
    setSugerencias((actuales) =>
      actuales.map((sugerencia) =>
        sugerencia.id === id ? { ...sugerencia, estado } : sugerencia
      )
    );
  };

  const aceptarTodas = () => {
    setDescargaExitosa(false);
    setSugerencias((actuales) =>
      actuales.map((sugerencia) => ({ ...sugerencia, estado: 'aceptado' }))
    );
  };

  const handleNewCV = () => {
    sessionStorage.clear();
    navigate('/subir-cv');
  };

  const handleDownload = () => {
    if (!datos) return;

    const aprobadas = sugerencias.filter((sugerencia) => sugerencia.estado === 'aceptado');
    const contenido = [
      'AgenteCV — CV optimizado',
      `Puesto objetivo: ${datos.resultado.puestoDetectado}`,
      `Archivo original: ${datos.trabajo.nombreArchivo}`,
      `Compatibilidad ATS: ${datos.resultado.puntajeATS} / 100`,
      '',
      `MEJORAS APROBADAS (${aprobadas.length})`,
      ...aprobadas.flatMap((sugerencia, index) => [
        '',
        `${index + 1}. ${sugerencia.seccion}`,
        `Versión optimizada: ${sugerencia.optimizado}`,
        `Motivo: ${sugerencia.motivo}`
      ])
    ].join('\n');

    let downloadUrl = '';
    let link;
    try {
      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      downloadUrl = URL.createObjectURL(blob);
      link = document.createElement('a');
      const nombreBase = datos.trabajo.nombreArchivo
        .replace(/\.[^.]+$/, '')
        .replace(/[<>:"/\\|?*]+/g, '-')
        .trim() || 'cv';
      link.href = downloadUrl;
      link.download = `${nombreBase}-optimizado.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      setErrorDescarga('');
      setDescargaExitosa(true);
    } catch {
      if (link) link.remove();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDescargaExitosa(false);
      setErrorDescarga('No se pudo generar la descarga. Inténtalo de nuevo.');
    }
  };

  const aprobadas = sugerencias.filter((sugerencia) => sugerencia.estado === 'aceptado').length;
  const totalSugerencias = sugerencias.length;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="aprobar-page">
      <header className="aprobar-topbar">
        <Link to="/" className="aprobar-brand" aria-label="AgenteCV, inicio">
          <span className="aprobar-brand-mark" aria-hidden="true">
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
          <span className="aprobar-brand-name">AgenteCV</span>
        </Link>

        <div className="aprobar-account">
          <span className="aprobar-account-email">{usuario.email || 'Mi cuenta'}</span>
          <button type="button" className="aprobar-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="aprobar-main">
        <section className="aprobar-intro" aria-labelledby="aprobar-title">
          <span className="aprobar-eyebrow">Revisión final · CU05, CU06</span>
          <div className="aprobar-heading-row">
            <div>
              <h1 id="aprobar-title">{datos?.resultado.puestoDetectado || 'Tu propuesta optimizada'}</h1>
              <p className="aprobar-file-name">
                Propuesta basada en <strong>{datos?.trabajo.nombreArchivo || 'tu currículum'}</strong>
              </p>
            </div>
            <div className="aprobar-score" aria-label={`Compatibilidad ATS: ${datos?.resultado.puntajeATS || 0} de 100`}>
              <span className="aprobar-score-value">{datos?.resultado.puntajeATS ?? 0}</span>
              <span className="aprobar-score-total">/ 100</span>
              <span className="aprobar-score-label">Compatibilidad ATS</span>
            </div>
          </div>
          <div className="aprobar-overview">
            <p aria-live="polite">
              <strong>{aprobadas} de {totalSugerencias}</strong> mejoras aplicadas
            </p>
            <button
              type="button"
              className="aprobar-accept-all"
              onClick={aceptarTodas}
              disabled={totalSugerencias === 0 || aprobadas === totalSugerencias}
            >
              Aceptar todas
            </button>
          </div>
        </section>

        <section className="aprobar-suggestions" aria-label="Sugerencias de mejora">
          {sugerencias.map((sugerencia) => (
            <article
              className={`aprobar-card aprobar-card--${sugerencia.estado}`}
              key={sugerencia.id}
            >
              <header className="aprobar-card-header">
                <span className="aprobar-section-label">{sugerencia.seccion}</span>
                <span className={`aprobar-state aprobar-state--${sugerencia.estado}`}>
                  {sugerencia.estado === 'aceptado'
                    ? 'Cambio aceptado'
                    : sugerencia.estado === 'descartado'
                      ? 'Cambio descartado'
                      : 'Pendiente de revisión'}
                </span>
              </header>

              <div className="aprobar-comparison">
                <div className="aprobar-version">
                  <span className="aprobar-version-label">Texto original</span>
                  <p className="aprobar-original">{sugerencia.original}</p>
                </div>
                <div className="aprobar-version aprobar-version--optimized">
                  <span className="aprobar-version-label">Versión optimizada</span>
                  <p className="aprobar-optimized">{sugerencia.optimizado}</p>
                </div>
              </div>

              <p className="aprobar-reason">
                <strong>Por qué mejora:</strong> {sugerencia.motivo}
              </p>

              <div className="aprobar-card-actions">
                <button
                  type="button"
                  className={`aprobar-accept${sugerencia.estado === 'aceptado' ? ' is-selected' : ''}`}
                  onClick={() => cambiarEstado(sugerencia.id, 'aceptado')}
                  aria-pressed={sugerencia.estado === 'aceptado'}
                >
                  Aceptar cambio
                </button>
                <button
                  type="button"
                  className={`aprobar-discard${sugerencia.estado === 'descartado' ? ' is-selected' : ''}`}
                  onClick={() => cambiarEstado(sugerencia.id, 'descartado')}
                  aria-pressed={sugerencia.estado === 'descartado'}
                >
                  Descartar
                </button>
              </div>
            </article>
          ))}
        </section>

        <footer className="aprobar-actions">
          <button type="button" className="aprobar-new-cv" onClick={handleNewCV}>
            Subir otro CV
          </button>
          <button type="button" className="aprobar-download" onClick={handleDownload}>
            Descargar CV optimizado <span aria-hidden="true">↓</span>
          </button>
        </footer>

        {descargaExitosa && (
          <p className="aprobar-download-success" role="status">
            Tu archivo se descargó correctamente con {aprobadas} mejoras aprobadas.
          </p>
        )}
        {errorDescarga && (
          <p className="aprobar-download-error" role="alert">{errorDescarga}</p>
        )}
      </main>
    </div>
  );
}
