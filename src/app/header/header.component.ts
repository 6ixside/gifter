import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'gifter-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	public public_key: String;

  constructor(public as: AccountService){
  	console.log(this.as.accounts);
  	this.public_key = this.as.accounts[0];
  }

  ngOnInit() {
  }

}
