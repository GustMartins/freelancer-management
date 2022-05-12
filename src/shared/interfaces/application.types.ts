
type HttpStatusResponse = 
    200
  | 201
  | 202
  | 204
  | 400
  | 401
  | 402
  | 403
  | 404
  | 409
  | 500

export interface HttpCustomHeaders {
  'Application-Id': string
  'Access-Control-Allow-Origin': string,
  'Access-Control-Allow-Methods': string,
  'Access-Control-Allow-Headers': string,
  'Content-Type': string
  'WWW-Authenticate'?: string
  'Last-Evaluated'?: string
  'Content-Location'?: string
  'Application-Test-Id'?: string
}

export interface ApplicationResponse {
  status?: HttpStatusResponse
  body?: string|object
  error?: boolean
  headers?: Partial<HttpCustomHeaders>
}
