var fs = require('fs');
var Web3 = require("web3");
var net = require("net");

var abi = JSON.parse(fs.readFileSync('../contracts/card_factory.abi'));
var web3 = new Web3(new Web3.providers.IpcProvider('../rinkeby_test/geth.ipc', net));
var contract = new web3.eth.Contract(abi, '0xdCAA63BDBB6E6118A1ae2FBca0892170a7Aa040b');

var newCard = contract.methods.createCard('test_company', 250);

web3.eth.getCoinbase().then((coinbase) =>{
	web3.eth.sendTransaction({
		to: '0xdCAA63BDBB6E6118A1ae2FBca0892170a7Aa040b',
		from: coinbase,
		data: newCard,
		gas: 1000000
	}, (err, hash) =>{
		if(err)
			console.log(err);

		console.log('hash is: ' + hash);
	});
});