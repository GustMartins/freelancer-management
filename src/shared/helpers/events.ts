
interface EventSnsMessage {
  Sns: {
    Message: string
  }
}

interface EventPayload {
  Records: EventSnsMessage[]
}

export function snsMessage<T>(event: EventPayload): T {
  return JSON.parse(event.Records[0].Sns.Message)
}
