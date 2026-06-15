import { execFile } from 'node:child_process'

/**
 * Codifica un script de PowerShell como Base64 (UTF-16LE) para pasarlo con
 * -EncodedCommand. Evita por completo los problemas de escaping de comillas.
 */
function encode(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}

/**
 * Ejecuta un script de PowerShell (Windows PowerShell 5.1, siempre presente en
 * Windows) y parsea su salida como JSON.
 */
export function runPwsh<T = unknown>(script: string): Promise<T> {
  return new Promise((resolve, reject) => {
    execFile(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy',
        'Bypass',
        '-EncodedCommand',
        encode(script),
      ],
      { maxBuffer: 1024 * 1024 * 32, windowsHide: true },
      (error, stdout, stderr) => {
        const err = stderr?.toString().trim()
        if (error) {
          reject(new Error(err || error.message))
          return
        }
        const out = stdout.toString().trim()
        if (!out) {
          resolve([] as unknown as T)
          return
        }
        try {
          resolve(JSON.parse(out) as T)
        } catch {
          reject(
            new Error(
              `Salida de PowerShell no parseable: ${out.slice(0, 200)}`,
            ),
          )
        }
      },
    )
  })
}

/** ConvertTo-Json devuelve un objeto (no array) cuando hay un solo elemento. */
export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

/** Escapa comillas simples para interpolar dentro de cadenas de PowerShell. */
export function psQuote(value: string): string {
  return value.replace(/'/g, "''")
}
