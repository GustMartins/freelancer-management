import { http } from '@architect/functions'
import { send, sendError } from '@architect/shared/helpers/http'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { auth } from '@architect/shared/middlewares/auth'
import { client } from '@architect/shared/middlewares/client'
import { listDomains } from '@architect/shared/repositories/domains'

async function listDomainsHandler (request: ApplicationRequest): Promise<any> {
  try {
    const list = await listDomains(request.User!.Pk)

    return send({
      body: list.map(domain => ({
        id: domain.Sk.substring(2),
        url: domain.Website
      }))
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, client, listDomainsHandler)
