//low level deploy script
var fs = require('fs');
var Web3 = require("web3");
var net = require("net");
var EthereumTx = require('ethereumjs-tx');
var EthereumUtil = require('ethereumjs-util');

var abi = JSON.parse(fs.readFileSync('./card_factory.abi'));
var con = fs.readFileSync('./card_factory.bin');

var pk = new Buffer('c32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536', 'hex');

//create a new Web3 object
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

var contract = new web3.eth.Contract(abi);

var acc = web3.eth.accounts.privateKeyToAccount('0xc32daf23b2a37cc7d0238311434ecb64454d74c365a2ec9b70fa9dbfebcca536');

web3.eth.getTransactionCount(acc.address).then(data => {



	var trx = new EthereumTx({
		nonce: web3.utils.toHex(data),
		from: '0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681',
		gas: web3.utils.toHex(5000000),
		gasPrice: web3.utils.toHex(1000000000),
	data: '0x' + con
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
});



/*contract.deploy({
	data: "0x" + con
}).send({
	from: acc.address,
	gas: 2000000
}).on('error', function(err){})
  .on('transactionHash', function(transactionHash){console.log("The transaction hash is: " + transactionHash);})
  .on('receipt', function(receipt){if(receipt.contactAddress != null) console.log("The contact address is: " + receipt.contactAddress);})
  .on('confirmation', function(confirmationNumber, receipt){console.log("The confirmation number is: " + confirmationNumber)})
  .then(function (newContractInstance){
  console.log(newContractInstance.options.address);
   }, function(err){
   		console.log(err);
   });*/