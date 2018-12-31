import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import Extension from 'extensionizer';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
	public extension = Extension;
	public friends: Array<Object> = [];
	public friendObservable: BehaviorSubject<Array<Object>> = new BehaviorSubject<Array<Object>>([]);

  constructor(){
  	this.loadFriends();
  }

  public addFriend(address){
  	this.friends.push({
  		address: address,
  		nickname: '',
  		icon: ''
  	});

  	this.updateFriends();
  }

  public deleteFriend(address){
  	for(var i in this.friends){
  		if(this.friends[i]['address'] = address)
  			delete this.friends[i];
  	}

  	this.updateFriends();
  }

  public setNickname(address, name){
  	this.friends[address]['nickname'] = name;

  	this.updateFriends();
  }

  public loadFriends(){
  	let localStorage = this.extension.storage ? this.extension.storage.local : window.localStorage;

  	if(!this.extension.storage){
  		this.friends = localStorage['FRIENDS'];
  	}
  	else{
  		localStorage.get('FRIENDS', (result) => {
  			this.friends = result['FRIENDS'];
  		});
  	}

  	this.friendObservable.next([{address: '0xabcdefg', nickname: 'test1'},
																{address: '0x1234567', nickname: 'test2'},
																{address: '0x1234567', nickname: 'test3'},
																{address: '0x1234567', nickname: 'test4'}]);
  }

  private updateFriends(){
  	let localStorage = this.extension.storage ? this.extension.storage.local : window.localStorage;

  	if(!this.extension.storage){
  		localStorage.setItem('FRIENDS', this.friends);
  	}
  	else{
  		try{
	  		localStorage.set({'FRIENDS': this.friends});
	  	} catch(e){
	  		if(e == this.extension.runtime.lastError)
	  			console.log("chrome runtime error");
	  		else
	  			console.log("cant update friends");
	  	}
  	}

  	//reload the relevant ui stuff after updating data
  	this.loadFriends();
  }
}
