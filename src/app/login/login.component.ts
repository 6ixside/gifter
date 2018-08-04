import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { AccountService } from '../shared/services/account.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@Input() username: String;
  @Input() password: String;

  constructor(public as: AccountService, public router: Router){

  }

  ngOnInit(){

  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(e: KeyboardEvent){
    if(e.keyCode === 13) //enter pressed
      this.sendAuth();
  }

  sendAuth() {
    let username = this.username;
    let password = this.password;

    this.as.login(password).then((data) => {
      this.router.navigate(['/home']);
    }, (err) => {
      console.log(err);
    });
  }


}
