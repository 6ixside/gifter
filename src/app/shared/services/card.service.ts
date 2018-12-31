import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
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

  //TODO: move contracts to a config file
  //TODO: make a contract loading service
  private contracts: Object = {
    'card_factory': {
      'path': 'assets/card_factory.abi',
      'address': '0x5f65Fc6112f2A86614C9710d2f2B5106c6A2bFBB'
    },

    'company_factory': {
      'path': 'assets/CompanyFactory.abi',
      'address': '0x1682DE4D8BcD8BdC5fa86e8b4Ee1263d81212CFa'
    },

    'card_util': {
      'path': 'assets/CardUtil.abi',
      'address': '0x28Cb86612875cA99A12ae01924F6311d5b077CD4'
    }

  };

  //iterator variables for getting user cards
  public index: number;
  public lastLoadIndex: number;
  public loadAmount: number;
  public cardSet: BehaviorSubject<Array<Object>> = new BehaviorSubject<Array<Object>>([]);
  public rowSet: Array<Object>;

  //other
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingObserver: Observable<boolean> = this.loading.asObservable();

  constructor(public http: HttpClient, public as: AccountService){
    this.index = 0;
    this.lastLoadIndex = 0;
    this.loadAmount = 5;
    this.rowSet = [];

    let abi_url;

    try{
      console.log("extension mode, loading contracts");
      this.loading.next(true);
  	  //cf_abi_url = this.extension.runtime.getURL('/assets/card_factory.abi');

      for(var con in this.contracts){
        abi_url = this.extension.runtime.getURL('/' + this.contracts[con]['path']);

        fetch(abi_url).then((res) =>{
          this.http.get(res.url, {
            withCredentials: true
          }).subscribe((res) =>{
            this.contracts[con]['contract'] = new this.web3.eth.Contract(res, this.contracts[con].address);
            this.loading.next(false);
          });
        });
      }

    } catch(e){
      this.loading.next(true);

      for(var con in this.contracts){
        this.http.get('http://localhost:4200/' + this.contracts[con].path, {
          withCredentials: true
        }).subscribe((res: any) => {
          this.contracts[con]['contract'] = new this.web3.eth.Contract(res, this.contracts[con].address);
          this.loading.next(false);
        })
      }
    }
  }

  public async createCard(company, companyAddress = '0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681', cardPosition = 0){
    console.log('getting next cards');
    console.log(this.as.accounts[0]);

    this.as.getValidationArgs(this.as.accounts[0], companyAddress, 0).then(async (signs) => {
      console.log('validation hash');
      console.log(signs);

      //passes v r s as third fourth and fifth params
    	//let method = this.contracts['card_util']['contract'].methods.purchaseCard(this.as.accounts[0], companyAddress, cardPosition, [signs[0]], [signs[1]], [signs[2]]);
      let method = this.contracts['card_util']['contract'].methods.purchaseCard(this.as.accounts[0], companyAddress, cardPosition, [signs[0]], [signs[1]], [signs[2]]);
    	let trx_encode = method.encodeABI();
    	let nonce = await this.web3.eth.getTransactionCount(this.as.accounts[0]);

      /*console.log('ec test');
      method.call().then((data) => {
        console.log(data);
      });*/

    	let trx = this.as.createTransactionObject({
    		nonce: this.web3.utils.toHex(nonce),
    		from: this.as.accounts[0],
    		to: '0x28Cb86612875cA99A12ae01924F6311d5b077CD4',
    		gas: this.web3.utils.toHex(5000000),
    		gasPrice: this.web3.utils.toHex(1000000000),
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
    });
  }

  public resetIndex(){
    this.index = 0;
    this.lastLoadIndex = 0;
  }

  public getNextCards(){
    var self = this;
    var offset = this.lastLoadIndex;
    //var quantity = this.loadAmount; //probably won't do quantity, only load 4 at a time

    let method = this.contracts['card_util']['contract'].methods.getInventory(this.as.accounts[0]); //, offset);
    //let method = this.cf_contract.methods.inventories(this.as.accounts[0], 0);
    let trx_encode = method.encodeABI();

    var _rowset = [];
    var _dataSet = [];

    //temporary this is essentially likecalling resetindex
    //self.rowSet = [];
    self.index = 0;

    method.call().then((data) => {
      var cards = data;
      console.log('inventories');

      console.log(cards);

      let cs = [];
      for(var i = 0; i < cards[0].length; i++){
        cs.push({
          name: cards[0][i],
          balance: cards[1][i],
          canTrade: cards[2][i],
          id: cards[3][i]
        })
      }

      if(cs && cs.length > 0){
        _rowset = self.rowSet.concat(cs);
        self.rowSet = _rowset;

        self.cardSet.next(self.rowSet);
      }

      offset += 4;
    }, (err)=> {
      console.log("inv error");
      console.log(err);
    });
  }

  public next(): IteratorResult<Object>{
    console.log(this.index);
    console.log(this.rowSet.length);
    console.log(this.rowSet);

    if(this.index < this.rowSet.length){
      return{
        done: false,
        value: this.rowSet[this.index++]
      }
    }
    else{
      return{
        done: true,
        value: null
      }
    }
  }

  public decodeCard(identifier){
    //todo
  }

  //temporary function, need to build a nonce generating functionality
  public getRandomNonce(){
  	return Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
  }
}
