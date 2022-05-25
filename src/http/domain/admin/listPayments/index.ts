import { http } from '@architect/functions'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { admin } from '@architect/shared/middlewares/admin'
import { auth } from '@architect/shared/middlewares/auth'
import { listPayments } from '@architect/shared/repositories/admin'

import validator from './input'

async function listPaymentsHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.query)) {
      throw new PayloadError('Propriedades query incorretas.')
    }

    const { client, status } = request.query || {}

    const list = await listPayments(client, status)

    return send({
      body: list.map(payment => ({
        year: parseInt(payment.Sk.substring(4)),
        status: payment.StatusSk.split('#').shift(),
        value: payment.Value,
        client: {
          id: payment.Pk.substring(2),
          email: payment.Client
        }
      }))
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, admin, listPaymentsHandler)
