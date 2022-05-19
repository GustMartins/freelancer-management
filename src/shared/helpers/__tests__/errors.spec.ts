import { InvalidTokenError } from '../errors'

describe('shared/helpers/errors classes para tratamento de erros', () => {
  describe('Classe InvalidTokenError', () => {
    it('deveria instanciar corretamente', () => {
      const error = new InvalidTokenError()

      expect(error.name).toBe('InvalidTokenError')
    })

    it('deveria retornar uma resposta HTTP corretamente', () => {
      const error = new InvalidTokenError()
      const data = error.toApi()

      expect(data.statusCode || data.status).toBe(401)
    })

    it('deveria aceitar uma string com informações adicionais', () => {
      const error = new InvalidTokenError('Informação adicional')
      const data = error.toApi()

      expect(error.detail).toBe('Informação adicional')
    })
  })
})
