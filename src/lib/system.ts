import { runPwsh } from './powershell';
import { USE_MOCK } from './config';
import { mockSystem } from './mock';

export interface SysStats {
  CpuPct: number;
  MemUsedMB: number;
  MemTotalMB: number;
}

const SCRIPT = `
$os = Get-CimInstance Win32_OperatingSystem
$cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
[pscustomobject]@{
  CpuPct    = [int]($cpu)
  MemUsedMB = [int]((($os.TotalVisibleMemorySize) - ($os.FreePhysicalMemory)) / 1024)
  MemTotalMB= [int]($os.TotalVisibleMemorySize / 1024)
} | ConvertTo-Json -Compress
`;

export async function getSystemStats(): Promise<SysStats> {
  if (USE_MOCK) return mockSystem();
  return runPwsh<SysStats>(SCRIPT);
}
