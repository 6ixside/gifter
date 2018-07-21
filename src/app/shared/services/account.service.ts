import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
import KeyringController from 'eth-keyring-controller';
import SimpleKeyring from 'eth-simple-keyring';
import Extension from 'extensionizer';

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

  constructor(){
  	/*On Instantiation, load the last state of the extension
  	and then instantiate the keyring controller with the
  	resulting state*/
  	this.loadLastState().then((data) => {
  		this.keyringController = new KeyringController({
				keyringTypes: [SimpleKeyring],
				initState: data 
			});

			console.log(data);
  	}, (err) => {console.log(err);});
  }

  /*Account creation only needs password, this needs to return a public key*/
  public async createAccount(key){
  	//creates a new keyring
  	this.keyring = await this.keyringController.createNewVaultAndKeychain(key);
  	//gets the new state of the keyring
  	this.keyringState = this.keyringController.store.getState();
  	//sets the state of the keyring in storage to be the latest
  	this.setState(this.keyringState).then((data) => {
  		console.log('successfully wrote state');
  		console.log(this.keyringState);
  	}, (err) => {console.log(err)});
  }

  /*Login only needs to verify the password that should be stored in local storage
  TODO: backup login information on disk in case local storage is lost for some reason
  TODO: implement functionality to regenerate vault from mnoemic if both local and disk storage is unavailable*/
  public async login(pubKey, priKey){
  	//sets the keyrings to the set of all keyrings after unlock (for us should only be cardinality 1)
  	this.keyring = await this.keyringController.unlockKeyrings(priKey);
  	//get the unlocked accounts
  	this.accounts = await this.keyringController.getAccounts();
  	this.keyringState = this.keyringController.store.getState();
  	this.keyringController.fullUpdate();

  	this.setState(this.keyringState).then((data) => {
  		console.log('successfully wrote state');
  		console.log(this.keyringState);
  	}, (err) => {console.log(err)});
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
		        resolve(result);
		    });
		  }
  	});
  }

  public setState(state){
  	let localStorage = this.extension.storage.local;

    return new Promise((resolve, reject) => {
      localStorage.set(state, () => {
        if(this.extension.runtime.lastError){
        	console.log(this.extension.runtime.lastError);
          reject(this.extension.runtime.lastError);
        } 
        else
          resolve();
      });
    });
  }
}
