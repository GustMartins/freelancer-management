import {
  ClientEntity, DomainEntity, LogEntity, LogEntityKinds, MetricEntity,
  PaymentEntity, PaymentEntityStatuses
} from '../interfaces/records.types'
import { decodeKey, encodeKey } from './keys'

/**
 * Função para criar um registro de usuário
 * @param id Identificador do usuário
 * @param email E-mail do usuário
 * @param password Senha de acesso aos dados analíticos
 * @returns Dados do registro do clientes
 */
export function createClient(id: string, email: string, document: string, password: string): ClientEntity {
  const pkId = encodeKey({
    id: decodeKey(id).id,
    key: 'client',
    separator: 'hashtag'
  })

  return {
    Pk: pkId,
    Sk: 'Profile',
    ListPk: 'Client',
    Email: email,
    Password: password,
    Document: document,
    DomainCount: 0
  }
}

/**
 * Função para criar um registro de pagamento
 * @param id Identificador do usuário
 * @param year Ano de validade do pagamento
 * @param date Data da criação do registro
 * @returns Dados do registro do pagamento
 */
export function createPayment(id: string, year: number, date: Date): PaymentEntity {
  const status: PaymentEntityStatuses = 'created'

  return {
    Pk: `C#${id}`,
    Sk: `Pay#${year}`,
    ListPk: `Payment`,
    StatusSk: `${status}#${date.toISOString()}`
  }
}

/**
 * Função para criar um registro de domínio
 * @param client Registro do cliente
 * @param id Identificador do domínio
 * @param domain URL do domínio
 * @returns Dados do registro do domínio
 */
export function createDomain(client: ClientEntity, id: string, domain: string): DomainEntity {
  return {
    Pk: client.Pk,
    Sk: `D@${id}`,
    ListPk: 'Domain', 
    Client: client.Email, 
    Website: domain
  }
}

/**
 * Função para criar um registro de métrica mensal
 * @param domain Identificador do domínio
 * @param date Data inicial do período das métricas
 * @returns Dados do registro da métrica
 */
export function createMetric(domain: string, date: Date): MetricEntity {
  return {
    Pk: `D@${domain}`,
    Sk: `Metrics@${date.toISOString().substring(0, 7)}`,
    Content: {
      Created: date.toISOString(),
      SessionsCount: 0,
      PagesCount: 0,
      EventsCount: 0,
      Pages: {},
      Events: {}
    }
  }
}

/**
 * Função para um registro de log de métrica
 * @param domain Identificador do domínio
 * @param type Tipo de registro de log
 * @param date Data do registro
 * @returns Dados do registro de um log de métrica
 */
export function createLog(domain: string, type: LogEntityKinds, date: Date, data: Record<string, any>): LogEntity {
  return {
    Pk: `D@${domain}`,
    Sk: `${type}#${date.toISOString()}`,
    Kind: type,
    Content: data
  }
}
