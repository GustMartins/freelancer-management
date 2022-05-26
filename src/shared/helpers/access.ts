import {
  ClientEntity, DomainEntity, LogEntityKinds, PaymentEntityStatuses
} from '../interfaces/records.types'
import {
  adminPrimaryKey, clientPrimaryKey, decodeKey, domainPrimaryKey,
  loginPrimaryKey, metricSecondaryKey
} from './keys'
import { createLog, createMetric } from './records'

export default {
  /**
   * Query para lista de clientes
  */
  listClients: () => ({
    IndexName: 'Lists',
    KeyConditionExpression: 'ListPk = :pk AND Sk = :sk',
    ExpressionAttributeValues: {
      ':pk': 'Client',
      ':sk': 'Profile'
    }
  }),

  /**
   * Query para lista de domínios
   */
  listDomains: () => ({
    IndexName: 'Lists',
    KeyConditionExpression: 'ListPk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'Domain',
      ':sk': 'D@'
    }
  }),

  /**
   * Query para lista de domínios de um cliente
   * @param client Identificador do cliente
   */
  listDomainsByClient: (client: string) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': clientPrimaryKey(client),
      ':sk': 'D@'
    }
  }),

  /**
   * Query para lista de pagamentos
   */
  listPayments: () => ({
    IndexName: 'Lists',
    KeyConditionExpression: 'ListPk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'Payment',
      ':sk': 'Pay#'
    },
    ScanIndexForward: false
  }),

  /**
   * Query para lista de pagamentos de um cliente
   * @param client Identificador do cliente
   */
  listPaymentsByClient: (client: string) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': clientPrimaryKey(client),
      ':sk': 'Pay#'
    },
    ScanIndexForward: false
  }),

  /**
   * Query para lista de pagamentos de determinado status
   * @param status Status para filtro
   */
  listPaymentsByStatus: (status: PaymentEntityStatuses) => ({
    IndexName: 'Payments',
    KeyConditionExpression: 'ListPk = :pk AND begins_with(StatusSk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'Payment',
      ':sk': `${status}#`
    },
    ScanIndexForward: false
  }),

  /**
   * Query para lista de métricas de um domínio
   * @param domain Identificador do domínio
   */
  listDomainMetrics: (domain: string) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': domainPrimaryKey(domain),
      ':sk': 'Metrics@'
    }
  }),

  /**
   * Query para lista de métricas de um determinado ano de um domínio
   * @param domain Identificador do domínio
   * @param year Ano para consulta
   */
  listDomainMetricsByYear: (domain: string, year: number) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': domainPrimaryKey(domain),
      ':sk': metricSecondaryKey(`${year}`)
    }
  }),

  /**
   * Query para lista de métricas de um determinado período de um domínio
   * @param domain Identificador do domínio
   * @param start Data de início do período
   * @param end Data de término do período
   */
  listDomainMetricsByPeriod: (domain: string, start: Date, end: Date) => ({
    KeyConditionExpression: 'Pk = :pk AND Sk BETWEEN :start AND :end',
    ExpressionAttributeValues: {
      ':pk': domainPrimaryKey(domain),
      ':start': metricSecondaryKey(start.toISOString().substring(0, 7)),
      ':end': metricSecondaryKey(end.toISOString().substring(0, 7))
    }
  }),

  /**
   * Query para listar as atividades de uma sessão analítica de um domínio
   * @param id Identificador da sessão
   */
  listSessionActivity: (id: string) => ({
    IndexName: 'Analytics',
    KeyConditionExpression: 'SessionId = :pk',
    ExpressionAttributeValues: {
      ':pk': id
    }
  }),

  /**
   * Get para retornar o administrador
   * @param email Identificador do administrador
   * @returns
   */
  retrieveAdmin: (email: string) => ({
    Pk: adminPrimaryKey(email),
    Sk: 'Admin'
  }),

  /**
   * Get para retornar um login de cliente
   * @param email E-mail de login do cliente
   */
  retrieveLogin: (email: string) => ({
    Pk: loginPrimaryKey(email),
    Sk: 'Login'
  }),

  /**
   * Get para retornar um cliente
   * @param client Identificador do cliente
   */
  retrieveClient: (client: string) => ({
    Pk: clientPrimaryKey(client),
    Sk: 'Profile'
  }),

  /**
   * Get para retornar um domínio
   * @param client Identificador do cliente
   * @param domain Identificador do domínio
   */
  retrieveDomain: (client: string, domain: string) => ({
    Pk: clientPrimaryKey(client),
    Sk: domainPrimaryKey(domain)
  }),

  /**
   * Get para retornar uma métrica específica
   * @param domain Identificador do domínio
   * @param date Data do registro para retorno
   */
  retrieveMetric: (domain: string, date: Date) => ({
    Pk: domainPrimaryKey(domain),
    Sk: metricSecondaryKey(date.toISOString().substring(0, 7))
  }),

  /**
   * Put para registrar um domínio a um cliente
   * @param client Registro do cliente
   * @param domain Registro do domínio
   * @param table Nome da tabela no banco de dados
   */
  putDomain: (client: ClientEntity, domain: DomainEntity, table: string) => ({
    TransactItems: [
      {
        Put: {
          TableName: table,
          Item: domain
        }
      },
      {
        Put: {
          TableName: table,
          Item: createMetric(domain.Sk.substring(2), new Date())
        }
      },
      {
        Update: {
          TableName: table,
          Key: {
            Pk: client.Pk,
            Sk: client.Sk
          },
          UpdateExpression: 'ADD DomainCount 1',
          ExpressionAttributeValues: {
            ':value': 1
          }
        }
      }
    ]
  }),

  /**
   * Put para registrar uma métrica a um domínio
   * @param session Identificador da sessão
   * @param domainId Registro do domínio
   * @param type Tipo de registro de log
   * @param date Datas de registros atuais (sem a nova entrada)
   * @param data Dados adicionais do registro de log
   * @param table Nome da tabela no banco de dados
   */
  putMetricLog: (session: string, domainId: string, type: LogEntityKinds, dates: string[], data: Record<string, any>, table: string) => {
    const date = new Date()
    const TransactItems: any = [
      {
        Put: {
          TableName: table,
          Item: createLog(session, decodeKey(domainId).id, type, date, data)
        }
      },
      {
        Update: {
          TableName: table,
          Key: {
            Pk: domainId,
            Sk: metricSecondaryKey(date.toISOString().substring(0, 7))
          },
          UpdateExpression: 'ADD #ct.#prop :value',
          ExpressionAttributeNames: {
            '#ct': 'Content',
            '#prop': `${type}Count`
          },
          ExpressionAttributeValues: {
            ':value': 1
          }
        }
      }
    ]

    if (type !== 'Sessions') {
      TransactItems.push({
        Update: {
          TableName: table,
          Key: {
            Pk: domainId,
            Sk: metricSecondaryKey(date.toISOString().substring(0, 7))
          },
          UpdateExpression: 'SET #ct.#ty.#pe = :value',
          ExpressionAttributeNames: {
            '#ct': 'Content',
          '#ty': type,
          '#pe': data.page || data.event
          },
          ExpressionAttributeValues: {
            ':value': [...dates, date.toISOString()]
          }
        }
      })
    }

    return { TransactItems }
  },

  /**
   * Query para buscar um pagamento de um domínio pelo identificador
   * @param id Identificador do pagamento
   */
  queryPaymentById: (id: string) => ({
    IndexName: 'PicPay',
    KeyConditionExpression: 'PI = :pk',
    ExpressionAttributeValues: {
      ':pk': id,
    }
  }),

  /**
   * Query para buscar todos os eventos de uma sessão de acesso
   * @param id Identificador da sessão
   */
  querySessionById: (id: string) => ({
    IndexName: 'Analytics',
    KeyConditionExpression: 'SessionId = :pk',
    ExpressionAttributeValues: {
      ':pk': id
    }
  })
}
