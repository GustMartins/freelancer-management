import access from '@architect/shared/helpers/access'
import { snsMessage } from '@architect/shared/helpers/events'
import { prepareReportForClient } from '@architect/shared/helpers/reports'
import {
  NotificationTypes, ReportTargetEvent
} from '@architect/shared/interfaces/application.types'
import { emitNotifyTargets } from '@architect/shared/providers/events'
import { getClient } from '@architect/shared/repositories/clients'
import { getMetric } from '@architect/shared/repositories/domains'

export async function handler (event: any): Promise<any> {
  const { domain, months } = snsMessage<ReportTargetEvent>(event)

  const client = await getClient(access.retrieveClient(domain.Client))
  const metrics = await Promise.all(months.map(async month => {
    return getMetric(access.retrieveMetric(domain.Pk, new Date(month)))
  }))

  const report = prepareReportForClient(metrics)

  await emitNotifyTargets({
    type: NotificationTypes.ReportNotification,
    client,
    report
  })

  return
}
