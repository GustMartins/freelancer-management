import access from '@architect/shared/helpers/access'
import { nextNWeeks } from '@architect/shared/helpers/dates'
import { snsMessage } from '@architect/shared/helpers/events'
import {
  prepareNonPayingNotification, preparePaymentNotification
} from '@architect/shared/helpers/reports'
import { picpayId } from '@architect/shared/helpers/token'
import {
  ArrearsInPaymentEvent, NotificationTypes
} from '@architect/shared/interfaces/application.types'
import { emitNotifyTargets } from '@architect/shared/providers/events'
import { requestPicpayPayment } from '@architect/shared/providers/picpay'
import { updateLatePayment } from '@architect/shared/repositories/admin'
import { getClient } from '@architect/shared/repositories/clients'

export async function handler (event: any): Promise<any> {
  const { payment } = snsMessage<ArrearsInPaymentEvent>(event)
  const client = await getClient(access.retrieveClient(payment.Pk))

  if (payment.RetryCount <= 6) {
    const picpayPayment = await requestPicpayPayment({
      buyer: {
        document: client.Document,
        email: client.Email
      },
      value: payment.Value, // TODO: Formatar o valor para 0.00
      expiresAt: nextNWeeks(2).toISOString(),
      referenceId: picpayId(),
      callbackUrl: process.env.PICPAY_CALLBACK_URL,
      returnUrl: process.env.PICPAY_RETURN_URL
    })

    // Preparar dados para enviar notificar
    await updateLatePayment(payment, picpayPayment.referenceId)

    payment.PI = picpayPayment.referenceId
    payment.RetryCount += 1
    payment.StatusSk = `created#${new Date().toISOString()}`

    const report = preparePaymentNotification(client, payment, picpayPayment)

    // Disparar evento de notificação
    await emitNotifyTargets({
      type: NotificationTypes.RequestPayment,
      client,
      report
    })
  } else {
    const report = prepareNonPayingNotification(client)

    // Disparar evento de notificação
    await emitNotifyTargets({
      type: NotificationTypes.RequestPayment,
      client,
      report
    })
  }

  return
}
