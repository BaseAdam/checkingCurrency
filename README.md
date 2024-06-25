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
- [x] Setup CI/CD pipeline
- [x] Setup dependabot
- [x] Setup Sonarcube
- [x] Store currencies in database
- [x] Use DI framework
- [ ] Use validation library
- [ ] Call some external service to get the currency info
- [ ] Reduce number of requests to external service
- [ ] Generate OpenApi documentation
- [ ] Containerize application
- [ ] Create logging and monitoring for the application
- [ ] Get notifications when desired exchange rate was found

# ONLINE CURRENCY EXCHANGE

## Requirements

1. Node.js
2. NPM (Node Package Manager) or Yarn

## Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project's root directory.
3.  Open a terminal and run the following command to install all dependencies:<br />
    `npm install` <br />
    or <br />
    `yarn install`

## Running

To run the application locally, follow these steps:

1.  Navigate to the project's root directory.
2.  In the terminal, run the command:<br />
    `npm run build`<br />
    next<br />
    `npm run dev`

Now application should work on http://localhost:3333/api.

# Testing

Test are made using Jest, Mockito and TestContainers. There are unit tests for every layer of our backend app, one integration test and one e2e test.
To run all tests open terminal and run the command:
`npm run test`

# Endpoints

Routes:

1. `/api/currency`:
   Getting all available currencies from database as an array of strings with their names.<br />

   Example: [USD, PLN, CHF]

2. `/api/currency/:nameOfCurrency`:<br />
   Getting all exchange rates for choosen currency.<br />

   Example: `/api/currency/USD`:<br />
   `{ "exchangeRates": [{ "currency": "PLN", "exchangeRate": 3.77 }]}`

3. `/api/currency/:nameOfCurrency?compare_to=<nameOfCurrency>`:<br />
   Getting ratio between 2 given currencies.<br />

   Example: `/api/currencies/GBP?compare_to=PLN`:<br />
   `{ "exchangeRate": 3.77 }`
