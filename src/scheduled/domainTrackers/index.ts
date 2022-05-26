import { nextMonth } from '@architect/shared/helpers/dates'
import { createMetric } from '@architect/shared/helpers/records'
import { listDomains, putMetric } from '@architect/shared/repositories/domains'

export async function handler (event: any): Promise<any> {
  const nextMonthDate = nextMonth()
  const domains = await listDomains()

  for (const domain of domains) {
    const metric = createMetric(domain.Sk, nextMonthDate)
    await putMetric(metric)
  }

  return
}
