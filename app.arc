@app
gmfreela

@aws
# profile default
region us-west-2
architecture arm64
runtime typescript

@plugins
architect/plugin-typescript

@sandbox
seed-data

@shared

@scheduled
monthly-payments
  cron 0 8 1 * ? *
  src src/scheduled/monthlyPayments

late-payments
  cron 0 9 ? * MON-FRI *
  src src/scheduled/latePayments

domain-trackers
  cron 0 2 20 * ? *
  src src/scheduled/domainTrackers

quarterly-reports
  cron 0 9 5 * ? *
  src src/scheduled/quarterlyReports

payments-check
  cron 0 7,18 * * ? *
  src src/scheduled/paymentsCheck

@events
notify-targets
  src src/events/notifyTargets

request-payment
  src src/events/requestPayment

arrears-in-payment
  src src/events/arrearsInPayment

welcome-client
  src src/events/welcomeClient

domain-created
  src src/events/domainCreated

report-target
  src src/events/reportTargets

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

/c/domains
  method get
  src src/http/domain/clients/listDomains

/c/analytics/:app
  method get
  src src/http/domain/clients/appAnalytics

/c/timeline/:id
  method get
  src src/http/domain/clients/sessionTimeline

# Analytics
/a/:app/session
  method get
  src src/http/domain/analytics/sessionMenagement

/a/:app/page/*
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
designers
  Pk *String
  Sk **String

@tables-indexes
designers
  ListPk *String
  Sk **String
  name Lists

designers
  ListPk *String
  StatusSk **String
  name Payments

designers
  PI *String
  name PicPay

designers
  SessionId *String
  name Analytics
