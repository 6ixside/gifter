import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css']
})
export class CreateAccountModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public router: Router) { }

  ngOnInit() {
  }
}
