import { HttpResponse } from '@architect/functions'

import { HttpStatusResponse } from '../interfaces/application.types'

/**
 * Classe base para os erros da API
 */
class BaseError extends Error {
  public name: string
  public status: HttpStatusResponse
  /**
   * Uma mensagem mais específica pode ser armazenada para ser retornada
   * ao cliente HTTP
   */
  public detail?: string

  constructor(message: string, status: HttpStatusResponse = HttpStatusResponse.BadRequest, detail?: string) {
    super(message)

    this.name = this.constructor.name
    this.status = status
    this.detail = detail
  }

  /**
   * Função para retorno do erro pela requisição HTTPS
   */
  toApi(): HttpResponse {
    return {
      statusCode: this.status,
      body: JSON.stringify({
        error: this.name,
        message: this.message,
        ...(this.detail && { detail: this.detail })
      })
    }
  }
}

/**
 * Error para token de autenticação inválido
 * Pode ser inválido por não possuir os dados necessários, por não processar, etc.
 */
export class InvalidTokenError extends BaseError {
  constructor(detail?: string) {
    super('Token de autenticação inválido', HttpStatusResponse.Unauthorized, detail)
  }
}
