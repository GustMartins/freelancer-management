
/**
 * Função para retornar uma classe Date do próximo mês
 */
export function nextMonth (): Date {
  const today = new Date()

  return new Date(today.getFullYear(), today.getMonth() + 1)
}

/**
 * Função para gerar uma lista dos últimos n meses
 * @param n Quantidade de registros
 */
export function previousNMonths (n: number): Date[] {
  const dates = []
  const today = new Date()

  for (let i = 1; i <= n; i++) {
    dates.push(new Date(today.getFullYear(), today.getMonth() - i))
  }

  return dates
}

/**
 * Função para retornar a diferença de meses entre duas datas
 * @param start Data inicial
 * @param end Data final
 */
export function monthDifference (start: Date, end: Date): number {
  return end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()))
}

/**
 * Função para verificar se uma data é um múltiplo de 3
 * (usado para calcular de 3 em 3 meses em relação à data inicial)
 * @param date Data inicial para referência
 */
export function isQuarterlyPeriod (date: Date): boolean {
  const difference = monthDifference(date, new Date()) +1

  if (difference > 1) {
    return (difference % 3) === 0
  }

  return false
}

/**
 * Função para verificar se uma data é um múltiplo de 12
 * (usado para calcular de ano em ano em relação à data inicial)
 * @param date Data inicial para referência
 * @returns
 */
export function isAnualPeriod (date: Date): boolean {
  const difference = monthDifference(date, new Date()) +1

  if (difference > 1) {
    return (difference % 12) === 0
  }
  return false
}
