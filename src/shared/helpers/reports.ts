import {
  ClientEntity, MetricEntity, PaymentEntity, TaxEntity
} from '../interfaces/records.types'
import { PicpayPaymentRequestResponse } from '../providers/picpay'

// TODO: Projetar e desenvolver a função prepareReportNotification()
export function prepareReportNotification (metrics: MetricEntity[]): any {}

// TODO: Projetar e desenvolver a função preparePaymentNotification()
export function preparePaymentNotification (client: ClientEntity, payment: PaymentEntity | TaxEntity, picpayPayment: PicpayPaymentRequestResponse): any {}

// TODO: Projetar e desenvolver a função prepareWelcomeNotification()
export function prepareWelcomeNotification (client: ClientEntity): any {}
