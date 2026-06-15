import type { ServiceInfo } from '../../lib/services'
import { theme } from '../../styles/theme'
import type { Column } from '../../ui/components/Table'

export const svcColumns: Column<ServiceInfo>[] = [
  {
    key: 'status',
    header: 'STATE',
    width: 9,
    value: (s) => s.Status,
    color: (s) =>
      s.Status === 'Running'
        ? theme.bright
        : s.Status === 'Stopped'
          ? theme.danger
          : theme.warn,
  },
  { key: 'name', header: 'NAME', width: 22, value: (s) => s.Name },
  {
    key: 'disp',
    header: 'DISPLAY NAME',
    width: 38,
    value: (s) => s.DisplayName,
  },
  { key: 'start', header: 'STARTUP', width: 11, value: (s) => s.StartType },
]
