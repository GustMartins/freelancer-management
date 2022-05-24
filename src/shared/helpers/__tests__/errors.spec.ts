import { ForbiddenError, InvalidTokenError, PayloadError } from '../errors'

describe('shared/helpers/errors classes para tratamento de erros', () => {
  describe('Classe InvalidTokenError', () => {
    it('deveria instanciar corretamente', () => {
      const error = new InvalidTokenError()

      expect(error.name).toBe('InvalidTokenError')
    })

    it('deveria retornar uma resposta HTTP corretamente', () => {
      const error = new InvalidTokenError()
      const data = error.toApi()

      expect(data.status).toBe(401)
    })

    it('deveria aceitar uma string com informações adicionais', () => {
      const error = new InvalidTokenError('Informação adicional')

      expect(error.detail).toBe('Informação adicional')
    })
  })

  describe('Classe PayloadError', () => {
    it('deveria instanciar corretamente', () => {
      const error = new PayloadError()

      expect(error.name).toBe('PayloadError')
    })

    it('deveria retornar uma resposta HTTP corretamente', () => {
      const error = new PayloadError()
      const data = error.toApi()

      expect(data.status).toBe(400)
    })

    it('deveria aceitar uma string com informações adicionais', () => {
      const error = new PayloadError('Informação adicional')
      const data = error.toApi()
      const body = JSON.parse(data!.body as string)

      expect(error.detail).toBe('Informação adicional')
      expect(body.detail).toBe('Informação adicional')
    })
  })

  describe('Classe ForbiddenError', () => {
    it('deveria instanciar corretamente', () => {
      const error = new ForbiddenError()

      expect(error.name).toBe('ForbiddenError')
    })

    it('deveria retornar uma resposta HTTP corretamente', () => {
      const error = new ForbiddenError()
      const data = error.toApi()

      expect(data.status).toBe(403)
    })

    it('deveria aceitar uma string com informações adicionais', () => {
      const error = new ForbiddenError('Informação adicional')
      const data = error.toApi()
      const body = JSON.parse(data!.body as string)

      expect(error.detail).toBe('Informação adicional')
      expect(body.detail).toBe('Informação adicional')
    })
  })
})
