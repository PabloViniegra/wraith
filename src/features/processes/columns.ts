import type { ProcInfo } from '../../lib/processes'
import { theme } from '../../styles/theme'
import type { Column } from '../../ui/components/Table'

export const procColumns: Column<ProcInfo>[] = [
  {
    key: 'pid',
    header: 'PID',
    width: 7,
    align: 'right',
    value: (p) => String(p.Id),
  },
  { key: 'name', header: 'PROCESS', width: 28, value: (p) => p.ProcessName },
  {
    key: 'cpu',
    header: 'CPU(s)',
    width: 9,
    align: 'right',
    value: (p) => String(p.CPU ?? 0),
  },
  {
    key: 'mem',
    header: 'MEM(MB)',
    width: 10,
    align: 'right',
    value: (p) => p.MemMB.toFixed(1),
    color: (p) => (p.MemMB > 500 ? theme.warn : undefined),
  },
]
