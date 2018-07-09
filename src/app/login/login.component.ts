import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@Input() username: String;
  @Input() password: String;

  constructor() { }

  ngOnInit() {

  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(e: KeyboardEvent){
    if(e.keyCode === 13) //enter pressed
      this.sendAuth();
  }

  sendAuth() {
    let username = this.username;
    let password = this.password;

    console.log(username);
    console.log(password);
  }

}
