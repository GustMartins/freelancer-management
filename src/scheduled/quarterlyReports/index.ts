import {
  isAnualPeriod, isQuarterlyPeriod, previousNMonths
} from '@architect/shared/helpers/dates'
import { emitReportTarget } from '@architect/shared/providers/events'
import { listDomains } from '@architect/shared/repositories/domains'

export async function handler (event: any): Promise<any> {
  const domains = await listDomains()

  const filtered = domains.filter(d => isQuarterlyPeriod(new Date(d.CreatedAt)))

  for (const domain of filtered) {
    const months = isAnualPeriod(new Date(domain.CreatedAt)) ? 12 : 3

    await emitReportTarget({
      domain,
      months: previousNMonths(months).map(m => m.toISOString().substring(0, 7))
    })
  }

  return
}
