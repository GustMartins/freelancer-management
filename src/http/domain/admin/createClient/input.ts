import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  email: string
  document: string
  password: string
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
    'password'
  ],
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
