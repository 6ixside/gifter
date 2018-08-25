const IPFS = require('ipfs');
const fs = require('fs');

const node = new IPFS();

node.on('ready', async () => {
	fs.readFile('./ctire.png', async (err, data) => {
		if(err){
			console.log(err);
			return;
		}

		let file =  await node.files.add({
			path: 'canadian_tire.png',
			content: data
		});

		console.log(file);
		console.log('Added file:', file[0].path, file[0].hash)
	});
});

//QmNtW2eFMCTGR3CY7237BGobYpdpj7NGo8igMn7dy3C1Le canadian tire