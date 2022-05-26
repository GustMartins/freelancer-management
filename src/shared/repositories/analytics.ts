import { tables } from '@architect/functions'

import access from '../helpers/access'
import { decodeKey, metricSecondaryKey } from '../helpers/keys'
import { createLog } from '../helpers/records'
import { LogEntityKinds } from '../interfaces/records.types'

/**
 * Função para criar um registro analítico no banco de dados
 * @param id Identificador da sessão
 * @param domainId Identificador do domínios
 * @param type Tipo de registro de login
 * @param data Dados associados ao registro
 */
export async function putAnalytics (id: string, domainId: string, type: LogEntityKinds, data: Record<string, any>): Promise<void> {
  const db = await tables()
  const table = db.name('designers')

  let dates = null
  if (type !== 'Sessions') {
    const metric = await db.designers.get(access.retrieveMetric(domainId, new Date()))

    dates = metric.Content[type].hasOwnProperty(data.page || data.event)
        ? [...metric.Content[type][data.page || data.event]]
        : []
  }

  if (process.env.ARC_ENV !== 'production') {
    const date = new Date()

    await db.designers.put(createLog(id, decodeKey(domainId).id, type, date, data))
    await db.designers.update({
      Key: {
        Pk: domainId,
        Sk: metricSecondaryKey(date.toISOString().substring(0, 7))
      },
      UpdateExpression: 'ADD #ct.#prop :value',
      ExpressionAttributeNames: {
        '#ct': 'Content',
        '#prop': `${type}Count`
      },
      ExpressionAttributeValues: {
        ':value': 1
      }
    })

    if (type !== 'Sessions') {
      await db.designers.update({
        Key: {
          Pk: domainId,
          Sk: metricSecondaryKey(date.toISOString().substring(0, 7))
        },
        UpdateExpression: 'SET #ct.#ty.#pe = :value',
        ExpressionAttributeNames: {
          '#ct': 'Content',
          '#ty': type,
          '#pe': data.page || data.event
        },
        ExpressionAttributeValues: {
          ':value': [...dates, date.toISOString()]
        }
      })
    }
  } else {
    // @ts-ignore
    await db._doc.transactWrite(access.putMetricLog(id, domain, type, dates, data, table)).promise()
  }
}
