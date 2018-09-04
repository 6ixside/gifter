//low level deploy script
var fs = require('fs');
var Web3 = require("web3");
var net = require("net");
var EthereumTx = require('ethereumjs-tx');
var EthereumUtil = require('ethereumjs-util');

var abi = JSON.parse(fs.readFileSync('./CardUtil.abi'));
var con = fs.readFileSync('./CardUtil.bin');

//you are dumb if you try to steal this pk because we only use this address on the rinkeby testnet
var pk = new Buffer('c32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536', 'hex');

//create a new Web3 object
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

var contract = new web3.eth.Contract(abi);

var acc = web3.eth.accounts.privateKeyToAccount('0xc32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536');

web3.eth.getTransactionCount(acc.address).then(data => {

	let deploy = contract.deploy({
		data: '0x' + con,
		arguments: ['0x8bF785d9c9a0490778f9480582037832362a3737']
	}).encodeABI();

	var trx = new EthereumTx({
		nonce: web3.utils.toHex(data),
		from: '0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681',
		gas: web3.utils.toHex(5000000),
		gasPrice: web3.utils.toHex(1000000000),
		data: deploy
	});
	trx.sign(pk);

	var serializedTrx = '0x' + trx.serialize().toString('hex')

	web3.eth.sendSignedTransaction(serializedTrx, (err, res) => {
					if(err)
						console.log(err);

					console.log(res);
				}).on('transactionHash', function(hash){
					    console.log('hash: ' + hash);
					})
					.on('receipt', function(receipt){
					    console.log('receipt: ' + receipt);
					})
					.on('confirmation', function(confirmationNumber, receipt){
						console.log('confirmation number: ' + confirmationNumber);
					})
					.on('error', console.error);
})

