import { http } from '@architect/functions'
import { send, sendError } from '@architect/shared/helpers/http'
import { decodeKey } from '@architect/shared/helpers/keys'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { admin } from '@architect/shared/middlewares/admin'
import { auth } from '@architect/shared/middlewares/auth'
import { listClients } from '@architect/shared/repositories/clients'

async function listClientsHandler (request: ApplicationRequest): Promise<any> {
  try {
    const list = await listClients()

    return send({
      body: list.map(item => ({
        id: decodeKey(item.Pk).id,
        email: item.Email,
        domains: item.DomainCount,
        billing: item.InvoiceAt
      }))
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, admin, listClientsHandler)
