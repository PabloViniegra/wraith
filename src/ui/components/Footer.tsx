import { Box, Text } from 'ink'
import { theme } from '../../styles/theme'

const DOT = '·'
const CURSOR = '█'

interface Props {
  view: 'processes' | 'services'
  filtering: boolean
  filter: string
}

export function Footer({ view, filtering, filter }: Props) {
  const common = `↑↓/jk mover ${DOT} Tab cambiar ${DOT} / filtrar ${DOT} R refrescar ${DOT} q salir`
  const perView =
    view === 'processes'
      ? 'x terminar proceso'
      : `e iniciar ${DOT} s detener ${DOT} r reiniciar`

  return (
    <Box
      flexDirection='column'
      borderStyle='round'
      borderColor={theme.dim}
      paddingX={1}
    >
      <Text color={theme.dim}>
        <Text color={theme.fg}>{perView}</Text> {DOT} {common}
      </Text>
      {filtering && (
        <Text color={theme.accent}>
          filtro: {filter}
          <Text color={theme.bright}>{CURSOR}</Text>
        </Text>
      )}
    </Box>
  )
}
