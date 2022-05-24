import { http } from '@architect/functions'
import { send, sendError } from '@architect/shared/helpers/http'
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
        id: domain.Sk.substring(2),
        url: domain.Website
      }))
    })
  } catch (error) {
    sendError(error)
  }
}

export const handler = http.async(auth, admin, clientDomainsHandler)
