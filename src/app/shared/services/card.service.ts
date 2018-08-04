import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AccountService } from './account.service';
import Web3 from 'web3';
import KeyringController from 'eth-keyring-controller';
import SimpleKeyring from 'eth-simple-keyring';
import Extension from 'extensionizer';
import EthereumUtil from 'ethereumjs-util';

@Injectable({
  providedIn: 'root'
})
export class CardService {
	/*i like lowercase*/
	public extension = Extension;

	/*sets the provider to the infura rinkeby node*/
	public web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));
	public cf_abi: any;
	public cf_contract: any;

  constructor(public http: HttpClient, public as: AccountService){
  	let cf_abi_url = this.extension.runtime.getURL('/assets/card_factory.abi');

  	fetch(cf_abi_url).then((res) => {
  		this.http.get(res.url, {
  			withCredentials: true
  		}).subscribe((res) => {
  			this.cf_abi = res;
  			console.log(this.cf_abi);

  			this.cf_contract = new this.web3.eth.Contract(this.cf_abi, '0xf47cfaEA90Dc9e0d6487A75aB690A322b8f5A7e7');
  			console.log(this.cf_contract);
  		});
  	});
  }

  public async createCard(company, value){
  	let method = this.cf_contract.methods.createCard(company, value);
  	let trx_encode = method.encodeABI();
  	let nonce = await this.web3.eth.getTransactionCount(this.as.accounts[0]);

  	let trx = this.as.createTransactionObject({
  		nonce: this.web3.utils.toHex(nonce),
  		from: "0x746344ca8847996c3159b67f0aa85d1bea7c133c",
  		to: '0xf47cfaEA90Dc9e0d6487A75aB690A322b8f5A7e7',
  		gas: this.web3.utils.toHex(5000000),
  		gasPrice: this.web3.utils.toHex(50000000000 * 1.5),
  		data: trx_encode
  	});

  	this.as.signTransaction(trx).then((data) => {
  		console.log('data');
  		console.log(data);

  		var rawTrx = EthereumUtil.bufferToHex(data.serialize());
  		console.log(rawTrx);

			this.web3.eth.sendSignedTransaction(rawTrx, (err, res) => {
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
  }

  //temporary function, need to build a nonce generating functionality
  public getRandomNonce(){
  	return Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
  }
}
