import { tables } from '@architect/functions'

import access from '../helpers/access'
import { EntityNotFound } from '../helpers/errors'
import { createLogin } from '../helpers/records'
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
 * @param client Dados do novo cliente
 */
export async function putClient (client: ClientEntity): Promise<void> {
  const db = await tables()
  const table = db.name('designers')

  if (process.env.ARC_ENV !== 'production') {
    await db.designers.put(client)
    await db.designers.put(createLogin(client))
  } else {
    // @ts-ignore
    await db._doc.transactWrite(access.putClient(client, table)).promise()
  }
}

/**
 * Função para retornar a lista de clientes
 */
export async function listClients (): Promise<ClientEntity[]> {
  const db = await tables()

  const list = await db.designers.query(access.listClients())

  return list.Items
}

/**
 * Função para retornar a lista de clientes que serão cobrados no mês atual
 */
export async function listClientsToInvoice (): Promise<ClientEntity[]> {
  const db = await tables()
  const accessPattern: any = access.listClientsToInvoice(new Date().getMonth())
  const clients: ClientEntity[] = []

  let list = await db.designers.query(accessPattern)

  if (list.Count > 0) {
    clients.push(...list.Items)
  }

  if (list.LastEvaluatedKey) {
    while (list.LastEvaluatedKey) {
      accessPattern.ExclusiveStartKey = list.LastEvaluatedKey
      list = await db.lit.query(accessPattern)

      /* istanbul ignore else */
      if (list.Count > 0) {
        clients.push(...list.Items)
      }
    }
  }

  return clients
}
