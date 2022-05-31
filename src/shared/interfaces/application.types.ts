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

interface EventSnsMessage {
  Sns: {
    Message: string
  }
}

export interface EventPayload {
  Records: EventSnsMessage[]
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

export enum NotificationTypes {
  ReportNotification,
  RequestPayment,
  WelcomeClient
}

interface ReportNotification {
  type: NotificationTypes.ReportNotification
  client: ClientEntity
  report: any
}

interface RequestPayment {
  type: NotificationTypes.RequestPayment
  client: ClientEntity
  report: any
}

interface WelcomeClient {
  type: NotificationTypes.WelcomeClient
  client: ClientEntity
  report: any
}

export type NotifyTargetsEvent =
    ReportNotification
  | RequestPayment
  | WelcomeClient

export interface RequestPaymentEvent {
  client: ClientEntity
  type: 'Tax' | 'Payment'
}

export interface ArrearsInPaymentEvent {
  payment: PaymentEntity
}

export interface WelcomeClientEvent {
  client: ClientEntity
}

export interface DomainCreatedEvent {
  client: ClientEntity
  domain: DomainEntity
}

export interface ReportTargetEvent {
  domain: DomainEntity
  months: string[]
}

export interface CheckPaymentEvent {
  payment: PaymentEntity
}
