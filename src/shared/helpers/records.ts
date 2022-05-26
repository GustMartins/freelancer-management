import {
  ClientEntity, DomainEntity, LogEntity, LogEntityKinds, LoginEntity,
  MetricEntity, PaymentEntity, PaymentEntityStatuses
} from '../interfaces/records.types'
import {
  clientPrimaryKey, decodeKey, domainPrimaryKey, loginPrimaryKey,
  metricSecondaryKey, paymentSecondaryKey
} from './keys'

/**
 * Função para criar um registro de usuário
 * @param id Identificador do usuário
 * @param email E-mail do usuário
 * @param password Senha de acesso aos dados analíticos
 * @returns Dados do registro do clientes
 */
export function createClient(id: string, email: string, document: string, password: string): ClientEntity {
  const date = new Date()

  return {
    Pk: clientPrimaryKey(id),
    Sk: 'Profile',
    ListPk: 'Client',
    Email: email,
    Password: password,
    Document: document,
    DomainCount: 0,
    InvoiceAt: date.getMonth()
  }
}

/**
 * Função para criar um registro de login do usuário
 * @param client Dados do registro do cliente
 * @returns Dados do registro de login
 */
export function createLogin(client: ClientEntity): LoginEntity {
  return {
    Pk: loginPrimaryKey(client.Email),
    Sk: 'Login',
    Client: decodeKey(client.Pk).id
  }
}

/**
 * Função para criar um registro de pagamento
 * @param client E-mail do cliente
 * @param id Identificador do usuário
 * @param year Ano de validade do pagamento
 * @param date Data da criação do registro
 * @returns Dados do registro do pagamento
 */
export function createPayment(client: string, id: string, year: number, date: Date, value: number, domains: number): PaymentEntity {
  const status: PaymentEntityStatuses = 'created'

  return {
    Pk: clientPrimaryKey(id),
    Sk: paymentSecondaryKey(year),
    ListPk: `Payment`,
    StatusSk: `${status}#${date.toISOString()}`,
    Client: client,
    RetryCount: 0,
    Value: value,
    DomainCount: domains
  }
}

/**
 * Função para criar um registro de domínio
 * @param client Registro do cliente
 * @param id Identificador do domínio
 * @param domain URL do domínio
 * @returns Dados do registro do domínio
 */
export function createDomain(client: ClientEntity, id: string, domain: string, value: number): DomainEntity {
  return {
    Pk: clientPrimaryKey(client.Pk),
    Sk: domainPrimaryKey(id),
    ListPk: 'Domain',
    Client: client.Email,
    Website: domain,
    Value: value,
    CreatedAt: new Date().toISOString().substring(0, 7)
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
    Pk: domainPrimaryKey(domain),
    Sk: metricSecondaryKey(date.toISOString().substring(0, 7)),
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
export function createLog(session: string, domain: string, type: LogEntityKinds, date: Date, data: Record<string, any>): LogEntity {
  return {
    Pk: domainPrimaryKey(domain),
    Sk: `${type}#${date.toISOString()}`,
    SessionId: session,
    Kind: type,
    Content: data
  }
}
