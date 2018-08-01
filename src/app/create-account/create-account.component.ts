import { Component, OnInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CreateAccountModalComponent} from '../create-account-modal/create-account-modal.component';
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
  mnemonic: String;

  constructor(public as: AccountService, public router: Router, public dialog: MatDialog){

  }

  ngOnInit() {
  }

  createAccount(){
      this.as.createAccount(this.email, this.username, this.password);
      this.mnemonic = this.as.getMnemonic();
      console.log(this.mnemonic);
      this.openDialog();
  }

  disableCreate(disabled : boolean){
    var button = <HTMLInputElement> document.getElementById("create-account_button");
    button.disabled = disabled;
  }

  openDialog(){
      const modal = this.dialog.open(CreateAccountModalComponent, {
          width : '200px',
          data: {mnemonic : this.mnemonic}
      });

      modal.afterClosed().subscribe(result => {
          console.log("Dialog was closed!");
      });
  }

}
