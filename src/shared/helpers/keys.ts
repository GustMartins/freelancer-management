import { RecordsKey } from '../interfaces/records.types'

export const keysMap = {
  C: 'client',
  E: 'email',
  D: 'domain',
  Pay: 'payment',
  Metrics: 'metrics',
  Sessions: 'sessions',
  Pages: 'pages',
  Events: 'events',
  created: 'created',
  expired: 'expired',
  analysis: 'analysis',
  paid: 'paid',
  completed: 'completed',
  refunded: 'refunded',
  chargeback: 'chargeback'
}

/**
 * Função para decodificar uma chave em um objeto
 * @param id Identificador codificado da chave
 */
export function decodeKey(id: string): RecordsKey {
  if (!id.includes('#') && !id.includes('@')) {
    return {
      id,
      separator: 'none'
    }
  }

  const [key, value] = id.split(id.includes('@') ? '@' : '#')

  return {
    id: value,
    key: keysMap[key],
    separator: id.includes('@') ? 'at' : 'hashtag'
  }
}

/**
 * Função para codificar um objeto em uma chave
 * @param data Dados decodificados da chave
 */
export function encodeKey(data: RecordsKey): string {
  if (data.separator === 'none') { 
    return data.id
  }

  const keysMapInverted = Object.fromEntries(
    Object.entries(keysMap).map(a => a.reverse())
  )

  const separator = data.separator === 'at' ? '@' : '#'

  return `${keysMapInverted[data.key]}${separator}${data.id}`
}
