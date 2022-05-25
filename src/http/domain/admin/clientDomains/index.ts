import { http } from '@architect/functions'
import { send, sendError } from '@architect/shared/helpers/http'
import { decodeKey } from '@architect/shared/helpers/keys'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { admin } from '@architect/shared/middlewares/admin'
import { auth } from '@architect/shared/middlewares/auth'
import { listDomains } from '@architect/shared/repositories/domains'

async function clientDomainsHandler (request: ApplicationRequest): Promise<any> {
  try {
    const list = await listDomains(request.pathParameters.client)

    return send({
      body: list.map(domain => ({
        id: decodeKey(domain.Sk).id,
        url: domain.Website
      }))
    })
  } catch (error) {
    sendError(error)
  }
}

export const handler = http.async(auth, admin, clientDomainsHandler)
