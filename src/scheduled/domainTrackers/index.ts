import { createMetric } from '@architect/shared/helpers/records'
import { listDomains, putMetric } from '@architect/shared/repositories/domains'

export async function handler (event: any): Promise<any> {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1)

  const domains = await listDomains()

  for (const domain of domains) {
    const metric = createMetric(domain.Sk, nextMonth)
    await putMetric(metric)
  }

  return
}
