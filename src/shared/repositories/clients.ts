import { tables } from '@architect/functions'

import { ClientEntity } from '../interfaces/records.types'

/**
 * Função para registrar um cliente no banco de dados
 * @param client Dados do novo cliente
 */
export async function putClient (client: ClientEntity): Promise<void> {
  const db = await tables()
  await db.designers.put(client)
}
