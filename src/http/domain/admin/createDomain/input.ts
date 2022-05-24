import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  domain: string
  value: number
}

const schema = {
  type: 'object',
  properties: {
    domain: {
      type: 'string'
    },
    value: {
      type: 'number'
    }
  },
  required: [
    'domain',
    'value'
  ],
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
