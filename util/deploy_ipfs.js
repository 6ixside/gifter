const IPFS = require('ipfs');
const fs = require('fs');

const node = new IPFS();

node.on('ready', async () => {
	fs.readFile('./th.png', async (err, data) => {
		if(err){
			console.log(err);
			return;
		}

		let file =  await node.files.add({
			path: 'tommy_hilfiger.png',
			content: data
		});

		console.log(file);
		console.log('Added file:', file[0].path, file[0].hash)
	});
});

//QmNtW2eFMCTGR3CY7237BGobYpdpj7NGo8igMn7dy3C1Le canadian tire

//QmPU94WFNDgLVM8GK83tn1WUxnySsmyPEdXSeSFtp3XLta tommy hilfiger
//122010C6CF594B689E12ECA4EAD50420654A5BCFC1862AA5AB2FD15F31EC5893694B tommy hilfiger