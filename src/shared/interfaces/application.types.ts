import { HttpRequest } from '@architect/functions'

import { ClientEntity, DomainEntity, PaymentEntity } from './records.types'

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
  query: Record<string, any>
  Auth: Omit<ApplicationWebToken, "sub" | "iss" | "iat" | "exp">
  Administrative: boolean
  User?: ClientEntity
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

export enum ApplicationEvents {
  NotifyTargets = 'notify-targets',
  RequestPayment = 'request-payment',
  ArrearsInPayment = 'arrears-in-payment',
  WelcomeClient = 'welcome-client',
  DomainCreated = 'domain-created',
  ReportTarget = 'report-target',
  CheckPayment = 'check-payment'
}

export interface NotifyTargetsEvent {}

export interface RequestPaymentEvent {
  client: ClientEntity
}

export interface ArrearsInPaymentEvent {
  payment: PaymentEntity
}

export interface WelcomeClientEvent {}

export interface DomainCreatedEvent {}

export interface ReportTargetEvent {
  domain: DomainEntity
  months: string[]
}

export interface CheckPaymentEvent {
  payment: PaymentEntity
}
