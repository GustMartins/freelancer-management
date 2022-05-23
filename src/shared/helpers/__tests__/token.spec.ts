import 'dotenv/config'

import {
  createToken, decodeLastEvaluation, encodeLastEvaluation, entityId, parseToken
} from '../token'

describe('shared/helpers/token funções tokens e identificadores', () => {
  describe('entityId()', () => {
    it('deveria gerar um identificador sem informar uma data', () => {
      const id = entityId()

      expect(typeof id).toBe('string')
    })

    it('deveria gerar um identificador informando uma data', () => {
      const date = new Date(2022, 3, 30)
      const id = entityId(date)

      expect(typeof id).toBe('string')
    })
  })

  describe('createToken()', () => {
    it('deveria gerar um token de acesso corretamente', () => {
      const client = 'id-do-cliente'

      const token = createToken(client)

      expect(typeof token).toBe('string')
    })

    it('deveria gerar um token administrativo de acesso corretamente', () => {
      const client = 'id-do-cliente'

      const token = createToken(client, true)

      expect(typeof token).toBe('string')
    })
  })

  describe('parseToken()', () => {
    it('deveria decodificar um token corretamente', () => {
      const client = 'id-do-cliente'
      const token = createToken(client)

      const result = parseToken(token)

      expect(result).toHaveProperty('client')
      expect(result).toHaveProperty('sub')
      expect(result).toHaveProperty('iss')
      expect(result).toHaveProperty('exp')
      expect(result).toHaveProperty('iat')
      expect(result.client).toBe(client)
      expect(result.sub).toBe(result.client)
    })

    it('deveria decodificar um token administrativo corretamente', () => {
      const client = 'id-do-cliente'
      const token = createToken(client, true)

      const result = parseToken(token)

      expect(result).toHaveProperty('client')
      expect(result).toHaveProperty('sub')
      expect(result).toHaveProperty('iss')
      expect(result).toHaveProperty('exp')
      expect(result).toHaveProperty('iat')
      expect(result.client).toBe(client)
      expect(result).toHaveProperty('admin')
      expect(result.sub).toBe(result.client)
    })

    it('deveria retornar null em tokens inválidos', () => {
      const result = parseToken('')

      expect(result).toBeNull()
    })
  })

  describe('encodeLastEvaluation()', () => {
    it('deveria retornar uma string codificada corretamente', () => {
      const result = encodeLastEvaluation({ ok: true })

      expect(typeof result).toBe('string')
    })
  })

  describe('decodeLastEvaluation()', () => {
    const data = {
      dados: 'aqui',
      ok: true
    }
    const encoded = encodeLastEvaluation(data)

    const result = decodeLastEvaluation(encoded)

    expect(result).toMatchObject(data)
  })
})
