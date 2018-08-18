import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import * as blockies from 'ethereum-blockies-png';

@Component({
  selector: 'gifter-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	public public_key: string;
  public user: string;
  public icon: any;

  constructor(public as: AccountService){
    try{
  	  this.public_key = this.as.accounts[0];
    } catch(e){
      console.log(e);
    }

    this.as.accountState['USER'].subscribe((res) => {
      this.user = res;
    });

    this.icon = blockies.createDataURL({
      seed: this.public_key
    });
  }

  ngOnInit() {
    console.log(this.icon);
  }

}
