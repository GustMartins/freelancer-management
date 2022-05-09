@app
gmfreela

@aws
# profile default
region us-west-2
architecture arm64
runtime typescript

@plugins
architect/plugin-typescript

@shared

@scheduled
monthly-payments
  cron 0/5 8-17 1 * ? *
  src src/scheduled/monthlyPayments

late-payments
  cron 0 9 ? * MON-FRI *
  src src/scheduled/latePayments

domain-trackers
  cron 0 2 20 * ? *
  src src/scheduled/domainTrackers

@events
send-notification
  src src/events/sendNotification

payment-request
  src src/events/paymentRequest

arrears-in-payment
  src src/events/arrearsInPayment

@http
# Administrator
/g/token
  method post
  src src/http/domain/admin/loginAdmin

/g/clients
  method post
  src src/http/domain/admin/createClient

/g/clients/:client/domains
  method post
  src src/http/domain/admin/createDomain

/g/clients
  method get
  src src/http/domain/admin/listClients

/g/clients/:client/domains
  method get
  src src/http/domain/admin/clientDomains

/g/domains
  method get
  src src/http/domain/admin/listDomains

/g/payments
  method get
  src src/http/domain/admin/listPayments

/g/analytics/:app
  method get
  src src/http/domain/admin/appAnalytics # Veja GET /c/analytics/:app

# Clients
/c/token
  method post
  src src/http/domain/clients/loginClient

/c/analytics/:app
  method get
  src src/http/domain/clients/appAnalytics

# Analytics
/a/:app/session
  method get
  src src/http/domain/analytics/sessionMenagement

/a/:app/page/:path
  method get
  src src/http/domain/analytics/pageAccess

/a/:app/event/:event
  method get
  src src/http/domain/analytics/eventTrigger

# Payments
/p/payment/notification
  method post
  src src/http/domain/payments/picpayCallback

@tables
Designers-Table
  Pk *String
  Sk *String

@tables-indexes
Designers-Table
  ListPk *String
  Sk **String
  name Lists

Designers-Table
  ListPk *String
  StatusSk **String
  name Payments

Designers-Table
  PI *String
  name PicPay
