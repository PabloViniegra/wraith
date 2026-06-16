import { Box, Text } from 'ink'
import { theme } from '../../styles/theme'

const SEP = '◆'
const CURSOR = '█'

interface Props {
  view: 'processes' | 'services'
  filtering: boolean
  filter: string
}

export function Footer({ view, filtering, filter }: Props) {
  const common = `↑↓/jk mover ${SEP} Tab cambiar ${SEP} / filtrar ${SEP} R refrescar ${SEP} q salir`
  const perView =
    view === 'processes'
      ? '▸ x terminar proceso'
      : `▸ e iniciar ${SEP} s detener ${SEP} r reiniciar`

  return (
    <Box
      flexDirection='column'
      borderStyle='round'
      borderColor={theme.borderSecondary}
      paddingX={1}
    >
      <Text color={theme.dim}>
        <Text color={theme.fg}>{perView}</Text> {SEP} {common}
      </Text>
      {filtering && (
        <Text color={theme.accent}>
          ▸ filtro: {filter}
          <Text color={theme.bright}>{CURSOR}</Text>
        </Text>
      )}
    </Box>
  )
}
