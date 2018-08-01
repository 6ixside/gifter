import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css']
})
export class CreateAccountModalComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  route() {
    
  }

}
