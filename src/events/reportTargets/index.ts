import { snsMessage } from '@architect/shared/helpers/events'
import {
  ReportTargetEvent
} from '@architect/shared/interfaces/application.types'

export async function handler (event: any): Promise<any> {
  const message = snsMessage<ReportTargetEvent>(event)
  return
}
