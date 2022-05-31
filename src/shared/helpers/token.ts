import { Buffer } from 'buffer'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

import { ApplicationWebToken } from '../interfaces/application.types'

const KSUID = require('ksuid')

/**
 * Tempo em minutos para a validade do token de acesso administrativo
 */
const ADMIN_TOKEN_VALID_MINUTES = 15

/**
 * Tempo em dias para a validade do token de acesso dos clientes
*/
const TOKEN_VALID_DAYS = 15

/**
 * Função para gerar um identificador único para entidades
 * @param date Data para referência na criação do token
 * @returns Identificador gerado
 */
export const entityId = (date?: Date): string => KSUID
  .fromParts((date || new Date()).getTime(), crypto.randomBytes(16))
  .string

/**
 * Função para gerar um identificador de pagamento para ser utilizado nas
 * cobranças junto ao PicPay
 * TODO: Projetar e desenvolver a função picpayId()
 */
export const picpayId = (): string => {
  return 'picpay-id-based-on-time'
}

/**
 * Função para gerar um token de acesso para requisições HTTP privadas
 * @param client Dados para compor a carga do token
 * @returns Token gerado
*/
export const createToken = (client: string, admin: boolean = false): string => {
  const exp = new Date()
  admin && exp.setMinutes(new Date().getMinutes() + ADMIN_TOKEN_VALID_MINUTES)
  !admin && exp.setDate(new Date().getDate() + TOKEN_VALID_DAYS)

  return jwt.sign({
    client,
    ...(admin && { admin }),
    sub: client,
    iss: process.env.JWT_ISSUER,
    exp: exp.getTime() / 1000
  }, process.env.JWT_SECRET_KEY as string)
}

/**
 * Função para analisar um token de autenticação e retornar seus dados
 * @param token Token de autenticação
 */
export const parseToken = (token: string): ApplicationWebToken => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY) as ApplicationWebToken
    return data
  } catch(error) {
    return null
  }
}

/**
 * Função para codificar a propriedade LastEvaluation nas requisições ao banco
 * de dados DynamoDB.
 * @param data Dados para codificar
 * @returns Token gerado
*/
export const encodeLastEvaluation = (data: object): string =>
  Buffer.from(JSON.stringify(data), 'utf-8').toString('base64')

/**
 * Função para decodificar um token retornado pela função encodeLastEvaluation()
 * @param encoded Token retornado pela função encodeLastEvaluation()
 * @returns Dados decodificados
*/
export const decodeLastEvaluation = (encoded: string): object =>
  JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'))
