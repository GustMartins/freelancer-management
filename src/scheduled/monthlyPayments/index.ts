import { emitRequestPayment } from '@architect/shared/providers/events'
import { listClientsToInvoice } from '@architect/shared/repositories/clients'

export async function handler (event: any): Promise<any> {
  const clients = await listClientsToInvoice()

  for (const client of clients) {
    await emitRequestPayment({ client, type: 'Payment' })
  }

  return
}
