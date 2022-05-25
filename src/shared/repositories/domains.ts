import { tables } from '@architect/functions'

import access from '../helpers/access'
import {
  ClientEntity, DomainEntity, MetricEntity
} from '../interfaces/records.types'

/**
 * Função para salvar um domínio de um cliente no banco de dados
 * @param client Dados do cliente
 * @param domain Dados do domínio
 */
export async function putDomain (client: ClientEntity, domain: DomainEntity): Promise<void> {
  const db = await tables()
  const table = db.name('designers')

  // @ts-ignore
  await db._doc.transactWrite(access.putDomain(client, domain, table)).promise()
}

/**
 * Função para retornar a lista de domínios
 * @param client Identificador de cliente para filtro
 */
export async function listDomains (client?: string): Promise<DomainEntity[]> {
  const db = await tables()

  const list = client
    ? await db.designers.query(access.listDomainsByClient(client))
    : await db.designers.query(access.listDomains())

  return list.Items
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
