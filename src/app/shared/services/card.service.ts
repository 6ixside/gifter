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

  			this.cf_contract = new this.web3.eth.Contract(this.cf_abi, '0x40c00b710Df95aaf05263828fDebcd0616754cc9');
  			console.log(this.cf_contract);
  		});
  	});
  }

  public createCard(company, value){
  	let method = this.cf_contract.methods.createCard(company, value);
  	let trx_encode = method.encodeABI();

  	let trx = this.as.createTransactionObject({
  		nonce: 11,
  		from: this.as.accounts[0],
  		to: '0x40c00b710Df95aaf05263828fDebcd0616754cc9',
  		gas: 1000000,
  		gasPrice: 20000000000 * 1.2,
  		data: trx_encode
  	});

  	let signedTrx = this.as.signTransaction(trx).then((data) => {
  		var rawTrx = EthereumUtil.bufferToHex(data.serialize());
  		console.log(rawTrx);

  		this.web3.eth.sendSignedTransaction(rawTrx, (err, res) => {
  			if(err)
  				console.log(err);

  			console.log(res);
  		});
  	});
  }
}
