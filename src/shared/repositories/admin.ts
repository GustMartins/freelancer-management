import { tables } from '@architect/functions'

import { EntityNotFound } from '../helpers/errors'
import { AdminEntity, RecordHashKey } from '../interfaces/records.types'

/**
 * Função para retornar o administrador do banco de dados
 * @param primaryKey Objeto da chave primária do administrador
 */
export async function getAdmin (primaryKey: RecordHashKey): Promise<AdminEntity> {
  const db = await tables()

  const record = await db.designers.get(primaryKey)

  if (!record) {
    throw new EntityNotFound()
  }

  return record
}
