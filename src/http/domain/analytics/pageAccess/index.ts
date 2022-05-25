import { http } from '@architect/functions'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import { domainPrimaryKey } from '@architect/shared/helpers/keys'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { putAnalytics } from '@architect/shared/repositories/analytics'

import validator from './input'

export async function pageAccessHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.query)) {
      throw new PayloadError('Propriedades query incorretas.')
    }

    const date = new Date()
    const id = request.query.s
    const app = domainPrimaryKey(request.pathParameters.app)

    await putAnalytics(id, app, 'Pages', {
      time: date.getTime(),
      page: request.pathParameters.proxy
    })

    return send()
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(pageAccessHandler)
