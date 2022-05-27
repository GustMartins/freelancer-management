import { emitCheckPayment } from '@architect/shared/providers/events'
import {
  listPicPayPaymentsByStatus
} from '@architect/shared/repositories/admin'

export async function handler (event: any): Promise<any> {
  const payments = await listPicPayPaymentsByStatus('created')

  for (const payment of payments) {
    await emitCheckPayment({ payment })
  }

  return
}
