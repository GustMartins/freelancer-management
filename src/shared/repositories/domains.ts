import { tables } from '@architect/functions'

import access from '../helpers/access'
import { EntityNotFound } from '../helpers/errors'
import { createMetric } from '../helpers/records'
import {
  ClientEntity, DomainEntity, LogEntity, MetricEntity, RecordHashKey
} from '../interfaces/records.types'

/**
 * Função para retornar uma métrica específica de um domínio do banco de dados
 * @param primaryKey Objeto da chave primária da métrica
 * @returns
 */
export async function getMetric (primaryKey: RecordHashKey): Promise<MetricEntity> {
  const db = await tables()

  const record = await db.designers.get(primaryKey)

  if (!record) {
    throw new EntityNotFound()
  }

  return record
}

/**
 * Função para salvar um domínio de um cliente no banco de dados
 * @param client Dados do cliente
 * @param domain Dados do domínio
 */
export async function putDomain (client: ClientEntity, domain: DomainEntity): Promise<void> {
  const db = await tables()
  const table = db.name('designers')

  if (process.env.ARC_ENV !== 'production') {
    await db.designers.put(domain)
    await db.designers.put(createMetric(domain.Sk.substring(2), new Date()))
    await db.designers.update({
      Key: {
        Pk: client.Pk,
        Sk: client.Sk
      },
      UpdateExpression: 'ADD DomainCount 1',
      ExpressionAttributeValues: {
        ':value': 1
      }
    })
  } else {
    // @ts-ignore
    await db._doc.transactWrite(access.putDomain(client, domain, table)).promise()
  }
}

/**
 * Função para salvar um registro de métrica de domínio no banco de dados
 * @param metric Dados da métrica
 */
export async function putMetric (metric: MetricEntity): Promise<void> {
  const db = await tables()
  await db.designers.put(metric)
}

/**
 * Função para retornar a lista de domínios
 * @param client Identificador de cliente para filtro
 */
export async function listDomains (client?: string): Promise<DomainEntity[]> {
  const db = await tables()
  const accessPattern: any = client ? access.listDomainsByClient(client) : access.listDomains()
  const domains: DomainEntity[] = []

  let list = await db.designers.query(accessPattern)

  if (list.Count > 0) {
    domains.push(...list.Items)
  }

  if (list.LastEvaluatedKey) {
    while (list.LastEvaluatedKey) {
      accessPattern.ExclusiveStartKey = list.LastEvaluatedKey
      list = await db.lit.query(accessPattern)

      /* istanbul ignore else */
      if (list.Count > 0) {
        domains.push(...list.Items)
      }
    }
  }

  return domains
}

/**
 * Função para retornar uma lista de dados analíticos de um domínio
 * @param domain Identificador do domínio
 * @param year Ano para filtro
 * @param start Data inicial para filtro
 * @param end Data final para filtro
 */
export async function listAnalytics (domain: string, year?: number, start?: Date, end?: Date): Promise<MetricEntity[]> {
  const db = await tables()

  const list = year
    ? await db.designers.query(access.listDomainMetricsByYear(domain, year))
    : start
      ? await db.designers.query(access.listDomainMetricsByPeriod(domain, start, end))
      : await db.designers.query(access.listDomainMetrics(domain))

  return list.Items
}

/**
 * Função para retornar uma lista de eventos de uma sessão
 * @param session Identificador da sessão
 */
export async function listSession (session: string) : Promise<LogEntity[]> {
  const db = await tables()

  const list = await db.designers.query(access.listSessionActivity(session))

  return list.Items
}
