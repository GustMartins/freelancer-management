import { InvalidTokenError } from '../helpers/errors'
import { decodeToken, normalizeHeaders, sendError } from '../helpers/http'
import { ApplicationRequest } from '../interfaces/application.types'

/**
 * Middleware para verificação do token do usuário
 * @param request Objeto da requisição HTTP
 */
export async function auth (request: ApplicationRequest): Promise<any> {
  try {
    const headers = normalizeHeaders(request)

    if (!headers.authorization) {
      throw new InvalidTokenError('Cabeçalho de autenticação não encontrado.')
    }

    // @ts-ignore: Object is possibly 'null'.
    const token = headers!.authorization.replace(/^Bearer\s+/, '')

    const data = decodeToken(token)

    request.Auth = data
    request.Administrative = data.admin ? true : false
  } catch (error) {
    return sendError(error)
  }
}
