import bcrypt from 'bcryptjs'

import { http } from '@architect/functions'
import access from '@architect/shared/helpers/access'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import { createToken } from '@architect/shared/helpers/token'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { getAdmin } from '@architect/shared/repositories/admin'

import validator from './input'

async function loginAdmin (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.body)) {
      throw new PayloadError()
    }

    const admin = await getAdmin(access.retrieveAdmin(request.body.email))

    if (!bcrypt.compareSync(request.body.password, admin.Password)) {
      throw new PayloadError('E-mail ou senha estão incorretos.')
    }

    const token = createToken(admin.Pk, true)

    return send({
      body: {
        token
      }
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(loginAdmin)
