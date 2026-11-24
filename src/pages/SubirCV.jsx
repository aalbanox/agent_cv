import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarOptimizacionCV } from '../services/cvService';
import './SubirCV.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function SubirCV() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [archivoCV, setArchivoCV] = useState(null);
  const [ofertaTexto, setOfertaTexto] = useState('');
  const [ofertaUrl, setOfertaUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const handleFile = (file) => {
    setError('');
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(extension)) {
      setArchivoCV(null);
      setError('El archivo debe tener formato PDF o DOCX.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setArchivoCV(null);
      setError('El archivo no puede superar los 5 MB.');
      return;
    }

    setArchivoCV(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const trabajo = await iniciarOptimizacionCV(archivoCV, ofertaTexto, ofertaUrl);
      sessionStorage.setItem('trabajoActual', JSON.stringify(trabajo));
      navigate('/progreso');
    } catch (err) {
      setError(err?.message || 'No se pudo iniciar la optimización. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="subir-cv-page">
      <header className="upload-topbar">
        <Link to="/" className="upload-brand" aria-label="AgenteCV, inicio">
          <span className="upload-brand-mark" aria-hidden="true">
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
          <span className="upload-brand-name">AgenteCV</span>
        </Link>

        <div className="upload-account">
          <span className="upload-account-email">{usuario.email || 'Mi cuenta'}</span>
          <button type="button" className="upload-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="upload-main">
        <div className="upload-intro">
          <span className="upload-eyebrow">Tu próxima oportunidad</span>
          <h1>Un CV hecho para avanzar.</h1>
          <p>
            Comparte tu currículum y la vacante que te interesa. Prepararemos una versión
            enfocada en lo que busca cada equipo.
          </p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <section className="upload-card" aria-labelledby="upload-cv-title">
            <div className="upload-card-heading">
              <span className="upload-step">01</span>
              <div>
                <h2 id="upload-cv-title">Tu currículum</h2>
                <p>Sube un archivo PDF o DOCX de hasta 5 MB.</p>
              </div>
            </div>

            {archivoCV ? (
              <div className="upload-selected-file">
                <span className="upload-file-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <span className="upload-file-name">{archivoCV.name}</span>
                <button
                  type="button"
                  className="upload-remove-file"
                  onClick={() => {
                    setArchivoCV(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  aria-label={`Quitar ${archivoCV.name}`}
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div
                className={`upload-dropzone${isDragging ? ' upload-dropzone--active' : ''}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <span className="upload-drop-icon" aria-hidden="true">
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </span>
                <p className="upload-drop-title">Arrastra tu archivo aquí</p>
                <p className="upload-drop-hint">o</p>
                <input
                  ref={fileInputRef}
                  id="cv-file"
                  className="upload-file-input"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => handleFile(event.target.files[0])}
                />
                <label className="upload-browse-button" htmlFor="cv-file">
                  Selecciona un archivo
                </label>
              </div>
            )}
          </section>

          <section className="upload-card" aria-labelledby="upload-job-title">
            <div className="upload-card-heading">
              <span className="upload-step">02</span>
              <div>
                <h2 id="upload-job-title">La oferta laboral</h2>
                <p>Pega la descripción o comparte el enlace de la vacante.</p>
              </div>
            </div>

            <div className="upload-field">
              <label htmlFor="job-description">Descripción del puesto</label>
              <textarea
                id="job-description"
                name="ofertaTexto"
                placeholder="Pega aquí las responsabilidades, requisitos y habilidades buscadas..."
                value={ofertaTexto}
                onChange={(event) => setOfertaTexto(event.target.value)}
              />
            </div>

            <div className="upload-field">
              <label htmlFor="job-url">Enlace de la vacante <span>(opcional)</span></label>
              <input
                id="job-url"
                name="ofertaUrl"
                type="url"
                placeholder="https://empresa.com/vacante"
                value={ofertaUrl}
                onChange={(event) => setOfertaUrl(event.target.value)}
              />
            </div>
          </section>

          {error && <div className="upload-error" role="alert">{error}</div>}

          <div className="upload-submit-row">
            <p>Tu información se utiliza únicamente para preparar esta postulación.</p>
            <button type="submit" className="upload-submit" disabled={isLoading}>
              {isLoading ? 'Preparando...' : 'Optimizar mi CV'}
              {!isLoading && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
