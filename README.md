# Currency Checker

### Todo:

- [x] Install express
- [x] [Optional] Install and configure nodemon
- [x] Create layer architecture (controllers, services, repositories) (Dummy Controller, Dummy Service, Dummy Repository)
- [x] Create Routes class and configure routes
- [x] Create Application class and configure express

---

### Application Todo:

NOTE: Configuration File with Currencies and exchange rates

- [x] Endpoint to get all currencies: GET /currencies [USD, PLN, EUR, GBP, CHF]
- [x] Endpoint to get currency change rate: GET /currencies/:currency [PLN, EUR, GBP, CHF]
- [x] Endpoint to get currency change rate: GET /currencies/:currency?compare_to=currency
- [ ] Setup CI/CD pipeline
- [ ] Setup dependabot
- [ ] Setup Sonarcube
- [ ] Store currencies in database
- [ ] Use DI framework
- [ ] Use validation library
- [ ] Call some external service to get the currency info
- [ ] Reduce number of requests to external service
- [ ] Generate OpenApi documentation
- [ ] Containerize application
- [ ] Create logging and monitoring for the application
- [ ] Get notifications when desired exchange rate was found
