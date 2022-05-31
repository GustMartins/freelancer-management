import { snsMessage } from '@architect/shared/helpers/events'
import { prepareDomainNotification } from '@architect/shared/helpers/reports'
import {
  DomainCreatedEvent, NotificationTypes
} from '@architect/shared/interfaces/application.types'
import {
  emitNotifyTargets, emitRequestPayment
} from '@architect/shared/providers/events'

export async function handler (event: any): Promise<any> {
  const { client, domain } = snsMessage<DomainCreatedEvent>(event)

  const report = prepareDomainNotification(client, domain)

  await emitNotifyTargets({
    type: NotificationTypes.DomainCreated,
    client,
    domain,
    report
  })

  // Realizar a cobrança do primeiro ano
  await emitRequestPayment({ client, domain, type: 'Domain' })

  return
}
