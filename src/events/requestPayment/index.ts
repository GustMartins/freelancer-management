import { endOfThisMonth } from '@architect/shared/helpers/dates'
import { snsMessage } from '@architect/shared/helpers/events'
import { decodeKey } from '@architect/shared/helpers/keys'
import { createPayment, createTax } from '@architect/shared/helpers/records'
import { preparePaymentNotification } from '@architect/shared/helpers/reports'
import { picpayId } from '@architect/shared/helpers/token'
import {
  NotificationTypes, RequestPaymentEvent
} from '@architect/shared/interfaces/application.types'
import {
  PaymentEntity, TaxEntity
} from '@architect/shared/interfaces/records.types'
import { emitNotifyTargets } from '@architect/shared/providers/events'
import { requestPicpayPayment } from '@architect/shared/providers/picpay'
import { putPayment } from '@architect/shared/repositories/admin'
import { listDomains } from '@architect/shared/repositories/domains'

export async function handler (event: any): Promise<any> {
  const { client, type, domain } = snsMessage<RequestPaymentEvent>(event)
  const clientEmail = client.Email
  const clientId = decodeKey(client.Pk).id

  let payment: PaymentEntity | TaxEntity

  if (type === 'Payment') {
    const domains = await listDomains(clientId)
    const totalValue = domains.reduce((total, item) => total + item.Value, 0)

    payment = createPayment(clientEmail, clientId, new Date().getFullYear(), new Date(), totalValue, domains.length)
  }
  else if (type === 'Tax') {
    payment = createTax(clientEmail, clientId, new Date(), client.Tax)
  }
  else if (type === 'Domain') {
    payment = createTax(clientEmail, clientId, new Date(), domain.Value)
  }

  const picpayPayment = await requestPicpayPayment({
    buyer: {
      document: client.Document,
      email: client.Email
    },
    value: payment.Value, // TODO: Formatar o valor para 0.00
    expiresAt: endOfThisMonth().toISOString(),
    referenceId: picpayId(),
    callbackUrl: process.env.PICPAY_CALLBACK_URL,
    returnUrl: process.env.PICPAY_RETURN_URL
  })

  // Preparar dados para enviar notificar
  payment.PI = picpayPayment.referenceId

  await putPayment(payment)
  const report = preparePaymentNotification(client, payment, picpayPayment, domain)

  // Disparar evento de notificação
  await emitNotifyTargets({
    type: NotificationTypes.RequestPayment,
    client,
    report
  })

  return
}
