import { InvalidTokenError } from '../helpers/errors'
import { normalizeHeaders, sendError } from '../helpers/http'
import { ApplicationRequest } from '../interfaces/application.types'

export async function picpay (request: ApplicationRequest): Promise<any> {
  try {
    const headers = normalizeHeaders(request)

    if (!headers['x-seller-token']) {
      throw new InvalidTokenError()
    }

    if (headers['x-seller-token'] !== process.env.PICPAY_SELLER_TOKEN) {
      throw new InvalidTokenError(
        'Verifique se o token está bem formado e é um token válido'
      )
    }
  } catch (error) {
    return sendError(error)
  }
}
