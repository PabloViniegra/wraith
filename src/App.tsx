import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useApp, useInput, useStdout } from 'ink';
import { theme } from './theme';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Table, type Column } from './components/Table';
import { usePolling } from './hooks/usePolling';
import { USE_MOCK } from './lib/config';
import { listProcesses, killProcess, type ProcInfo } from './lib/processes';
import {
  listServices,
  startService,
  stopService,
  restartService,
  type ServiceInfo,
} from './lib/services';
import { getSystemStats, type SysStats } from './lib/system';

type View = 'processes' | 'services';
type Status = { text: string; kind: 'info' | 'ok' | 'err' };
type Confirm = { message: string; run: () => Promise<void> };

const clampIndex = (i: number, len: number) =>
  len === 0 ? 0 : Math.max(0, Math.min(i, len - 1));

const procColumns: Column<ProcInfo>[] = [
  { key: 'pid', header: 'PID', width: 7, align: 'right', value: (p) => String(p.Id) },
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
];

const svcColumns: Column<ServiceInfo>[] = [
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
  { key: 'disp', header: 'DISPLAY NAME', width: 38, value: (s) => s.DisplayName },
  { key: 'start', header: 'STARTUP', width: 11, value: (s) => s.StartType },
];

export function App() {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const termRows = stdout?.rows ?? 30;
  const visible = Math.max(4, termRows - 17);

  const [view, setView] = useState<View>('processes');
  const [procSel, setProcSel] = useState(0);
  const [svcSel, setSvcSel] = useState(0);
  const [filter, setFilter] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const procs = usePolling<ProcInfo[]>(listProcesses, 2500, []);
  const svcs = usePolling<ServiceInfo[]>(listServices, 4000, []);
  const sys = usePolling<SysStats | null>(getSystemStats, 3000, null);

  const fProcs = useMemo(() => {
    const f = filter.toLowerCase();
    if (!f) return procs.data;
    return procs.data.filter(
      (p) =>
        p.ProcessName.toLowerCase().includes(f) || String(p.Id).includes(f),
    );
  }, [procs.data, filter]);

  const fSvcs = useMemo(() => {
    const f = filter.toLowerCase();
    if (!f) return svcs.data;
    return svcs.data.filter(
      (s) =>
        s.DisplayName.toLowerCase().includes(f) ||
        s.Name.toLowerCase().includes(f),
    );
  }, [svcs.data, filter]);

  const rows = view === 'processes' ? fProcs : fSvcs;
  const sel = clampIndex(view === 'processes' ? procSel : svcSel, rows.length);

  const flash = (text: string, kind: Status['kind']) =>
    setStatus({ text, kind });

  // Auto-limpiar el mensaje de estado.
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const move = (delta: number) => {
    if (view === 'processes') {
      setProcSel((s) => clampIndex(s + delta, fProcs.length));
    } else {
      setSvcSel((s) => clampIndex(s + delta, fSvcs.length));
    }
  };

  useInput((input, key) => {
    // --- Diálogo de confirmación ---
    if (confirm) {
      if (input === 'y' || input === 'Y') {
        const run = confirm.run;
        setConfirm(null);
        run()
          .then(() => flash('Operación ejecutada', 'ok'))
          .catch((e: unknown) =>
            flash(e instanceof Error ? e.message : String(e), 'err'),
          );
      } else if (input === 'n' || input === 'N' || key.escape) {
        setConfirm(null);
      }
      return;
    }

    // --- Modo filtro (captura de texto) ---
    if (filtering) {
      if (key.return || key.escape) setFiltering(false);
      else if (key.backspace || key.delete) setFilter((f) => f.slice(0, -1));
      else if (input && !key.ctrl && !key.meta) setFilter((f) => f + input);
      return;
    }

    // --- Navegación general ---
    if (input === 'q' || (key.ctrl && input === 'c')) return exit();
    if (key.tab || key.leftArrow || key.rightArrow) {
      setView((v) => (v === 'processes' ? 'services' : 'processes'));
      return;
    }
    if (key.upArrow || input === 'k') return move(-1);
    if (key.downArrow || input === 'j') return move(1);
    if (key.pageUp) return move(-visible);
    if (key.pageDown) return move(visible);
    if (input === '/') {
      setFiltering(true);
      return;
    }
    if (input === 'R') {
      void procs.refresh();
      void svcs.refresh();
      void sys.refresh();
      flash('Actualizado', 'info');
      return;
    }

    // --- Acciones por vista ---
    if (view === 'processes') {
      if (input === 'x' || key.delete) {
        const p = fProcs[sel];
        if (!p) return;
        setConfirm({
          message: `\u00bfTerminar ${p.ProcessName} (PID ${p.Id})?`,
          run: () => killProcess(p.Id).then(() => void procs.refresh()),
        });
      }
      return;
    }

    const s = fSvcs[sel];
    if (!s) return;
    if (input === 'e') {
      startService(s.Name)
        .then(() => {
          void svcs.refresh();
          flash(`Servicio "${s.Name}" iniciado`, 'ok');
        })
        .catch((err: unknown) =>
          flash(err instanceof Error ? err.message : String(err), 'err'),
        );
    } else if (input === 's') {
      setConfirm({
        message: `\u00bfDetener servicio "${s.DisplayName}"?`,
        run: () => stopService(s.Name).then(() => void svcs.refresh()),
      });
    } else if (input === 'r') {
      setConfirm({
        message: `\u00bfReiniciar servicio "${s.DisplayName}"?`,
        run: () => restartService(s.Name).then(() => void svcs.refresh()),
      });
    }
  });

  const error = view === 'processes' ? procs.error : svcs.error;
  const loading =
    view === 'processes'
      ? procs.loading && fProcs.length === 0
      : svcs.loading && fSvcs.length === 0;

  const tab = (label: string, active: boolean) => (
    <Text
      bold
      color={active ? theme.selectionFg : theme.dim}
      backgroundColor={active ? theme.fg : undefined}
    >
      {` ${label} `}
    </Text>
  );

  return (
    <Box flexDirection="column">
      <Header
        sys={sys.data}
        procCount={procs.data.length}
        svcCount={svcs.data.length}
        mock={USE_MOCK}
      />

      <Box paddingX={1}>
        {tab('PROCESSES', view === 'processes')}
        <Text> </Text>
        {tab('SERVICES', view === 'services')}
        {filter ? (
          <Text color={theme.accent}>{`   filtro: ${filter}`}</Text>
        ) : null}
      </Box>

      <Box
        borderStyle="round"
        borderColor={theme.border}
        paddingX={1}
        flexDirection="column"
      >
        {error ? (
          <Text color={theme.danger}>{`\u26a0 ${error}`}</Text>
        ) : loading ? (
          <Text color={theme.dim}>{'escaneando el sistema\u2026'}</Text>
        ) : view === 'processes' ? (
          <Table columns={procColumns} rows={fProcs} selected={sel} visible={visible} />
        ) : (
          <Table columns={svcColumns} rows={fSvcs} selected={sel} visible={visible} />
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
            {`\u00bb ${status.text}`}
          </Text>
        </Box>
      ) : null}

      {confirm ? (
        <Box borderStyle="round" borderColor={theme.warn} paddingX={1}>
          <Text color={theme.warn}>{`${confirm.message} `}</Text>
          <Text color={theme.bright}>[y/n]</Text>
        </Box>
      ) : (
        <Footer view={view} filtering={filtering} filter={filter} />
      )}
    </Box>
  );
}
