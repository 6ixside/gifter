//low level deploy script
var fs = require('fs');
var Web3 = require("web3");
var net = require("net");

var con = fs.readFileSync('../contracts/ownable.bin');

//create a new Web3 object
var web3 = new Web3(new Web3.providers.IpcProvider('../rinkeby_test/geth.ipc', net));


console.log(web3.eth.getCoinbase().then(()=>{}, (err)=>{console.log(err);}));
