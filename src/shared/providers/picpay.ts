import * as https from 'https'

type PicpayPaymentStatus =
    'created'
  | 'expired'
  | 'analysis'
  | 'paid'
  | 'completed'
  | 'refunded'
  | 'chargeback'

interface PicpayPaymentRequestResponse {
  referenceId: string
  paymentUrl: string
  expiresAt: string
  qrcode: {
    content: string
    base64: string
  }
}

interface PicpayPaymentStatusResponse {
  referenceId: string
  status: PicpayPaymentStatus
  authorizationId?: string
}

interface RequestPaymentBody {
  referenceId: string
  callbackUrl: string
  value: number,
  expiresAt: string
  buyer: object,
  returnUrl?: string
}

const defaultOptions: https.RequestOptions = {
  method: 'POST',
  hostname: 'appws.picpay.com',
  headers: {
    'x-picpay-token': process.env.PICPAY_TOKEN as string
  }
}

const doHttpRequest = <T>(options: https.RequestOptions, data?: string) => {
  if (data) {
    options.headers!['Content-Type'] = 'application/json'
    options.headers!['Content-Length'] = data.length
  }

  return new Promise<T>((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => { responseBody += chunk })

      res.on('end', () => { resolve(JSON.parse(responseBody)) })
    })

    req.on('error', (err) => { reject(err) })

    if (data) {
      req.write(data)
    }
    req.end()
  })
}

export const requestPicpayPayment = async (body: RequestPaymentBody) => {
  return await doHttpRequest<PicpayPaymentRequestResponse>({
    ...defaultOptions,
    path: '/ecommerce/public/payments'
  }, JSON.stringify(body))
}

export const requestPicpayStatus = async (id: string) => {
  return await doHttpRequest<PicpayPaymentStatusResponse>({
    ...defaultOptions,
    method: 'GET',
    path: `/ecommerce/public/payments/${id}/status`
  })
}
