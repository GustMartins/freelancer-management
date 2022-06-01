import {
  ClientEntity, DomainEntity, MetricEntity, PaymentEntity, TaxEntity
} from '../interfaces/records.types'
import { PicpayPaymentRequestResponse } from '../providers/picpay'

// TODO: Projetar e desenvolver a função prepareReportNotification()
export function prepareReportNotification (metrics: MetricEntity[]): any {}

// TODO: Projetar e desenvolver a função preparePaymentNotification()
export function preparePaymentNotification (client: ClientEntity, payment: PaymentEntity | TaxEntity, picpayPayment: PicpayPaymentRequestResponse, domain?: DomainEntity): any {}

// TODO: Projetar e desenvolver a função prepareNonPayingNotification()
export function prepareNonPayingNotification (client: ClientEntity): any {}

// TODO: Projetar e desenvolver a função prepareWelcomeNotification()
export function prepareWelcomeNotification (client: ClientEntity): any {}

// TODO: Projetar e desenvolver a função prepareDomainNotification()
export function prepareDomainNotification (client: ClientEntity, domain: DomainEntity): any {}
