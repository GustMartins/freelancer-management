import { http } from '@architect/functions'
import { send, sendError } from '@architect/shared/helpers/http'
import { domainPrimaryKey } from '@architect/shared/helpers/keys'
import { entityId } from '@architect/shared/helpers/token'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { putAnalytics } from '@architect/shared/repositories/analytics'

export async function loginAdmin (request: ApplicationRequest): Promise<any> {
  try {
    const date = new Date()
    const id = entityId(date)
    const app = domainPrimaryKey(request.pathParameters.app)

    await putAnalytics(id, app, 'Sessions', {
      time: date.getTime(),
    })

    return send({
      body: {
        id
      }
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(loginAdmin)
