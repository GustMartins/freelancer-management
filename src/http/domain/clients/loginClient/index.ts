import bcrypt from 'bcryptjs'

import { http } from '@architect/functions'
import access from '@architect/shared/helpers/access'
import { PayloadError } from '@architect/shared/helpers/errors'
import { send, sendError } from '@architect/shared/helpers/http'
import { createToken } from '@architect/shared/helpers/token'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { getClient, getLogin } from '@architect/shared/repositories/clients'

import validator from './input'

export async function loginClientHandler (request: ApplicationRequest): Promise<any> {
  try {
    if (!validator(request.body)) {
      throw new PayloadError()
    }

    const login = await getLogin(access.retrieveLogin(request.body.email))
    const client = await getClient(access.retrieveClient(login.Client))

    if (!bcrypt.compareSync(request.body.password, client.Password)) {
      throw new PayloadError('E-mail ou senha estão incorretos.')
    }

    const token = createToken(login.Pk, false)

    return send({
      body: {
        token
      }
    })
  } catch (error) {
    return sendError(error)
  }
}

export const handler = http.async(loginClientHandler)
