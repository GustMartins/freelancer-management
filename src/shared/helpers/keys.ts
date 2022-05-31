import { RecordsKey, RecordsKeyMap } from '../interfaces/records.types'

export const keysMap: Record<string, keyof RecordsKeyMap> = {
  A: 'admin',
  C: 'client',
  E: 'email',
  D: 'domain',
  Pay: 'payment',
  'Pay$Tax': 'tax',
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

  let [key, value, sub] = id.split(id.includes('@') ? '@' : '#')

  if (sub) {
    key += `$${value}`
    value = sub
  }

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
  const key = keysMapInverted[data.key].includes('$')
    ? keysMapInverted[data.key].replace('$', '#')
    : keysMapInverted[data.key]

  return `${key}${separator}${data.id}`
}

/**
 * Função para retornar uma chave de administrador independente de o id fornecido
 * já ser uma chave de administrador
 * @param email Identificador do administrador
 */
export function adminPrimaryKey(email: string): string {
  const parsedEmail = email.startsWith('A#')
    ? email.substring(2).replace('@', '$')
    : email.replace('@', '$')

  return encodeKey({
    id: decodeKey(parsedEmail).id.replace('$', '@'),
    key: 'admin',
    separator: 'hashtag'
  })
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
  const parsedEmail = email.startsWith('E#')
    ? email.substring(2).replace('@', '$')
    : email.replace('@', '$')

  return encodeKey({
    id: decodeKey(parsedEmail).id.replace('$', '@'),
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
 * Função para retornar uma chave de pagamento de taxa independente de o id
 * fornecido já ser uma chave de pagamento de taxa
 * @param id Identificador da taxa
 * @returns
 */
export function taxSecondaryKey(id: string): string {
  return encodeKey({
    id: decodeKey(id).id,
    key: 'tax',
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
