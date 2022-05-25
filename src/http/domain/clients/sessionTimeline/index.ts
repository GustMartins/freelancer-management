import { http } from '@architect/functions'
import { send, sendError } from '@architect/shared/helpers/http'
import { decodeKey } from '@architect/shared/helpers/keys'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { auth } from '@architect/shared/middlewares/auth'
import { client } from '@architect/shared/middlewares/client'
import { listSession } from '@architect/shared/repositories/domains'

async function sessionTimelineHandler (request: ApplicationRequest): Promise<any> {
  try {
    const list = await listSession(request.pathParameters.id)

    return send({
      body: {
        domain: decodeKey(list[0].Pk).id,
        timeline: list.sort((a, b) => a.Content.time - b.Content.time).map(event => ({
          type: event.Kind.toLowerCase(),
          ...event.Content
        }))
      }
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, client, sessionTimelineHandler)
