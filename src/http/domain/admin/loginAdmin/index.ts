import { http } from '@architect/functions'
import { login } from '@architect/shared/middlewares/login'

async function loginAdmin (request: any): Promise<any> {
  return request
}

export const handler = http.async(login, loginAdmin)
