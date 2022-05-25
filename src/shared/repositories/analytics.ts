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

  if (process.env.ARC_ENV !== 'production') {
    await db.designers.put(createLog(id, decodeKey(domainId).id, type, new Date(), data))
    await db.designers.update({
      Key: {
        Pk: domainId,
        Sk: metricSecondaryKey((new Date()).toISOString().substring(0, 7))
      },
      UpdateExpression: 'ADD #prop :value',
      ExpressionAttributeNames: {
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
          Sk: metricSecondaryKey((new Date()).toISOString().substring(0, 7))
        },
        UpdateExpression: 'SET #prop = list_append(:value, #prop)',
        ExpressionAttributeNames: {
          '#prop': `${type}.${data.page || data.event}`
        },
        ExpressionAttributeValues: {
          ':value': [(new Date()).toISOString()]
        }
      })
    }
  } else {
    // @ts-ignore
    await db._doc.transactWrite(access.putMetric(id, domain, type, data, table)).promise()
  }
}
