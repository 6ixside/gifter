import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router'; 
import { AccountService } from './../shared/services/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

	public email: String;
	public username: String;
	public password: String;

  constructor(public as: AccountService, public router: Router){

  }

  ngOnInit() {

  }

  createAccount(){
  	console.log(this.email);
  	console.log(this.username);
  	console.log(this.password);

  	this.as.createAccount(this.password);
  }

}
