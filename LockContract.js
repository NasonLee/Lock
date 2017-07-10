

var web3 = require('./web3.js')

// import 同目錄的 eventEmitter.js
var eventEmitter = require('./eventEmitter.js')
var lockContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"checkEtherBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"etherValue","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"checkBankBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"etherValue","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"unlock","type":"int256"}],"name":"Unlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"DepositEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"WithdrawEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"TransferEvent","type":"event"}]);
var lock = lockContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000f57600080fd5b5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6105bc806100616000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806316cba9d31461006a5780632e1a7d4d146100935780636a4b3eca146100b6578063a9059cbb146100df578063d0e30db014610121575b600080fd5b341561007557600080fd5b61007d61012b565b6040518082815260200191505060405180910390f35b341561009e57600080fd5b6100b4600480803590602001909190505061014b565b005b34156100c157600080fd5b6100c96102ab565b6040518082815260200191505060405180910390f35b34156100ea57600080fd5b61011f600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506102f3565b005b6101296104cd565b005b60003373ffffffffffffffffffffffffffffffffffffffff163190505b90565b6000670de0b6b3a76400008202905080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156101a657600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156101e657600080fd5b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055507f5bb95829671915ece371da722f91d5371159095dcabf2f75cd6c53facb7e1bab338342604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a15b5050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b90565b6000670de0b6b3a76400008202905080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561034e57600080fd5b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555080600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507fcb71a3252ad21912436b09b5750bead91ebb5d7741322f9934f67cb5608d6d5f60016040518082815260200191505060405180910390a17fbabc8cd3bd6701ee99131f374fd2ab4ea66f48dc4e4182ed78fecb0502e44dd633848442604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200194505050505060405180910390a15b505050565b34600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507fad40ae5dc69974ba932d08b0a608e89109412d41d04850f5196f144875ae2660333442604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a15b5600a165627a7a723058203717d28b288b40835c8677f4cf4e730684517f82eea4c3916f11834dc65ac17a0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
         lock.DepositEvent({}, function (err, event) {
            eventEmitter.emit('DepositEvent:' + event.args.from, event.args)
         })

        lock.WithdrawEvent({}, function (err, event) {
            eventEmitter.emit('WithdrawEvent:' + event.args.from, event.args)
        })

        lock.TransferEvent({}, function (err, event) {
          console.log("TransferEvent launch!!!");
          eventEmitter.emit('TransferEvent:' + event.args.from, event.args)
        })
    }
 })
module.exports = lock

