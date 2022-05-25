import { http } from '@architect/functions'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import { decodeKey } from '@architect/shared/helpers/keys'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { auth } from '@architect/shared/middlewares/auth'
import { client } from '@architect/shared/middlewares/client'
import { listAnalytics } from '@architect/shared/repositories/domains'

import validator from './input'

async function appAnalyticsHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.query)) {
      throw new PayloadError('Propriedades query incorretas.')
    }

    const { year, start, end } = request.query || {}

    const list = year
      ? await listAnalytics(request.pathParameters.app, parseInt(year))
      : start && end
        ? await listAnalytics(request.pathParameters.app, parseInt(year), new Date(start), new Date(end))
        : await listAnalytics(request.pathParameters.app)

    return send({
      body: list.map(metric => ({
        period: decodeKey(metric.Sk).id,
        data: metric.Content
      }))
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(auth, client, appAnalyticsHandler)
