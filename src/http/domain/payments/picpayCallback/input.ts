import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  referenceId: string
  authorizationId?: string
}

const schema = {
  type: 'object',
  properties: {
    referenceId: {
      type: 'string'
    },
    authorizationId: {
      type: 'string'
    }
  },
  required: [
    'referenceId'
  ],
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
