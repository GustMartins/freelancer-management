// TODO: Verificar se é necessário documentar melhor as interfaces disponíveis

type RecordsKeyMap = {
  client: string
  email: string
  domain: string
  payment: string
  metrics: string
  sessions: string
  pages: string
  events: string
  created: string
  expired: string
  analysis: string
  paid: string
  completed: string
  refunded: string
  chargeback: string
}

export interface RecordsKey {
  id: string
  key?: keyof RecordsKeyMap
  separator: 'none' | 'at' | 'hashtag'
}

/**
 * Chaves de registro
 * 
 * Os registros no banco de dados possuem todos as propriedades Pk e Sk.
 */
export interface RecordHashKey {
  Pk: string
  Sk: string
}

/**
 * Chave para listas
 */
export interface RecordListsGSIKey {
  ListPk: string
}

/**
 * Chave para pagamentos
 */
export interface RecordPaymentsGSIKey {
  ListPk: string
  StatusSk: string
}

/**
 * Chave para localizar referências de pagamentos
 */
export interface RecordPicPayGSIKey {
  PI: string
}

/**
 * Entidade de cliente
 */
export interface ClientEntity extends RecordHashKey, RecordListsGSIKey {
  ListPk: 'Client'
  Email: string
  Password: string
  Document: string
  DomainCount: number
  InvoiceAt: number
  LastPayment?: string
}

/**
 * Entidade de cliente utilizada ao realizar log-in para visualizar dados 
 * analíticos
 */
export interface LoginEntity extends RecordHashKey {
  Client: string
}

/**
 * Status disponível a um pagamento
 * 
 * Essa lista é baseada principalmente nos status de pagamento da plataforma
 * PicPay utilizada para processar os pagamentos.
 * Veja: https://studio.picpay.com/produtos/e-commerce/checkout/guides/order-status
 */
export type PaymentEntityStatuses = 
    'opened'
  | 'created' 
  | 'expired' 
  | 'analysis' 
  | 'paid' 
  | 'completed' 
  | 'refunded' 
  | 'chargeback'

/**
 * Entidade para pagamento de domínios
 */
export interface PaymentEntity extends RecordHashKey, RecordPaymentsGSIKey, Partial<RecordPicPayGSIKey> {
  ListPk: 'Payment'
  RetryCount: number
  Value: number
  DomainCount: number
}

/**
 * Entidade para domínio de usuários
 */
export interface DomainEntity extends RecordHashKey, RecordListsGSIKey {
  ListPk: 'Domain'
  Client: string
  Website: string
  Value: number
}

/**
 * Entidade para métricas mensais de domínios
 */
export interface MetricEntity extends RecordHashKey {
  Content: {
    Created: string
    SessionsCount: number
    PagesCount: number
    EventsCount: number
    Pages: Record<string, any>
    Events: Record<string, any>
  }
}

export type LogEntityKinds = 'Sessions' | 'Pages' | 'Events'

/**
 * Entidade para logs analíticos de domínios
 */
export interface LogEntity extends RecordHashKey {
  Kind: LogEntityKinds
  Content: Record<string, any>
}
