import { USE_MOCK } from './config'
import { mockKill, mockProcesses } from './mock'
import { runPwsh, toArray } from './powershell'

export interface ProcInfo {
  Id: number
  ProcessName: string
  /** Tiempo total de CPU en segundos (no es % instantáneo). */
  CPU: number | null
  /** Working set en MB. */
  MemMB: number
}

const LIST_SCRIPT = `
Get-Process |
  Select-Object Id, ProcessName,
    @{N='CPU';E={ if ($_.CPU) { [math]::Round($_.CPU,1) } else { 0 } }},
    @{N='MemMB';E={ [math]::Round($_.WorkingSet64 / 1MB, 1) }} |
  Sort-Object MemMB -Descending |
  ConvertTo-Json -Depth 3 -Compress
`

export async function listProcesses(): Promise<ProcInfo[]> {
  if (USE_MOCK) return mockProcesses()
  return toArray(await runPwsh<ProcInfo | ProcInfo[]>(LIST_SCRIPT))
}

export async function killProcess(id: number): Promise<void> {
  if (USE_MOCK) {
    mockKill(id)
    return
  }
  const res = await runPwsh<{ ok: boolean; error?: string }>(`
try {
  Stop-Process -Id ${Number(id)} -Force -ErrorAction Stop
  [pscustomobject]@{ ok = $true } | ConvertTo-Json -Compress
} catch {
  [pscustomobject]@{ ok = $false; error = "$($_.Exception.Message)" } | ConvertTo-Json -Compress
}
`)
  if (!res.ok) throw new Error(res.error || 'No se pudo terminar el proceso')
}
