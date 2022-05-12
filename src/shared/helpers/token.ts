import { Buffer } from 'buffer'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

const KSUID = require('ksuid')

/** 
 * Tempo em dias para a validade do token de acesso
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
 * Função para gerar um token de acesso para requisições HTTP privadas
 * @param email Dados para compor a carga do token
 * @returns Token gerado
*/
export const jwtToken = (email: string): string => {
  const exp = new Date()
  exp.setDate(new Date().getDate() + TOKEN_VALID_DAYS)

  return jwt.sign({
    email,
    exp: exp.getTime() / 1000
  }, process.env.JWT_SECRET_KEY as string)
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
