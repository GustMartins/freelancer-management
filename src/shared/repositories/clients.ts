import { tables } from '@architect/functions'

import access from '../helpers/access'
import { ClientEntity } from '../interfaces/records.types'

/**
 * Função para registrar um cliente no banco de dados
 * @param client Dados do novo cliente
 */
export async function putClient (client: ClientEntity): Promise<void> {
  const db = await tables()
  await db.designers.put(client)
}

/**
 * Função para retornar a lista de clientes
 */
export async function listClients (): Promise<ClientEntity[]> {
  const db = await tables()

  const list = await db.designers.query(access.listClients())

  return list.Items
}
