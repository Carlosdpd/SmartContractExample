const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//Instance
const provider = ganache.provider();
const web3 = new Web3(provider);

//Gettin interface and bytecode from the compile file
const { interface, bytecode} = require ('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi There!';
const NEW_STRING = 'Bye';

beforeEach( async () => {

  //Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  //Use one of the accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send( {from: accounts[0], gas: '1000000'} );

    inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
      assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it('can change the message', async() => {
    await inbox.methods.setMessage(NEW_STRING).send( {from: accounts[0]} );
    const message = await inbox.methods.message().call();
    assert.equal(message, NEW_STRING);
  });

});


/*class Car {
  park(){
    return 'stopped';
  }

  drive(){
    return 'vroom';
  }
}

let car;

beforeEach(()=> {
  car = new Car();
});

describe('Car', () => {
   it('can park', () => {
     assert.equal(car.park(), 'stopped');
   });

   it('can drive', () => {
     assert.equal(car.drive(), 'vroom');
   });
});*/
