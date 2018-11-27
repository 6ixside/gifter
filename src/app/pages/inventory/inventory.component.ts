import { Component, OnInit } from '@angular/core';
import { CardService } from '../../shared/services/card.service';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router'; 
import { IpfsService } from '../../shared/services/ipfs.service';

import { take } from 'rxjs/operators'
import BigNumber from 'big-number';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

	public inventory: Array<Object>;
  public image;

  public dataSet: Array<Object> = [];

  constructor(public cs: CardService, public is: IpfsService, public router: Router){
    console.log("emptying inv");
    this.inventory = [];

    console.log("creating subscription");
    this.cs.loadingObserver.pipe(take(2)).subscribe(loading => {
      console.log("getting next?");

  		if(!loading){
  			this.cs.getNextCards();
      }
  	});

    this.cs.cardSet.subscribe(data => {
      console.log("**data**");
      console.log(data);

      //this.buildInventory(data);
      this.getNext();
    });


    this.is.isReady.subscribe(data => {
      if(data)
        this.getFile();
    });
  }

  ngOnInit(){
    //this.cs.getNextCards();
  }

  ngOnDestroy(){
    console.log("emptying inv again");
    this.inventory = [];
  }

  getFile(){
    var self = this;

    this.is.getFile().then((data) => {
      this.image = 'data:image/png;base64,' + data;
    }, (err) => {
      console.log(err);
    });
  }

  getNext(){
  	var results;

    console.log("here");

  	while(results = this.cs.next(), !results.done){
      console.log(results);
      this.dataSet = new Array<Object>(results)

      this.inventory.push(this.dataSet);
      //self.buildInventory([results.value]);
      console.log(this.inventory);
  	}
  	//this.cs.getNextCards();
  }

  redeem(url = 'https://www.canadiantire.ca'){
    chrome.tabs.create({
      url: url
    });
  }

  //build up to 4 at a time
  buildInventory(data){
    var c_name = null;
    var h1 = null;
    var decVals = [];

    for(var i = 0; i < data.length; i++){
      this.dataSet.push(data[i]);
      c_name = data[i].name.split('');

      while(c_name.length){
        h1 = parseInt(c_name.shift());

        for(var j = 0; h1 || j < decVals.length; j++){
          h1 += (decVals[j] || 0) * 10;
          decVals[j] = h1 % 16;  
          h1 = (h1 - decVals[j]) / 16;
        }
      }

      console.log(decVals);

      c_name = '';
      while(decVals.length){
        c_name += String.fromCharCode(parseInt('0x' + decVals.pop().toString(16) + decVals.pop().toString(16)));
      }

      //this.dataSet[i]['name'] = c_name;
      //this.inventory.push(this.dataSet[i]);
      this.inventory.push({
        name: c_name,
        balance: this.dataSet[i]['balance'],
        canTrade: this.dataSet[i]['canTrade'],
        id: this.dataSet[i]['id']
      });

      console.log(this.inventory);
    }
  }

}
