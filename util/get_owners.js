//low level deploy script
var fs = require('fs');
var Web3 = require("web3");
var net = require("net");
var EthereumTx = require('ethereumjs-tx');
var EthereumUtil = require('ethereumjs-util');

var abi = JSON.parse(fs.readFileSync('../contracts/CardUtil.abi'));
var con = fs.readFileSync('../contracts/CardUtil.bin');

//you are dumb if you try to steal this pk because we only use this address on the rinkeby testnet
var pk = new Buffer('c32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536', 'hex');

//create a new Web3 object
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

var contract = new web3.eth.Contract(abi, '0x6E123f7f0381c61AD1F47336E154F98aAD193748');

var acc = web3.eth.accounts.privateKeyToAccount('0xc32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536');

let method = contract.methods.getNonce('0xdea289f881d3ebadd842931bee669f328751b6f4', '0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681');

console.log(acc.address);

method.call().then((data) => {
	console.log(data);
})