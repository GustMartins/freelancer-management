import { http } from '@architect/functions'
import {
  ApplicationRequest
} from '@architect/shared/interfaces/application.types'

async function loginAdmin (request: ApplicationRequest): Promise<any> {
  return request
}

export const handler = http.async(loginAdmin)
