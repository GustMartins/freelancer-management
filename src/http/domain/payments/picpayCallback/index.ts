import { http } from '@architect/functions'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { picpay } from '@architect/shared/middlewares/picpay'
import { emitCheckPayment } from '@architect/shared/providers/events'
import {
  getPaymentByPI, updatePaymentAuthorizationId
} from '@architect/shared/repositories/admin'

import validator from './input'

export async function picpayCallbackHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.body)) {
      throw new PayloadError()
    }

    const { referenceId, authorizationId } = request.body

    const payment = await getPaymentByPI(referenceId)

    if (authorizationId) {
      payment.AuthorizationId = authorizationId
      await updatePaymentAuthorizationId(payment, authorizationId)
    }

    await emitCheckPayment({ payment })

    return send({
      status: 200
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(picpay, picpayCallbackHandler)
