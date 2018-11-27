import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common'; 
import * as blockies from 'ethereum-blockies-png';

@Component({
  selector: 'gifter-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() config: object;
	public public_key: string;
  public user: string;
  public icon: any;

  constructor(public router: Router, public location: Location, public as: AccountService){
    try{
  	  this.public_key = this.as.accounts[0];
    } catch(e){
      console.log(e);
    }

    this.user = this.as.user;

    this.icon = blockies.createDataURL({
      seed: this.public_key
    });
  }

  ngOnInit() {
    console.log(this.icon);
    console.log(this.config);
  }

  goToSettings(){
    this.router.navigate(['/settings']);
  }

  goToMain(){
    this.location.back();
  }
}
