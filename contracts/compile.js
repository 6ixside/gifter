var fs = require('fs');
var solc = require('solc');

var sols = {
	"ownable.sol": fs.readFileSync('ownable.sol', 'utf8'),
	"card_factory.sol": fs.readFileSync('card_factory.sol', 'utf8'),
	"card_trading.sol": fs.readFileSync('card_trading.sol', 'utf8')
};

let compiled = solc.compile({sources: sols}, 1);

for(c in compiled.contracts){
	console.log(c);

	fs.writeFile(c.split('.sol')[0] + '.bin', compiled.contracts[c].bytecode, 'utf8', (err) => {
		if(err)
			console.log("err is: " + err);
	});

	fs.writeFile(c.split('.sol')[0] + '.abi', compiled.contracts[c].interface, 'utf8', (err) => {
		if(err)
			console.log("err is: " + err);
	});
}

//console.log(contractName + ': ' + output.contracts[contractName].bytecode)
//console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface))
