import patterns from '../access'
import { createClient, createDomain } from '../records'

describe('hared/helpers/access funções com padrões de acesso', () => {
  describe('listClients()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const result = patterns.listClients()

      expect(result).toMatchObject({
        IndexName: 'Lists',
        KeyConditionExpression: 'ListPk = :pk AND Sk = :sk',
        ExpressionAttributeValues: {
          ':pk': 'Client',
          ':sk': 'Profile'
        }
      })
    })
  })

  describe('listDomains()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const result = patterns.listDomains()

      expect(result).toMatchObject({
        IndexName: 'Lists',
        KeyConditionExpression: 'ListPk = :pk AND begins_with(Sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': 'Domain',
          ':sk': 'D@'
        }
      })
    })
  })

  describe('listDomainsByClient()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const client = 'id-do-cliente'

      const result = patterns.listDomainsByClient(client)

      expect(result).toMatchObject({
        KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `C#${client}`,
          ':sk': 'D@'
        }
      })
    })
  })

  describe('listPayments()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const result = patterns.listPayments()

      expect(result).toMatchObject({
        IndexName: 'Lists',
        KeyConditionExpression: 'ListPk = :pk AND begins_with(Sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': 'Payment',
          ':sk': 'Pay#'
        },
        ScanIndexForward: false
      })
    })
  })

  describe('listPaymentsByClient()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const client = 'id-do-cliente'

      const result = patterns.listPaymentsByClient(client)

      expect(result).toMatchObject({
        KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `C#${client}`,
          ':sk': 'Pay#'
        },
        ScanIndexForward: false
      })
    })
  })

  describe('listPaymentsByStatus()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const status = 'created'

      const result = patterns.listPaymentsByStatus(status)

      expect(result).toMatchObject({
        IndexName: 'Payments',
        KeyConditionExpression: 'ListPk = :pk AND begins_with(StatusSk, :sk)',
        ExpressionAttributeValues: {
          ':pk': 'Payment',
          ':sk': `${status}#`
        },
        ScanIndexForward: false
      })
    })
  })

  describe('listDomainMetrics()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const domain = 'example.com.br'

      const result = patterns.listDomainMetrics(domain)

      expect(result).toMatchObject({
        KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `D@${domain}`,
          ':sk': 'Metrics@'
        }
      })
    })
  })

  describe('listDomainMetricsByYear()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const domain = 'example.com.br'
      const year = 2022

      const result = patterns.listDomainMetricsByYear(domain, year)

      expect(result).toMatchObject({
        KeyConditionExpression: 'Pk = :pk AND begins_with(Sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': `D@${domain}`,
          ':sk': `Metrics@${year}`
        }
      })
    })
  })

  describe('listDomainMetricsByPeriod()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const domain = 'example.com.br'
      const start = new Date()
      const end = new Date()

      const result = patterns.listDomainMetricsByPeriod(domain, start, end)

      expect(result).toMatchObject({
        KeyConditionExpression: 'Pk = :pk AND Sk BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':pk': `D@${domain}`,
          ':start': `Metrics@${(start.toISOString().substring(0, 7))}`,
          ':end': `Metrics@${(end.toISOString().substring(0, 7))}`
        }
      })
    })
  })

  describe('listSessionActivity()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const id = 'id-da-session'
      const result = patterns.listSessionActivity(id)

      expect(result).toMatchObject({
        IndexName: 'Analytics',
        KeyConditionExpression: 'SessionId = :pk',
        ExpressionAttributeValues: {
          ':pk': id
        }
      })
    })
  })

  describe('retrieveAdmin()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const email = 'cliente@email.com'

      const result = patterns.retrieveAdmin(email)

      expect(result).toMatchObject({
        Pk: `A#${email}`,
        Sk: 'Admin'
      })
    })

    it('deveria retornar uma consulta ao banco de dados corretamente com id já formatado', () => {
      const id = 'A#cliente@email.com'

      const result = patterns.retrieveAdmin(id)

      expect(result).toMatchObject({
        Pk: id,
        Sk: 'Admin'
      })
    })
  })

  describe('retrieveLogin()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const email = 'cliente@email.com'

      const result = patterns.retrieveLogin(email)

      expect(result).toMatchObject({
        Pk: `E#${email}`,
        Sk: 'Login'
      })
    })

    it('deveria retornar uma consulta ao banco de dados corretamente com id já formatado', () => {
      const id = 'E#cliente@email.com'

      const result = patterns.retrieveLogin(id)

      expect(result).toMatchObject({
        Pk: id,
        Sk: 'Login'
      })
    })
  })

  describe('retrieveClient()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const client = 'C#id-do-cliente'

      const result = patterns.retrieveClient(client)

      expect(result).toMatchObject({
        Pk: client,
        Sk: 'Profile'
      })
    })
  })

  describe('retrieveDomain()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const client = 'id-do-cliente'
      const domain = 'D@example.com.br'

      const result = patterns.retrieveDomain(client, domain)

      expect(result).toMatchObject({
        Pk: `C#${client}`,
        Sk: domain
      })
    })
  })

  describe('retrieveMetric()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const domain = 'example.com.br'
      const date = new Date()

      const result = patterns.retrieveMetric(domain, date)

      expect(result).toMatchObject({
        Pk: `D@${domain}`,
        Sk: `Metrics@${(date.toISOString().substring(0, 7))}`
      })
    })
  })

  describe('putDomain()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const clientId = 'id-do-cliente'
      const clientEmail = 'client@email.com'
      const clientDocument = '99999999999'
      const clientPassword = 'A1B2C3D4'
      const domainId = 'id-do-domain'
      const domainUrl = 'example.com.br'
      const domainValue = 12000
      const client = createClient(clientId, clientEmail, clientDocument, clientPassword)
      const domain = createDomain(client, domainId, domainUrl, domainValue)
      const table = 'dynamodb-table-name'

      const result = patterns.putDomain(client, domain, table)

      expect(result.TransactItems.length).toBe(3)
    })
  })

  describe('putMetric()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const clientId = 'id-do-cliente'
      const clientEmail = 'client@email.com'
      const clientDocument = '99999999999'
      const clientPassword = 'A1B2C3D4'
      const domainId = 'id-do-domain'
      const domainUrl = 'example.com.br'
      const domainValue = 12000
      const client = createClient(clientId, clientEmail, clientDocument, clientPassword)
      const domain = createDomain(client, domainId, domainUrl, domainValue)
      const table = 'dynamodb-table-name'

      const resultOne = patterns.putMetric(domain, 'Events', {}, table)
      const resultTwo = patterns.putMetric(domain, 'Sessions', {}, table)

      expect(resultOne.TransactItems.length).toBe(3)
      expect(resultTwo.TransactItems.length).toBe(2)
    })
  })

  describe('queryPaymentById()', () => {
    it('deveria retornar uma consulta ao banco de dados corretamente', () => {
      const id = 'id-do-pagamento'

      const result = patterns.queryPaymentById(id)

      expect(result).toMatchObject({
        IndexName: 'PicPay',
        KeyConditionExpression: 'PI = :pk',
        ExpressionAttributeValues: {
          ':pk': id,
        }
      })
    })
  })
})
