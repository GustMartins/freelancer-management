import { snsMessage } from '@architect/shared/helpers/events'
import {
  CheckPaymentEvent
} from '@architect/shared/interfaces/application.types'
import { requestPicpayStatus } from '@architect/shared/providers/picpay'
import {
  updatePaymentAuthorizationId, updatePaymentStatus
} from '@architect/shared/repositories/admin'

export async function handler (event: any): Promise<any> {
  const { payment } = snsMessage<CheckPaymentEvent>(event)

  if (payment.PI) {
    const picpayResponse = await requestPicpayStatus(payment.PI)

    if (picpayResponse.authorizationId) {
      await updatePaymentAuthorizationId(payment, picpayResponse.authorizationId)
    }

    await updatePaymentStatus(payment, picpayResponse.status)
  }

  return
}
