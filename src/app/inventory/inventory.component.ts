import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/services/card.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

	public inventory: Array<Object>;

  constructor(public cs: CardService){
  	this.inventory = [{test: 'a'},{test: 'b'},{test: 'c'}];

  	this.cs.loading.subscribe(loading => {
  		if(!loading)
  			this.cs.getNextCards();
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

}
