import { emitArrearsInPayment } from '@architect/shared/providers/events'
import { listExpiredPayments } from '@architect/shared/repositories/admin'

export async function handler (event: any): Promise<any> {
  const payments = await listExpiredPayments()

  for (const payment of payments) {
    await emitArrearsInPayment({ payment })
  }

  return
}
