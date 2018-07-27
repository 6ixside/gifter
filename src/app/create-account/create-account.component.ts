import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router'; 
import { AccountService } from './../shared/services/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

	@Input() email: String;
	@Input() username: String;
  @Input() password: String;
  @Input() confirmPassword: String;

  constructor(public as: AccountService, public router: Router){

  }

  ngOnInit() {
  }

  createAccount(){
  	  this.as.createAccount(this.email, this.username, this.password);
  }

}
