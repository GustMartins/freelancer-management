import { HttpRequest, HttpResponse } from '@architect/functions'

import {
  ApplicationResponse, HttpCustomHeaders
} from '../interfaces/application.types'
import { entityId } from './token'

/**
 * Função para converter os nomes dos cabeçalhos do objeto request.headers
 * para caixa baixa.
 */
 export const normalizeHeaders = (request: HttpRequest): Record<string, string> => {
  const headers: Record<string, string> = {}

  Object.keys(request.headers).forEach(key => {
    headers[key.toLowerCase()] = request.headers[key]
  })

  return headers
}

/**
 * Função para retornar uma resposta ao cliente
 */
export const send = (props?: ApplicationResponse): HttpResponse => {
  const id = entityId()

  const headers: Partial<HttpCustomHeaders> = {
    'Application-Id': `ari_${id}`,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  }

  if (props?.headers) {
    for (const header of (Object.keys(props.headers) as Array<keyof HttpCustomHeaders>)) {
      headers[header] = props.headers[header]
    }
  }

  if (props?.error) {
    if (props.status === 401) {
      headers['WWW-Authenticate'] = `Bearer realm="${process.env.APPLICATION_REALM_ID}"`
    }
  }

  if (props?.body) {
    switch (typeof props.body) {
      case 'string':
        headers['Content-Type'] = 'text/plain; charset=utf-8'
        break
      default:
        headers['Content-Type'] = 'application/json'
        break
    }
  }

  const response = {
    headers: <unknown>headers as Record<string, string>,
    statusCode: props?.status ? props.status : props?.body ? 200 : 204,
    ...(props?.body && {
      body: (typeof props.body === 'string')
        ? props.body
        : JSON.stringify(props.body)
    })
  }
  console.log(id, response)

  return response
}
