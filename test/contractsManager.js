var ContractsManager = artifacts.require("./ContractsManager.sol");
var Reverter = require('./helpers/reverter');
var BigNumber = require('bignumber.js');

contract('ContractsManager', (accounts) => {
  let reverter = new Reverter(web3);

  afterEach('revert', reverter.revert);

  before('init test suite', (done) => {
    ContractsManager.deployed().then(function(instance) {
      instance.init(accounts[0], accounts[0]);
    }).then(() => {
      reverter.snapshot(done);
    });
  });


  it('removeAddress() should remove contract address correctly', () => {
    const A1 = '0x0000000000000000000000000000000000000001';
    const A2 = '0x0000000000000000000000000000000000000002';

    let manager;

    // STEP 1. add A1 and A2
    return ContractsManager.deployed().then(instance => {
      manager = instance;
      return manager.setAddress(A1);
    }).then((tx) => {
      //console.log(JSON.stringify(tx));
      return manager.getAddress.call(new BigNumber(1));
    }).then(address => {
      assert.equal(A1, address);
      return manager.setAddress(A2);
    }).then((tx) => {
      //console.log(JSON.stringify(tx));
      return manager.getAddress.call(new BigNumber(2));
    }).then(address => {
      assert.equal(A2, address);

      // STEP 2.  get contracts IDs, it should be 1 and 2
      return manager.getContractId.call(A1)
    }).then((id) => {
      assert.equal(1, id.toNumber());
      //console.log(id.toNumber());
      return manager.getContractId.call(A2);
    }).then(id => {
      assert.equal(2, id.toNumber());

      // STEP 3. remove A1
      return manager.removeAddress(A1);
    }).then(tx => {
      return manager.getAddress.call(1);
    }).then(address => {
      // should be A2
      assert.equal(A2, address);
      // check A2 ID
      return manager.getContractId.call(A2);
    }).then(id => {
      // should be 1 !!!
      assert.equal(1, id.toNumber());
      console.log(id.toNumber());
    });

  })


});