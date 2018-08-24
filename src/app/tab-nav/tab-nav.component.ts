import { Component, OnInit } from '@angular/core';
import { AccountService } from './../shared/services/account.service';
import { CardService } from './../shared/services/card.service';

@Component({
  selector: 'gifter-tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent implements OnInit {

  constructor(public as: AccountService, public cs: CardService){

  }

  ngOnInit() {

  }

  createCard(){
  	this.cs.createCard('newCard123', 50);
  }

}
