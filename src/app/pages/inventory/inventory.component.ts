import { Component, OnInit } from '@angular/core';
import { CardService } from '../../shared/services/card.service';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router'; 

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
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
  		this.inventory = data;
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
