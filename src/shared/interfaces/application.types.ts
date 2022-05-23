import { HttpRequest } from '@architect/functions'

export enum HttpStatusResponse {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerlessError = 500
}

export interface HttpCustomHeaders {
  'Application-Id': string
  'Access-Control-Allow-Origin': string,
  'Access-Control-Allow-Methods': string,
  'Access-Control-Allow-Headers': string,
  'Content-Type': string
  'WWW-Authenticate'?: string
  'Last-Evaluated'?: string
  'Content-Location'?: string
  'Application-Test-Id'?: string
}

export interface ApplicationRequest extends HttpRequest {
  Auth: Omit<ApplicationWebToken, "sub" | "iss" | "iat" | "exp">
  Administrative: boolean
}

export interface ApplicationResponse {
  status?: HttpStatusResponse
  body?: string|object
  error?: boolean
  headers?: Partial<HttpCustomHeaders>
}

export interface ApplicationWebToken {
  sub: string
  iss: string
  exp: number
  iat: number
  client: string
  admin?: boolean
}
