import { tables } from '@architect/functions'

import access from '../helpers/access'
import { EntityNotFound } from '../helpers/errors'
import {
  AdminEntity, PaymentEntity, PaymentEntityStatuses, RecordHashKey
} from '../interfaces/records.types'

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

/**
 * Função para retornar um pagamento pelo seu identificador único
 * @param id Identificador único do pagamento
 * @returns
 */
export async function getPaymentByPI (id: string): Promise<PaymentEntity> {
  const db = await tables()

  const list = await db.designers.query(access.queryPaymentById(id))

  if (list.Count > 0) {
    return list.Items[0]
  }

  throw new EntityNotFound()
}

/**
 * Função para retornar uma lista de pagamentos
 * @param client Identificador do cliente para filtro
 * @param status Status para filtro
 * @returns
 */
export async function listPayments (client?: string, status?: PaymentEntityStatuses): Promise<PaymentEntity[]> {
  const db = await tables()

  const list = client
    ? await db.designers.query(access.listPaymentsByClient(client))
    : status
      ? await db.designers.query(access.listPaymentsByStatus(status))
      :  await db.designers.query(access.listPayments())

  return list.Items
}

/**
 * Função para atualizar a propriedade AuthorizationId de um documento
 * @param payment Dados do pagamento
 * @param id Identificador da propriedade authorizationId do PicPay
 */
export async function updatePaymentAuthorizationId (payment: PaymentEntity, id: string): Promise<void> {
  const db = await tables()
  await db.designers.update({
    Key: {
      Pk: payment.Pk,
      Sk: payment.Sk
    },
    UpdateExpression: 'SET AuthorizationId = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  })
}
