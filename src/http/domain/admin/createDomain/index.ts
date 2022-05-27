import { http } from '@architect/functions'
import access from '@architect/shared/helpers/access'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import { createDomain } from '@architect/shared/helpers/records'
import { entityId } from '@architect/shared/helpers/token'
import {
  ApplicationRequest, HttpStatusResponse
} from '@architect/shared/interfaces/application.types'
import { admin } from '@architect/shared/middlewares/admin'
import { auth } from '@architect/shared/middlewares/auth'
import { emitDomainCreated } from '@architect/shared/providers/events'
import { getClient } from '@architect/shared/repositories/clients'
import { putDomain } from '@architect/shared/repositories/domains'

import validator from './input'

async function createDomainHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.body)) {
      throw new PayloadError()
    }

    const { domain, value } = request.body

    const id = entityId()
    const client = await getClient(access.retrieveClient(request.pathParameters.client))
    const theDomain = createDomain(client, id, domain, value)

    await putDomain(client, theDomain)
    await emitDomainCreated({ client, domain: theDomain })

    return send({
      status: HttpStatusResponse.Created
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, admin, createDomainHandler)
