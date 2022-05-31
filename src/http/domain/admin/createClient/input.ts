import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  email: string
  document: string
  password: string
  value: number
  invoice?: number
}

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    document: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    value: {
      type: 'number',
      minimum: 15000
    },
    invoice: {
      type: 'number',
      enum: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
      ]
    }
  },
  required: [
    'email',
    'document',
    'password',
    'value'
  ],
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
