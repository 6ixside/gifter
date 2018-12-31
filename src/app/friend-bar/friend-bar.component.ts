import { Component, OnInit } from '@angular/core';
import { FriendService } from '../shared/services/friend.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import * as blockies from 'ethereum-blockies-png';

@Component({
  selector: 'gifter-friend-bar',
  templateUrl: './friend-bar.component.html',
  styleUrls: ['./friend-bar.component.scss']
})
export class FriendBarComponent implements OnInit {

	public friends: Array<Object> = [];

  constructor(private friendSheet: MatBottomSheet, private fs: FriendService){
  	this.fs.friendObservable.subscribe((res) => {
	  		this.friends = res;

	  		for(let f of this.friends){
	  			f['icon'] = blockies.createDataURL({
			      seed: f['address'];
			    });
	  		}

	  		console.log(this.friends);
  	});

  	this.fs.loadFriends();
  }

  ngOnInit(){

  }

  /*openDrawer(){
  	this.friendSheet.open(FriendSheet, {
  		hasBackdrop: false
  	});
  }*/

}

@Component({
  selector: 'friend-sheet',
  templateUrl: 'friend-drawer.component.html',
})
export class FriendSheet {
	constructor(private bottomSheetRef: MatBottomSheetRef<FriendSheet>){

	}
}
