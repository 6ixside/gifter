import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

	private message: String;

  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, public router: Router){
  	this.message = data.message;
  }

  ngOnInit() {

  }

  confirm(){
  	this.dialogRef.close(1);
  }

  deny(){
  	this.dialogRef.close(0);
  }

}
