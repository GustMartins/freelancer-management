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

/**
 * Função para retornar uma chave de cliente independente de o id fornecido
 * já ser uma chave de cliente
 * @param id Identificador do cliente
 */
export function clientPrimaryKey(id: string): string {
  return encodeKey({
    id: decodeKey(id).id,
    key: 'client',
    separator: 'hashtag'
  })
}

/**
 * Função para retornar uma chave de login independente de o id fornecido
 * já ser uma chave de login
 * @param id Identificador do login
 */
export function loginPrimaryKey(email: string): string {
  return encodeKey({
    id: decodeKey(email).id,
    key: 'email',
    separator: 'hashtag'
  })
}

/**
 * Função para retornar uma chave de domínio independente de o id fornecido
 * já ser uma chave de domínio
 * @param id Identificador do domínio
 */
export function domainPrimaryKey(id: string): string {
  return encodeKey({
    id: decodeKey(id).id,
    key: 'domain',
    separator: 'at'
  })
}

/**
 * Função para retornar uma chave de pagamento independente de o id fornecido
 * já ser uma chave de pagamento
 * @param year Identificador do pagamento
 */
export function paymentSecondaryKey(year: string | number): string {
  return encodeKey({
    id: decodeKey(`${year}`).id,
    key: 'payment',
    separator: 'hashtag'
  })
}

/**
 * Função para retornar uma chave de métrica independente de o id fornecido
 * já ser uma chave de métrica
 * @param id Identificador do métrica
 */
export function metricSecondaryKey(id: string): string {
  return encodeKey({
    id: decodeKey(id).id,
    key: 'metrics',
    separator: 'at'
  })
}
