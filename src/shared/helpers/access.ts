import {
  ClientEntity, DomainEntity, LogEntityKinds
} from '../interfaces/records.types'
import { createLog, createMetric } from './records'

export default {
  /**
   * Query para lista de clientes
  */
  listClients: {
    IndexName: 'Lists',
    KeyConditionExpression: 'ListPk = :pk AND Sk',
    ExpressionAttributeValues: {
      ':pk': 'Client',
      ':sk': 'Profile'
    }
  },

  /**
   * Query para lista de domínios
   */
  listDomains: {
    IndexName: 'Lists',
    KeyConditionExpression: 'ListPk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'Domain',
      ':sk': 'D@'
    }
  },

  /**
   * Query para lista de domínios de um cliente
   * @param client Identificador do cliente
   */
  listDomainsByClient: (client: string) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `C#${client}`,
      ':sk': 'D@'
    }
  }),

  /**
   * Query para lista de pagamentos
   * TODO: Verificar a ordenação dos dados em retorno
   */
  listPayments: {
    IndexName: 'Lists',
    KeyConditionExpression: 'ListPk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'Payment',
      ':sk': 'Pay#'
    }
  },

  /**
   * Query para lista de pagamentos de um cliente
   * TODO: Verificar a ordenação dos dados em retorno
   * @param client Identificador do cliente
   */
  listPaymentsByClient: (client: string) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `C#${client}`,
      ':sk': 'Pay#'
    }
  }),

  /**
   * Query para lista de pagamentos de determinado status
   * TODO: Verificar a ordenação dos dados em retorno
   * @param status Status para filtro
   */
  listPaymentByStatus: (status: string) => ({
    IndexName: 'Payments',
    KeyConditionExpression: 'ListPk = :pk AND begins_with(StatusSk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'Payment',
      ':sk': `${status}#`
    }
  }),

  /**
   * Query para lista de métricas de um domínio
   * @param domain Identificador do domínio
   */
  listDomainMetrics: (domain: string) => ({
    KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `D@${domain}`,
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
      ':pk': `D@${domain}`,
      ':sk': `Metrics@${year}`
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
      ':pk': `D@${domain}`,
      ':start': `Metrics@${start.toISOString().substring(0, 7)}`,
      ':end': `Metrics@${end.toISOString().substring(0, 7)}`
    }
  }),

  /**
   * Get para retornar uma métrica específica
   * @param domain Identificador do domínio
   * @param date Data do registro para retorno
   * @returns 
   */
  retrieveMetric: (domain: string, date: Date) => ({
    Pk: `D@${domain}`,
    Sk: `Metrics@${date.toISOString().substring(0, 7)}`
  }),

  /**
   * Put para registrar um domínio a um cliente
   * @param client Registro do cliente
   * @param domain Registro do domínio
   * @param table Nome da tabela no banco de dados
   * @returns 
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
   * @param domain Registro do domínio
   * @param type Tipo de registro de log
   * @param data Dados adicionais do registro de log
   * @param table Nome da tabela no banco de dados
   * @returns 
   */
  putMetric: (domain: DomainEntity, type: LogEntityKinds, data: Record<string, any>, table: string) => {
    const TransactItems: any = [
      {
        Put: {
          TableName: table,
          Item: createLog(domain.Sk.substring(2), type, new Date(), data)
        }
      },
      {
        Update: {
          TableName: table,
          Key: {
            Pk: domain.Sk,
            Sk: `Metrics@${(new Date()).toISOString().substring(0, 7)}`
          },
          UpdateExpression: 'ADD #prop :value',
          ExpressionAttributeNames: {
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
            Pk: domain.Sk,
            Sk: `Metrics@${(new Date()).toISOString().substring(0, 7)}`
          },
          UpdateExpression: 'SET #prop = list_append(:value, #prop)',
          ExpressionAttributeNames: {
            '#prop': `${type}.${data.page || data.event}`
          },
          ExpressionAttributeValues: {
            ':value': [(new Date()).toISOString()]
          }
        }
      })
    }

    return { TransactItems }
  }
}
