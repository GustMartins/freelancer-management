import Ajv from 'ajv'

const ajv = new Ajv()

export interface DataInput {
  year: string
  start: string
  end: string
}

const schema = {
  type: 'object',
  properties: {
    year: {
      type: 'string',
      pattern: '^[0-9]{4}$'
    },
    start: {
      type: 'string',
      pattern: '^[0-9]{4}-[0-9]{2}$'
    },
    end: {
      type: 'string',
      pattern: '^[0-9]{4}-[0-9]{2}$'
    }
  },
  additionalProperties: false,
  dependencies: {
    start: {
      required: [
        'end'
      ]
    }
  }
}

export default ajv.compile<DataInput>(schema)
