import {
  ClientEntity, DomainEntity, LogEntity, MetricEntity, PaymentEntity
} from '../../interfaces/records.types'
import {
  createClient, createDomain, createLog, createMetric, createPayment
} from '../records'

describe('shared/helpers/records funções com registros', () => {
  describe('createClient()', () => {
    it('deveria gerar um registro de cliente corretamente', () => {
      const id = 'id-do-cliente'
      const email = 'cliente@email.com'
      const document = '999.999.999-99'
      const password = 'G5AL98RB'

      const clientCreated = createClient(id, email, document, password)

      expect(clientCreated).toMatchObject<ClientEntity>({
        Pk: `C#${id}`,
        Sk: 'Profile',
        ListPk: 'Client',
        Email: email,
        Password: password,
        Document: document,
        DomainCount: 0,
        InvoiceAt: new Date().getMonth()
      })
    })
  })

  describe('createPayment()', () => {
    it('deveria gerar um registro de pagamento corretamente', () => {
      const id = 'id-do-cliente'
      const year = 2022
      const date = new Date()
      const value = 12000
      const domains = 1
      const client = 'client@email.com'

      const paymentCreated = createPayment(client, id, year, date, value, domains)

      expect(paymentCreated).toMatchObject<PaymentEntity>({
        Pk: 'C#id-do-cliente',
        Sk: `Pay#2022`,
        ListPk: `Payment`,
        StatusSk: `created#${date.toISOString()}`,
        Client: client,
        RetryCount: 0,
        Value: value,
        DomainCount: domains
      })
    })
  })

  describe('createDomain()', () => {
    it('deveria gerar um registro de domínio corretamente', () => {
      const clientId = 'id-do-cliente'
      const email = 'cliente@email.com'
      const document = '999.999.999-99'
      const password = 'G5AL98RB'
      const clientCreated = createClient(clientId, email, document, password)
      const id = 'id-do-domain'
      const domain = 'example.com.br'
      const value = 12000

      const domainCreated = createDomain(clientCreated, id, domain, value)

      expect(domainCreated).toMatchObject<DomainEntity>({
        Pk: `C#${clientId}`,
        Sk: `D@${id}`,
        ListPk: 'Domain',
        Client: email,
        Website: domain,
        Value: value
      })
    })
  })

  describe('createMetric()', () => {
    it('deveria gerar um registro de domínio corretamente', () => {
      const domain = 'example.com.br'
      const date = new Date()

      const metricCreated = createMetric(domain, date)

      expect(metricCreated).toMatchObject<MetricEntity>({
        Pk: `D@${domain}`,
        Sk: `Metrics@${date.toISOString().substring(0, 7)}`,
        Content: {
          Created: date.toISOString(),
          SessionsCount: 0,
          PagesCount: 0,
          EventsCount: 0,
          Pages: {},
          Events: {}
        }
      })
    })
  })

  describe('createLog()', () => {
    it('deveria gerar um registro de domínio corretamente', () => {
      const session = 'id-da-session'
      const domain = 'example.com.br'
      const date = new Date()

      const metricCreated = createLog(session, domain, 'Sessions', date, {
        time: date.getTime()
      })

      expect(metricCreated).toMatchObject<LogEntity>({
        Pk: `D@${domain}`,
        Sk: `Sessions#${date.toISOString()}`,
        Kind: 'Sessions',
        SessionId: session,
        Content: {
          time: date.getTime()
        }
      })
    })
  })
})
