import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  s: string
  v: string
}

const schema = {
  type: 'object',
  properties: {
    s: {
      type: 'string'
    },
    v: {
      type: 'string'
    }
  },
  required: [
    's'
  ],
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
