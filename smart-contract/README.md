# Smart Contracts

## Deploy and test on local Hyperledger Besu

### Deploy
```
truffle migrate --network besu
```

### Console
```
truffle console --network besu
```
Inside the console, use this to get deployed instance of contract:
```js
let accounts = await web3.eth.getAccounts();
let orange = await Orange.deployed();
```

Some tests:
```js
orange.addCustomer("abc123", "sam", "in1234", "1.2,2.2,3.3");
orange.getCustomer("abc123");
orange.addFlight("abc123", "AB123456", "10-10-2010");
orange.getCustomer("abc123");
```

### Tests

Run tests:
```
truffle test
```