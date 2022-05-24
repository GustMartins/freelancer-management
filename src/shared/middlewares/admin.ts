import { ForbiddenError } from '../helpers/errors'
import { sendError } from '../helpers/http'
import { ApplicationRequest } from '../interfaces/application.types'

/**
 * Middleware para verificação do token do usuário
 * @param request Objeto da requisição HTTP
 */
export async function admin (request: ApplicationRequest): Promise<any> {
  try {
    if (!request.Administrative) {
      throw new ForbiddenError('Apenas acesso administrativo neste recurso.')
    }
  } catch (error) {
    return sendError(error)
  }
}
