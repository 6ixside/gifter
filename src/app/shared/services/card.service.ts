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

  //TODO: move contracts to a config file
  private contracts: Object = {
    'card_factory': {
      'path': 'assets/card_factory.abi',
      'address': '0x5f65Fc6112f2A86614C9710d2f2B5106c6A2bFBB'
    },

    'company_factory': {
      'path': 'assets/CompanyFactory.abi',
      'address': '0x8bF785d9c9a0490778f9480582037832362a3737'
    },

    'card_util': {
      'path': 'assets/CardUtil.abi',
      'address': '0x33E46a87A2Eabdc7de66B494848f91f4D45be35E'
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

  constructor(public http: HttpClient, public as: AccountService){
    this.index = 0;
    this.lastLoadIndex = 0;
    this.loadAmount = 5;
    this.rowSet = [];

    let cf_abi_url;

    try{
  	  cf_abi_url = this.extension.runtime.getURL('/assets/card_factory.abi');
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

      /*this.loading.next(true);
      this.http.get('http://localhost:4200/assets/card_factory.abi', {
        withCredentials: true
      }).subscribe((res) => {
        console.log(res);
        this.cf_abi = res;
        this.cf_contract = new this.web3.eth.Contract(this.cf_abi, '0x5f65Fc6112f2A86614C9710d2f2B5106c6A2bFBB');
        this.loading.next(false);
      });*/
    }

    if(cf_abi_url){
      this.loading.next(true);
    	fetch(cf_abi_url).then((res) => {
    		this.http.get(res.url, {
    			withCredentials: true
    		}).subscribe((res) => {
    			this.cf_abi = res;
    			console.log(this.cf_abi);

    			this.cf_contract = new this.web3.eth.Contract(this.cf_abi, '0x5f65Fc6112f2A86614C9710d2f2B5106c6A2bFBB');
    			console.log(this.cf_contract);

          this.loading.next(false);
    		});
    	});
    }
  }

  public async createCard(company, companyAddress = '0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681', cardPosition = 0){
    console.log('getting next cards');
    this.as.getValidationArgs(this.as.accounts[0], '0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681', 0).then(async (signs) => {
      console.log('validation hash');
      console.log(signs);

      //passes v r s as third fourth and fifth params
    	let method = this.contracts['card_util']['contract'].methods.purchaseCard(companyAddress, cardPosition, [signs[0]], [signs[1]], [signs[2]]);
    	let trx_encode = method.encodeABI();
    	let nonce = await this.web3.eth.getTransactionCount(this.as.accounts[0]);

    	let trx = this.as.createTransactionObject({
    		nonce: this.web3.utils.toHex(nonce),
    		from: this.as.accounts[0],
    		to: '0x33E46a87A2Eabdc7de66B494848f91f4D45be35E',
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
    var quantity = this.loadAmount;

    let method = this.contracts['card_util']['contract'].methods.getInventory(this.as.accounts[0]);
    //let method = this.cf_contract.methods.inventories(this.as.accounts[0], 0);
    let trx_encode = method.encodeABI();

    var _rowset = []

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

      console.log(cs);

      if(cs && cs.length > 0){
        _rowset = self.rowSet.concat(cs);
        self.cardSet.next(_rowset);
      }
    }, (err)=> {
      console.log("inv error");
      console.log(err);
    });
  }

  public next(): IteratorResult<Object>{
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
