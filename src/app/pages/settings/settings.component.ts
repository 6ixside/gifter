import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../shared/services/account.service';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import * as blockies from 'ethereum-blockies-png';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	public settingsConfig: object = {
		settings: true
	}

  public public_key: string;
  public user: string;
  public email: string;
  public icon: any;

  constructor(public router: Router, public as: AccountService){
    try{
      this.public_key = this.as.accounts[0];
    } catch(e){
      console.log(e);
    }

    this.user = this.as.user;
    this.email = this.as.email;

    this.icon = blockies.createDataURL({
      seed: this.public_key
    });

  }

  ngOnInit(){

  }

}
