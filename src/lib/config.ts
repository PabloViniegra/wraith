// Usa datos simulados cuando NO estamos en Windows (p. ej. desarrollando en macOS)
// o cuando se pasa el flag --mock explícitamente.
export const USE_MOCK =
  process.platform !== 'win32' || process.argv.includes('--mock');
