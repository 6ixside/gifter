import { Component, OnInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CreateAccountModalComponent} from '../create-account-modal/create-account-modal.component';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router'; 
import { AccountService } from './../../shared/services/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

	@Input() email: String;
  @Input() user: String;
  @Input() password: String;
  @Input() confirmPassword: String;
  mnemonic: String;

  constructor(public as: AccountService, public router: Router, public dialog: MatDialog){
  }

  ngOnInit() {
  }

  openDialog(){
 
  }

  async createAccount(){
      await this.as.createAccount(this.email, this.user, this.password);
      this.router.navigate(['/mnemonic']);
  }

  disableCreate(disabled : boolean){
    var button = <HTMLInputElement> document.getElementById("continue_btn");
    button.disabled = disabled;
  }
}
