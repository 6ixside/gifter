import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

	public web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

  constructor(){

  }

  public createAccount(){
  	console.log(this.web3.currentProvider);
  	console.log(this.web3.eth.getBalance("0xBcBf7351C4D8ec9A712600d95Cb6320B669DF681"));
  }

  
}
