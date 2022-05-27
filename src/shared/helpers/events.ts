import { EventPayload } from '../interfaces/application.types'

export function snsMessage<T>(event: EventPayload): T {
  return JSON.parse(event.Records[0].Sns.Message)
}
