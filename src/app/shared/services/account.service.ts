import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
import KeyringController from 'eth-keyring-controller';
import SimpleKeyring from 'eth-simple-keyring';
import Extension from 'extensionizer';
import EthereumTx from 'ethereumjs-tx'

@Injectable({
  providedIn: 'root'
})
export class AccountService {
	/*i like lowercase*/
	public extension = Extension;

	/*sets the provider to the infura rinkeby node*/
	public web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

	public keyringController: any;
	public keyring: any;
	public accounts: Object;//BehaviorSubject<Object> = new BehaviorSubject<Object>({});
	public keyringState: any;
	public key: String;

	//create an observable that is the state so we can listen to changes
	public accountState: Object = {
		USER: new BehaviorSubject<String>(null),
		EMAIL: new BehaviorSubject<String>(null),
		KEY: new BehaviorSubject<Object>(null)
	};

  constructor(){
  	/*On Instantiation, load the last state of the extension
  	and then instantiate the keyring controller with the
  	resulting state*/
  	this.loadLastState().then((data) => {
  		this.keyringController = new KeyringController({
				keyringTypes: [SimpleKeyring],
				initState: data 
			});

			this.keyringController.signTransaction.bind(this.keyringController);

			console.log(data);
  	}, (err) => {console.log(err);});
  }

  /*Account creation only needs password, this needs to return a public key*/
  public async createAccount(email, username, password){
  	//creates a new keyring
  	this.keyring = await this.keyringController.createNewVaultAndKeychain(password);
  	//gets the new state of the keyring
  	this.keyringState = this.keyringController.store.getState();
  	//sets the state of the keyring in storage to be the latest
  	this.setState(this.keyringState).then((data) => {
  		this.accountState['KEY'].next(this.keyringState);
  		console.log('successfully wrote state');
  		console.log(this.keyringState);
  	}, (err) => {console.log(err)});

  	this.setState({'USER': username}).then((data) => {
  		this.accountState['USER'].next(username);
  	}, (err) => {console.log(err)});

  	this.setState({'EMAIL': email}).then((data) => {
  		this.accountState['EMAIL'].next(email);
		}, (err) => {console.log(err)});
		
		this.generateMnemonic();
  }

  /*Login only needs to verify the password that should be stored in local storage
  TODO: backup login information on disk in case local storage is lost for some reason
  TODO: implement functionality to regenerate vault from mnoemic if both local and disk storage is unavailable*/
  public login(password){
  	//sets the keyrings to the set of all keyrings after unlock (for us should only be cardinality 1)
  	return new Promise((resolve, reject) => {
  		this.keyring = this.keyringController.unlockKeyrings(password).then((data) => {
	  		//get the unlocked accounts
		  	this.keyringController.getAccounts().then(data => {
		  		this.accounts = data;
		  		console.log(data);
		  	});

		  	this.keyringState = this.keyringController.store.getState();
		  	this.keyringController.fullUpdate();

		  	this.setState(this.keyringState).then((data) => {
		  		this.accountState['KEY'].next(this.keyringState);
		  		console.log('successfully wrote state');
		  		console.log(this.keyringState);
		  	}, (err) => {console.log(err)});

		  	resolve();
	  	}, (err) => {
	  		console.log(err);
	  		reject(err);
	  		//do something here to notify user of login issue
	  	});
  	});
  }

  /*Loads the last state from local storage, if local storage doesn't exist, assume undefined last state*/
  public loadLastState(){
  	//chrome's local storage object for extensions
  	let localStorage = this.extension.storage ? this.extension.storage.local : undefined;

  	return new Promise((resolve, reject) => {
  		if(localStorage === undefined)
				resolve(undefined);
			else{
				//gets all the localstorage data
		    localStorage.get(null, (result) => {
		      if(this.extension.runtime.lastError){
		      	console.log(this.extension.runtime.lastError);
		        reject(this.extension.runtime.lastError);
		      } 
		      else
		      	//result contains the vault object that holds the users's credentials
		        resolve(result);
		    });
		  }
  	});
  }

  //sets information pertaining to the user's account
  public setState(state){
  	let localStorage = this.extension.storage.local;

    return new Promise((resolve, reject) => {
      localStorage.set(state, () => {
        if(this.extension.runtime.lastError){
        	console.log(this.extension.runtime.lastError);
          reject(this.extension.runtime.lastError);
        } 
        else{
          resolve();
        }
      });
    });
  }

  public createTransactionObject(trx){
  	return new EthereumTx(trx);
  }

  public signTransaction(trx){
  	return this.keyringController.signTransaction(trx, this.accounts[0]);
	}
	
	public async generateMnemonic(){
		var keyring = this.keyringController.getKeyringsByType('HD Key Tree')[0];
		if(!keyring)
			console.log("Couldn't find an HD key tree");
		
		var serializedKeyring = await keyring.serialize();
		var mnemonic = serializedKeyring.mnemonic; //mnemonic based on the current keyring
		 
		}
	}
