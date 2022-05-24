import { tables } from '@architect/functions'

import access from '../helpers/access'
import { ClientEntity, DomainEntity } from '../interfaces/records.types'

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
