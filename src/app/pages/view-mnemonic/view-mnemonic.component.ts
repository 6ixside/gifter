import { Component, OnInit } from '@angular/core';
import { AccountService } from './../../shared/services/account.service';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmationModalComponent } from './../../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-view-mnemonic',
  templateUrl: './view-mnemonic.component.html',
  styleUrls: ['./view-mnemonic.component.scss']
})
export class ViewMnemonicComponent implements OnInit {

	private mnemonic: Array<String>;

  constructor(public as: AccountService, public dialog: MatDialog, public router: Router){
  	this.as.getMnemonic().then((mnemonic: String) => {
  		this.mnemonic = mnemonic.split(' ');

  		console.log(this.mnemonic);
  	});
  }

  ngOnInit() {

  }

  continue(){
  	this.dialog.open(ConfirmationModalComponent, {
  		data: {
  			message: 'Please make sure you have <b>copied</b> the phrase before proceeding. <br/> <br/> Are you sure you want to proceed?'
  		}
  	}).afterClosed().subscribe((res) => {
  		if(res)
  			this.router.navigate(['/home']);
  		else
  			console.log('denied');
  	});
  }

}
