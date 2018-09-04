//low level deploy script
var fs = require('fs');
var Web3 = require("web3");
var net = require("net");
var EthereumTx = require('ethereumjs-tx');
var EthereumUtil = require('ethereumjs-util');

var abi = JSON.parse(fs.readFileSync('../contracts/Company.abi'));
var con = fs.readFileSync('../contracts/Company.bin');

//you are dumb if you try to steal this pk because we only use this address on the rinkeby testnet
var pk = new Buffer('c32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536', 'hex');

//create a new Web3 object
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

var contract = new web3.eth.Contract(abi, '0x5b85e3266a851C25C478e699D7C6E3d853ccaDe7');

var acc = web3.eth.accounts.privateKeyToAccount('0xc32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536');

let method = contract.methods.getCardDnas();

console.log(acc.address);

method.call().then((data) => {
	console.log(data);
})