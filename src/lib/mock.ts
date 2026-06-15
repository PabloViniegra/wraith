import type { ProcInfo } from './processes'
import type { ServiceInfo } from './services'
import type { SysStats } from './system'

const PROC_NAMES = [
  'chrome',
  'Code',
  'bun',
  'node',
  'explorer',
  'svchost',
  'powershell',
  'Discord',
  'Spotify',
  'steam',
  'docker',
  'pwsh',
  'Teams',
  'OneDrive',
  'dwm',
  'csrss',
  'lsass',
  'RuntimeBroker',
  'SearchHost',
  'WindowsTerminal',
  'firefox',
  'notepad',
  'cmd',
  'conhost',
  'python',
  'java',
  'postgres',
]

const SERVICES = [
  ['Spooler', 'Print Spooler', 'Running', 'Automatic'],
  ['wuauserv', 'Windows Update', 'Stopped', 'Manual'],
  ['Dnscache', 'DNS Client', 'Running', 'Automatic'],
  ['WinDefend', 'Microsoft Defender Antivirus Service', 'Running', 'Automatic'],
  ['Themes', 'Themes', 'Running', 'Automatic'],
  ['BITS', 'Background Intelligent Transfer Service', 'Stopped', 'Manual'],
  ['Audiosrv', 'Windows Audio', 'Running', 'Automatic'],
  ['mysql', 'MySQL Server', 'Stopped', 'Disabled'],
  ['SSDPSRV', 'SSDP Discovery', 'Running', 'Manual'],
  ['LanmanServer', 'Server', 'Running', 'Automatic'],
  ['Schedule', 'Task Scheduler', 'Running', 'Automatic'],
  ['Netman', 'Network Connections', 'Running', 'Manual'],
] as const

const killed = new Set<number>()

export function mockProcesses(): ProcInfo[] {
  return PROC_NAMES.map((name, i) => ({
    Id: 1000 + i * 7,
    ProcessName: name,
    CPU: Math.round(Math.random() * 120 * 10) / 10,
    MemMB: Math.round((20 + Math.random() * 900) * 10) / 10,
  }))
    .filter((p) => !killed.has(p.Id))
    .sort((a, b) => b.MemMB - a.MemMB)
}

export function mockKill(id: number): void {
  killed.add(id)
}

export function mockServices(): ServiceInfo[] {
  return SERVICES.map(([Name, DisplayName, Status, StartType]) => ({
    Name,
    DisplayName,
    Status,
    StartType,
  }))
}

export function mockSystem(): SysStats {
  return {
    CpuPct: Math.round(15 + Math.random() * 70),
    MemUsedMB: Math.round(9000 + Math.random() * 4000),
    MemTotalMB: 16384,
  }
}
