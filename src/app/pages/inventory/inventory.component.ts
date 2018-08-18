import { Component, OnInit } from '@angular/core';
import { CardService } from '../../shared/services/card.service';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router'; 
import BigNumber from 'big-number';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

	public inventory: Array<Object>;

  constructor(public cs: CardService, public router: Router){
  	this.inventory = [];

  	this.cs.loading.subscribe(loading => {
  		if(!loading)
  			this.cs.getNextCards();
  	});

  	this.cs.cardSet.subscribe(data => {
  		this.buildInventory(data);
  	});
  }

  ngOnInit() {
 
  }

  getNext(){
  	var self = this;
  	var results;

  	while(results = this.cs.next(), !results.done){
  		self.inventory = self.inventory.concat(results.value);
  	}

  	this.cs.getNextCards();
  }

  //build up to 4 at a time
  buildInventory(data){
    var c_name = null;
    var h1 = null;
    var decVals = [];

    for(var i = 0; i < data.length; i++){
      c_name = data[i].name.split('');

      while(c_name.length){
        h1 = parseInt(c_name.shift());

        for(var j = 0; h1 || j < decVals.length; j++){
          h1 += (decVals[j] || 0) * 10;
          decVals[j] = h1 % 16;  
          h1 = (h1 - decVals[j]) / 16;
        }
      }

      c_name = '';
      while(decVals.length){
        c_name += String.fromCharCode(parseInt('0x' + decVals.pop().toString(16) + decVals.pop().toString(16)));
      }

      data[i].name = c_name;
      this.inventory.push(data[i]);
    }
  }

}
