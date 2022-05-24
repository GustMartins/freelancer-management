import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  email: string
  password: number
}

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 6
    }
  },
  required: [
    'email',
    'password'
  ],
  additionalProperties: false
}

export default ajv.compile<DataInput>(schema)
