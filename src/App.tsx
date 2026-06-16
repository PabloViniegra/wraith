import { Box, Text, useApp, useInput, useStdout } from 'ink'
import { useEffect, useMemo, useState } from 'react'
import { procColumns } from './features/processes/columns'
import { svcColumns } from './features/services/columns'
import { usePolling } from './hooks/usePolling'
import { USE_MOCK } from './lib/config'
import { killProcess, listProcesses, type ProcInfo } from './lib/processes'
import {
  listServices,
  restartService,
  type ServiceInfo,
  startService,
  stopService,
} from './lib/services'
import { getSystemStats, type SysStats } from './lib/system'
import { theme } from './styles/theme'
import { Footer } from './ui/components/Footer'
import { Header } from './ui/components/Header'
import { Table } from './ui/components/Table'
import { Spinner } from './ui/primitives/Spinner'

type View = 'processes' | 'services'
type Status = { text: string; kind: 'info' | 'ok' | 'err' }
type Confirm = { message: string; run: () => Promise<void> }

export const STATUS_ICON: Record<Status['kind'], string> = {
  ok: '⚡',
  err: '☠',
  info: '◈',
}

const clampIndex = (i: number, len: number) =>
  len === 0 ? 0 : Math.max(0, Math.min(i, len - 1))

export function App() {
  const { exit } = useApp()
  const { stdout } = useStdout()
  const termRows = stdout?.rows ?? 30
  const visible = Math.max(4, termRows - 17)

  const [view, setView] = useState<View>('processes')
  const [procSel, setProcSel] = useState(0)
  const [svcSel, setSvcSel] = useState(0)
  const [filter, setFilter] = useState('')
  const [filtering, setFiltering] = useState(false)
  const [confirm, setConfirm] = useState<Confirm | null>(null)
  const [status, setStatus] = useState<Status | null>(null)

  const procs = usePolling<ProcInfo[]>(listProcesses, 2500, [])
  const svcs = usePolling<ServiceInfo[]>(listServices, 4000, [])
  const sys = usePolling<SysStats | null>(getSystemStats, 3000, null)

  // Most recent successful update across all data sources
  const lastUpdated = useMemo(() => {
    const dates = [procs.lastUpdated, svcs.lastUpdated, sys.lastUpdated].filter(
      Boolean,
    ) as Date[]
    if (!dates.length) return null
    return new Date(Math.max(...dates.map((d) => d.getTime())))
  }, [procs.lastUpdated, svcs.lastUpdated, sys.lastUpdated])

  const fProcs = useMemo(() => {
    const f = filter.toLowerCase()
    if (!f) return procs.data
    return procs.data.filter(
      (p) =>
        p.ProcessName.toLowerCase().includes(f) || String(p.Id).includes(f),
    )
  }, [procs.data, filter])

  const fSvcs = useMemo(() => {
    const f = filter.toLowerCase()
    if (!f) return svcs.data
    return svcs.data.filter(
      (s) =>
        s.DisplayName.toLowerCase().includes(f) ||
        s.Name.toLowerCase().includes(f),
    )
  }, [svcs.data, filter])

  const rows = view === 'processes' ? fProcs : fSvcs
  const sel = clampIndex(view === 'processes' ? procSel : svcSel, rows.length)

  const flash = (text: string, kind: Status['kind']) =>
    setStatus({ text, kind })

  useEffect(() => {
    if (!status) return
    const t = setTimeout(() => setStatus(null), 4000)
    return () => clearTimeout(t)
  }, [status])

  const move = (delta: number) => {
    if (view === 'processes') {
      setProcSel((s) => clampIndex(s + delta, fProcs.length))
    } else {
      setSvcSel((s) => clampIndex(s + delta, fSvcs.length))
    }
  }

  useInput((input, key) => {
    if (confirm) {
      if (input === 'y' || input === 'Y') {
        const run = confirm.run
        setConfirm(null)
        run()
          .then(() => flash('Operación ejecutada', 'ok'))
          .catch((e: unknown) =>
            flash(e instanceof Error ? e.message : String(e), 'err'),
          )
      } else if (input === 'n' || input === 'N' || key.escape) {
        setConfirm(null)
      }
      return
    }

    if (filtering) {
      if (key.return || key.escape) setFiltering(false)
      else if (key.backspace || key.delete) setFilter((f) => f.slice(0, -1))
      else if (input && !key.ctrl && !key.meta) setFilter((f) => f + input)
      return
    }

    if (input === 'q' || (key.ctrl && input === 'c')) return exit()
    if (key.tab || key.leftArrow || key.rightArrow) {
      setView((v) => (v === 'processes' ? 'services' : 'processes'))
      return
    }
    if (key.upArrow || input === 'k') return move(-1)
    if (key.downArrow || input === 'j') return move(1)
    if (key.pageUp) return move(-visible)
    if (key.pageDown) return move(visible)
    if (input === '/') {
      setFiltering(true)
      return
    }
    if (input === 'R') {
      void procs.refresh()
      void svcs.refresh()
      void sys.refresh()
      flash('Actualizado', 'info')
      return
    }

    if (view === 'processes') {
      if (input === 'x' || key.delete) {
        const p = fProcs[sel]
        if (!p) return
        setConfirm({
          message: `¿Terminar ${p.ProcessName} (PID ${p.Id})?`,
          run: () => killProcess(p.Id).then(() => void procs.refresh()),
        })
      }
      return
    }

    const s = fSvcs[sel]
    if (!s) return
    if (input === 'e') {
      startService(s.Name)
        .then(() => {
          void svcs.refresh()
          flash(`Servicio "${s.Name}" iniciado`, 'ok')
        })
        .catch((err: unknown) =>
          flash(err instanceof Error ? err.message : String(err), 'err'),
        )
    } else if (input === 's') {
      setConfirm({
        message: `¿Detener servicio "${s.DisplayName}"?`,
        run: () => stopService(s.Name).then(() => void svcs.refresh()),
      })
    } else if (input === 'r') {
      setConfirm({
        message: `¿Reiniciar servicio "${s.DisplayName}"?`,
        run: () => restartService(s.Name).then(() => void svcs.refresh()),
      })
    }
  })

  const error = view === 'processes' ? procs.error : svcs.error
  const loading =
    view === 'processes'
      ? procs.loading && fProcs.length === 0
      : svcs.loading && fSvcs.length === 0

  const tab = (icon: string, label: string, active: boolean) => (
    <Text
      bold
      color={active ? theme.selectionFg : theme.dim}
      backgroundColor={active ? theme.selectionBg : undefined}
    >
      {` ${icon} ${label} `}
    </Text>
  )

  return (
    <Box flexDirection='column'>
      <Header
        sys={sys.data}
        procCount={procs.data.length}
        svcCount={svcs.data.length}
        mock={USE_MOCK}
        lastUpdated={lastUpdated}
      />

      <Box paddingX={1}>
        {tab('⚡', 'PROCESSES', view === 'processes')}
        <Text color={theme.dim}> ◆ </Text>
        {tab('◈', 'SERVICES', view === 'services')}
        {filter ? (
          <Text color={theme.accent}>{`   ▸ filtro: ${filter}`}</Text>
        ) : null}
      </Box>

      <Box
        borderStyle='double'
        borderColor={theme.border}
        paddingX={1}
        flexDirection='column'
      >
        {error ? (
          <Text color={theme.danger}>{`⚠ ${error}`}</Text>
        ) : loading ? (
          <Spinner label='escaneando el sistema…' />
        ) : view === 'processes' ? (
          <Table
            columns={procColumns}
            rows={fProcs}
            selected={sel}
            visible={visible}
          />
        ) : (
          <Table
            columns={svcColumns}
            rows={fSvcs}
            selected={sel}
            visible={visible}
          />
        )}
      </Box>

      {status ? (
        <Box paddingX={1}>
          <Text
            color={
              status.kind === 'err'
                ? theme.danger
                : status.kind === 'ok'
                  ? theme.bright
                  : theme.accent
            }
          >
            {`${STATUS_ICON[status.kind]} ${status.text}`}
          </Text>
        </Box>
      ) : null}

      {confirm ? (
        <Box borderStyle='round' borderColor={theme.accent} paddingX={1}>
          <Text color={theme.accent}>{`⚠ ${confirm.message} `}</Text>
          <Text color={theme.danger}>[Y]</Text>
          <Text color={theme.dim}>/[n]</Text>
        </Box>
      ) : (
        <Footer view={view} filtering={filtering} filter={filter} />
      )}
    </Box>
  )
}
