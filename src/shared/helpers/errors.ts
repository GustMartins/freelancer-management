import {
  ApplicationResponse, HttpStatusResponse
} from '../interfaces/application.types'

/**
 * Classe base para os erros da API
 */
export class BaseError extends Error {
  public name: string
  public status: HttpStatusResponse
  /**
   * Uma mensagem mais específica pode ser armazenada para ser retornada
   * ao cliente HTTP
   */
  public detail?: string

  constructor(message: string, status: HttpStatusResponse, detail?: string) {
    super(message)

    this.name = this.constructor.name
    this.status = status
    this.detail = detail
  }

  /**
   * Função para retorno do erro pela requisição HTTPS
   */
  toApi(): ApplicationResponse {
    return {
      status: this.status,
      body: JSON.stringify({
        error: this.name,
        message: this.message,
        ...(this.detail && { detail: this.detail })
      })
    }
  }
}

/**
 * Erro inesperado ou interno aos códigos
 */
export class UnknownError extends BaseError {
  constructor(detail?: string) {
    super('Um erro desconhecido aconteceu', HttpStatusResponse.InternalServerlessError, detail)
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

/**
 * Error para corpo de requisição com dados inválidos
 */
export class PayloadError extends BaseError {
  constructor(detail?: string) {
    super('Dados da requisição inválidos', HttpStatusResponse.BadRequest, detail)
  }
}

/**
 * Error para entidade não encontrada
 */
export class EntityNotFound extends BaseError {
  constructor(detail?: string) {
    super('Entidade não encontrada', HttpStatusResponse.NotFound, detail)
  }
}

/**
 * Error para usuário sem permissão de acesso
 */
export class ForbiddenError extends BaseError {
  constructor(detail?: string) {
    super('Usuário sem permissão', HttpStatusResponse.Forbidden, detail)
  }
}
