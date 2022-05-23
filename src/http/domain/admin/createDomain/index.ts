import { http } from '@architect/functions'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'
import { auth } from '@architect/shared/middlewares/auth'

async function createDomain (request: ApplicationRequest): Promise<any> {
  return request
}

export const handler = http.async(auth, createDomain)
