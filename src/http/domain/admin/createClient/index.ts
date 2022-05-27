import bcrypt from 'bcryptjs'

import { http } from '@architect/functions'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import { createClient } from '@architect/shared/helpers/records'
import { entityId } from '@architect/shared/helpers/token'
import {
  ApplicationRequest, HttpStatusResponse
} from '@architect/shared/interfaces/application.types'
import { admin } from '@architect/shared/middlewares/admin'
import { auth } from '@architect/shared/middlewares/auth'
import { emitWelcomeClient } from '@architect/shared/providers/events'
import { putClient } from '@architect/shared/repositories/clients'

import validator from './input'

async function createClientHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.body)) {
      throw new PayloadError()
    }

    const { email, document, password, invoice } = request.body

    const id = entityId()
    const client = createClient(id, email, document, bcrypt.hashSync(password))

    if (invoice) {
      client.InvoiceAt = invoice
    }

    await putClient(client)
    await emitWelcomeClient({ client })

    return send({
      status: HttpStatusResponse.Created
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, admin, createClientHandler)
