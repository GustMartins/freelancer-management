import { tables } from '@architect/functions'

import access from '../helpers/access'
import { EntityNotFound } from '../helpers/errors'
import {
  AdminEntity, PaymentEntity, PaymentEntityStatuses, RecordHashKey, TaxEntity
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
  const accessPattern: any = client
    ? access.listPaymentsByClient(client)
    : status
      ? access.listPaymentsByStatus(status)
      : access.listPayments()
  const payments: PaymentEntity[] = []

  let list = await db.designers.query(accessPattern)

  if (list.Count > 0) {
    payments.push(...list.Items)
  }

  if (list.LastEvaluatedKey) {
    while (list.LastEvaluatedKey) {
      accessPattern.ExclusiveStartKey = list.LastEvaluatedKey
      list = await db.lit.query(accessPattern)

      /* istanbul ignore else */
      if (list.Count > 0) {
        payments.push(...list.Items)
      }
    }
  }

  return payments
}

/**
 * Função para retornar uma lista de pagamentos já criados junto ao PicPay mas
 * atualmente em atraso de pagamento
 * @param status Status de pagamento para consulta
 */
export async function listPicPayPaymentsByStatus (status: PaymentEntityStatuses): Promise<PaymentEntity[]> {
  const db = await tables()
  const accessPattern: any = access.listPicpayPayments(status)
  const payments: PaymentEntity[] = []

  let list = await db.designers.query(accessPattern)

  if (list.Count > 0) {
    payments.push(...list.Items)
  }

  if (list.LastEvaluatedKey) {
    while (list.LastEvaluatedKey) {
      accessPattern.ExclusiveStartKey = list.LastEvaluatedKey
      list = await db.lit.query(accessPattern)

      /* istanbul ignore else */
      if (list.Count > 0) {
        payments.push(...list.Items)
      }
    }
  }

  return payments
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

/**
 * Função para atualizar o status de um pagamento
 * @param payment Dados do pagamento
 * @param status Status para atualizar
 */
export async function updatePaymentStatus (payment: PaymentEntity, status: PaymentEntityStatuses): Promise<void> {
  const db = await tables()
  await db.designers.update({
    Key: {
      Pk: payment.Pk,
      Sk: payment.Sk
    },
    UpdateExpression: 'SET StatusSk = :st',
    ExpressionAttributeValues: {
      ':st': `${status}#${new Date().toISOString()}`
    }
  })
}

/**
 * Função para registrar um pagamento no banco de dados
 * @param payment Dados do pagamento
 */
export async function putPayment (payment: PaymentEntity | TaxEntity): Promise<void> {
  const db = await tables()
  await db.designers.put(payment)
}
