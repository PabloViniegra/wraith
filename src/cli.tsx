import React from 'react';
import { render } from 'ink';
import { App } from './App';

if (process.platform !== 'win32' && !process.argv.includes('--mock')) {
  // Fuera de Windows no hay powershell.exe: avisamos, pero la app arranca igual
  // en modo MOCK (ver src/lib/config.ts) para poder ver la interfaz en desarrollo.
  process.stderr.write(
    '\x1b[33m[wraith] No estas en Windows: ejecutando en modo MOCK con datos simulados.\x1b[0m\n',
  );
}

render(<App />);
