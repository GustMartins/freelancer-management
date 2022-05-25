import Ajv from 'ajv'

import {
  PaymentEntityStatuses
} from '@architect/shared/interfaces/records.types'

const ajv = new Ajv()

export interface DataInput {
  client: string
  status: PaymentEntityStatuses
}

const schema = {
  type: 'object',
  properties: {
    client: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: [
        'opened',
        'created',
        'expired',
        'analysis',
        'paid',
        'completed',
        'refunded',
        'chargeback'
      ]
    }
  },
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
