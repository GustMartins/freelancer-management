import { tables } from '@architect/functions'

import access from '../helpers/access'
import { EntityNotFound } from '../helpers/errors'
import {
  ClientEntity, LoginEntity, RecordHashKey
} from '../interfaces/records.types'

/**
 * Função para retornar um cliente do banco de dados
 * @param primaryKey Objeto da chave primária do cliente
 */
 export async function getClient (primaryKey: RecordHashKey): Promise<ClientEntity> {
  const db = await tables()

  const record = await db.designers.get(primaryKey)

  if (!record) {
    throw new EntityNotFound()
  }

  return record
}

/**
 * Função para retornar um registro de login de um usuário do banco de dados
 * @param primaryKey Objeto da chave primária do registro de login
 */
export async function getLogin (primaryKey: RecordHashKey): Promise<LoginEntity> {
  const db = await tables()

  const record = await db.designers.get(primaryKey)

  if (!record) {
    throw new EntityNotFound()
  }

  return record
}

/**
 * Função para registrar um cliente no banco de dados
 * TODO: Deve criar o registro de login do usuário também
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
