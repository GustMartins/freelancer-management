import { snsMessage } from '@architect/shared/helpers/events'
import { prepareWelcomeNotification } from '@architect/shared/helpers/reports'
import {
  NotificationTypes, WelcomeClientEvent
} from '@architect/shared/interfaces/application.types'
import {
  emitNotifyTargets, emitRequestPayment
} from '@architect/shared/providers/events'

export async function handler (event: any): Promise<any> {
  const { client } = snsMessage<WelcomeClientEvent>(event)

  // Enviar e-mail de boas vindas
  const report = prepareWelcomeNotification(client)

  await emitNotifyTargets({
    type: NotificationTypes.WelcomeClient,
    client,
    report
  })

  // Realizar a cobrança do desenvolvimento
  await emitRequestPayment({ client, type: 'Tax' })

  return
}
