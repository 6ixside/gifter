import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as IPFS from 'ipfs';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

	public isReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	node: IPFS;

  constructor(){
  	this.node = new IPFS();

  	this.node.on('ready', () => {
  		console.log('node ready')
  		this.isReady.next(true);
  	});
  }

  public getReadyStatus(){
  	/*return new Promise((resolve) => {
  		setTimeout(resolve(), 200);
  	})*/
  }

  public async getFile(hash="QmNtW2eFMCTGR3CY7237BGobYpdpj7NGo8igMn7dy3C1Le"){
  	console.log('getting file');
  	return new Promise((resolve, reject) => {
  		if(this.isReady){
	  		this.node.files.cat(hash).then((data) => {
	  			resolve(data.toString('base64'));
	  		}, (err) => {reject(err);})
	  	}
	  	else
	  		reject('NOT READY');
  	});
  }
}
