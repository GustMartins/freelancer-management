import { events } from '@architect/functions'

import {
  ApplicationEvents, ArrearsInPaymentEvent, DomainCreatedEvent,
  NotifyTargetsEvent, ReportTargetEvent, RequestPaymentEvent, WelcomeClientEvent
} from '../interfaces/application.types'

export async function emitNotifyTargets (payload: NotifyTargetsEvent): Promise<void> {
  await events.publish({ name: ApplicationEvents.NotifyTargets, payload })
}

/**
 * Função para disparar o event <request-payment>
 *
 * @fires request-payment Evento para solicitar uma cobrando ao cliente
 * @param payload Dados para envio do evento
 */
export async function emitRequestPayment (payload: RequestPaymentEvent): Promise<void> {
  await events.publish({ name: ApplicationEvents.RequestPayment, payload })
}

export async function emitArrearsInPayment (payload: ArrearsInPaymentEvent): Promise<void> {
  await events.publish({ name: ApplicationEvents.ArrearsInPayment, payload })
}

export async function emitWelcomeClient (payload: WelcomeClientEvent): Promise<void> {
  await events.publish({ name: ApplicationEvents.WelcomeClient, payload })
}

export async function emitDomainCreated (payload: DomainCreatedEvent): Promise<void> {
  await events.publish({ name: ApplicationEvents.DomainCreated, payload })
}

/**
 * Função para disparar o evento <report-target>
 *
 * @fires report-target Evento para gerar um relatório dos últimos n meses
 * @param payload Dados para envio do evento
 */
export async function emitReportTarget (payload: ReportTargetEvent): Promise<void> {
  await events.publish({ name: ApplicationEvents.ReportTarget, payload })
}
