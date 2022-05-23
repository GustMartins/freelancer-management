import 'dotenv/config'

import * as jwt from 'jsonwebtoken'

import { HttpRequest } from '@architect/functions'

import { InvalidTokenError } from '../errors'
import { decodeToken, normalizeHeaders, send, sendError } from '../http'
import { createToken } from '../token'

const baseHttpRequest: HttpRequest = {
  httpMethod: 'GET',
  path: '',
  resource: '',
  pathParameters: {},
  queryStringParameters: {},
  headers: {},
  body: '',
  isBase64Encoded: false
}

describe('shared/helpers/http funções com requisições de servidor', () => {
  describe('normalizeHeaders()', () => {
    it('deveria manter a quantidade de elementos no objeto', () => {
      const request = Object.assign({}, baseHttpRequest, {
        headers: {
          Authorization: 'Bearer foo',
          'Content-Type': 'text/plain'
        }
      })

      const result = normalizeHeaders(request)

      expect(Object.keys(result).length).toBe(2)
    })

    it('deveria deixar as propriedades em caixa baixa', () => {
      const request = Object.assign({}, baseHttpRequest, {
        headers: {
          Authorization: 'Bearer foo',
          'Content-Type': 'text/html'
        }
      })

      const result = normalizeHeaders(request)

      expect(result).toHaveProperty('authorization')
      expect(result).toHaveProperty('content-type')
    })
  })

  describe('decodeToken()', () => {
    it('deveria lançar um erro se um token incorreto for fornecido', () => {
      const result = () => decodeToken('Bearer foo')

      expect(result).toThrowError()
    })

    it('deveria decodificar um token corretamente', () => {
      const client = 'id-do-cliente'
      const token = createToken(client)

      const result = decodeToken(token)

      expect(result).toHaveProperty('client')
      expect(result.client).toBe(client)
    })

    it('deveria lançar um erro se não possuir as propriedades obrigatórias', () => {
      const exp = new Date()
      exp.setDate(new Date().getDate() + 1)
      const token = jwt.sign({
        domain: 'id-do-domain',
        sub: 'id-do-domain',
        iss: process.env.JWT_ISSUER,
        exp: exp.getTime() / 1000
      }, process.env.JWT_SECRET_KEY as string)

      const result = () => decodeToken(token)

      expect(result).toThrowError()
    })
  })

  describe('send()', () => {
    it('deveria retornar cabeçalhos', () => {
      const data = send()

      expect(data).toHaveProperty('headers')
    })

    it('deveria retornar o cabeçalho Application-Id', () => {
      const { headers } = send()

      expect(headers).toHaveProperty('Application-Id')
    })

    it('deveria retornar os cabeçalhos para cors', () => {
      const { headers } = send()

      expect(headers).toHaveProperty('Access-Control-Allow-Origin')
      expect(headers).toHaveProperty('Access-Control-Allow-Methods')
      expect(headers).toHaveProperty('Access-Control-Allow-Headers')
      expect(headers['Access-Control-Allow-Origin']).toBe('*')
      expect(headers['Access-Control-Allow-Methods']).toBe('*')
      expect(headers['Access-Control-Allow-Headers']).toBe('*')
    })

    it('deveria retornar o cabeçalho Content-Type apropriado', () => {
      const firstRes = send()
      const secondRes = send({ body: 'This is my body' })
      const thirdRes = send({ body: { message: 'This is my message' } })

      expect(firstRes.headers).not.toHaveProperty('Content-Type')
      expect(secondRes.headers).toHaveProperty('Content-Type')
      expect(secondRes.headers['Content-Type']).toBe('text/plain; charset=utf-8')
      expect(thirdRes.headers).toHaveProperty('Content-Type')
      expect(thirdRes.headers['Content-Type']).toBe('application/json')
    })

    it('deveria retornar o status de acordo com o conteúdo', () => {
      const firstRes = send()
      const secondRes = send({ body: 'hello world!' })

      expect(firstRes.statusCode).toBe(204)
      expect(secondRes.statusCode).toBe(200)
    })

    it('deveria retornar o status solicitado', () => {
      const firstRes = send({ status: 201 })
      const secondRes = send({ status: 400, body: 'hello world!' })

      expect(firstRes.statusCode).toBe(201)
      expect(secondRes.statusCode).toBe(400)
    })

    it('deveria retornar o cabeçalho HTTP WWW-Authenticate se possuir erro na solicitação', () => {
      const request = send({
        status: 401,
        error: true
      })

      expect(request.statusCode).toBe(401)
      expect(request.headers).toHaveProperty('WWW-Authenticate')
    })

    it('deveria transformar body em string para todos os casos', () => {
      const firstRes = send({ body: 'hello world!' })
      const secondRes = send({ body: { text: 'hello world!' } })

      expect(typeof firstRes.body).toBe('string')
      expect(typeof secondRes.body).toBe('string')
    })

    it('deveria retornar o cabeçalho Content-Location', () => {
      const { headers } = send({
        headers: {
          'Content-Location': '/me/target/location'
        }
      })

      expect(headers).toHaveProperty('Application-Id')
      expect(headers).toHaveProperty('Content-Location')
    })
  })

  describe('sendError()', () => {
    it('deveria responder com o status HTTP do erro corretamente', () => {
      const error = new InvalidTokenError()

      const result = sendError(error)

      expect(result.statusCode).toBe(401)
    })

    it('deveria responder com o status HTTP de erro genérico', () => {
      const error = new Error()

      const result = sendError(error)

      expect(result.statusCode).toBe(500)
    })
  })
})
