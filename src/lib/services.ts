import { USE_MOCK } from './config'
import { mockServices } from './mock'
import { psQuote, runPwsh, toArray } from './powershell'

export interface ServiceInfo {
  Name: string
  DisplayName: string
  Status: string // Running | Stopped | Paused | ...
  StartType: string // Automatic | Manual | Disabled | ...
}

const LIST_SCRIPT = `
Get-Service |
  Select-Object Name, DisplayName,
    @{N='Status';E={ $_.Status.ToString() }},
    @{N='StartType';E={ try { $_.StartType.ToString() } catch { 'Unknown' } }} |
  Sort-Object Status, DisplayName |
  ConvertTo-Json -Depth 3 -Compress
`

export async function listServices(): Promise<ServiceInfo[]> {
  if (USE_MOCK) return mockServices()
  return toArray(await runPwsh<ServiceInfo | ServiceInfo[]>(LIST_SCRIPT))
}

async function svcAction(command: string): Promise<void> {
  if (USE_MOCK) return // en mock no mutamos el estado simulado
  const res = await runPwsh<{ ok: boolean; error?: string }>(`
try {
  ${command} -ErrorAction Stop
  [pscustomobject]@{ ok = $true } | ConvertTo-Json -Compress
} catch {
  [pscustomobject]@{ ok = $false; error = "$($_.Exception.Message)" } | ConvertTo-Json -Compress
}
`)
  if (!res.ok)
    throw new Error(res.error || 'Operación sobre el servicio fallida')
}

export const startService = (name: string) =>
  svcAction(`Start-Service -Name '${psQuote(name)}'`)

export const stopService = (name: string) =>
  svcAction(`Stop-Service -Force -Name '${psQuote(name)}'`)

export const restartService = (name: string) =>
  svcAction(`Restart-Service -Force -Name '${psQuote(name)}'`)
