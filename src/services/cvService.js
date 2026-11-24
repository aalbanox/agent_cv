const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'docx'];

export const iniciarOptimizacionCV = async (archivoCV, ofertaTexto, ofertaUrl) => {
  if (
    !archivoCV ||
    typeof archivoCV.name !== 'string' ||
    typeof archivoCV.size !== 'number' ||
    !Number.isFinite(archivoCV.size) ||
    archivoCV.size < 0
  ) {
    throw new Error('Selecciona un archivo de CV.');
  }

  const extension = archivoCV.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error('El archivo debe ser PDF o DOCX.');
  }

  if (archivoCV.size > MAX_FILE_SIZE) {
    throw new Error('El archivo no puede superar los 5 MB.');
  }

  const cleanOfertaTexto = typeof ofertaTexto === 'string' ? ofertaTexto.trim() : '';
  const cleanOfertaUrl = typeof ofertaUrl === 'string' ? ofertaUrl.trim() : '';
  if (!cleanOfertaTexto && !cleanOfertaUrl) {
    throw new Error('Pega la descripción de la oferta o introduce su enlace.');
  }

  if (cleanOfertaUrl) {
    try {
      const url = new URL(cleanOfertaUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error();
      }
    } catch {
      throw new Error('Introduce un enlace válido que comience con http:// o https://.');
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    trabajoId: `job-${Date.now()}`,
    nombreArchivo: archivoCV.name
  };
};
