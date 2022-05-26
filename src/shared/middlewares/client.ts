import access from '../helpers/access'
import { sendError } from '../helpers/http'
import { ApplicationRequest } from '../interfaces/application.types'
import { getClient } from '../repositories/clients'

/**
 * Middleware para verificação do do usuário autenticado
 * @param request Objeto da requisição HTTP
 */
export async function client (request: ApplicationRequest): Promise<any> {
  try {
    const client = await getClient(access.retrieveClient(request.Auth.client))

    request.User = client
  } catch (error) {
    return sendError(error)
  }
}
