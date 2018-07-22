//different requires
const fs = require("fs");
const Web3 = require("web3");
const solc = require("solc"); 
const net = require("net");

contractFile = "./" + process.argv[2];

const contractInput = fs.readFileSync(contractFile); //contract file
const contractOutput = solc.compile(contractInput.toString(), 1); //use solc to compile the file

var textLines = contractInput.toString().split("\n");

var text;
for(var i = 0 ; i < textLines.length ; i++)
{
  if(textLines[i].includes("contract"))
  {
    text = textLines[i];
    break;
  }
}

var contractLine = text.split(" ");
contractName = contractLine[1];

const byteCode = contractOutput.contracts[":" + contractName].bytecode; //bytecode from the contract to send as data
const abi = JSON.parse(contractOutput.contracts[":" + contractName].interface); //interface from contract to be used with web3 object

var web3 = new Web3(new Web3.providers.IpcProvider('./geth.ipc', net)); //create a new Web3 object

var newContract = new web3.eth.Contract(abi); //create a new Web3 Contract object

web3.eth.getCoinbase().then(function(coinbase){
    newContract.deploy({ //deploy the new contract
      data: "0x" + byteCode,
    })
    .send({
      from : coinbase,
      gas: 4612388
    }, function(err, transactionHash) {})
    .on('error', function(err){console.log(err);})
    .on('transactionHash', function(transactionHash){console.log("The transaction hash is: " + transactionHash);})
    .on('receipt', function(receipt){if(receipt.contactAddress != null) console.log("The contact address is: " + receipt.contactAddress);})
    .on('confirmation', function(confirmationNumber, receipt){console.log("The confirmation number is: " + confirmationNumber)})
    .then(function (newContractInstance){
      console.log(newContractInstance.options.address);
    }); 
});
