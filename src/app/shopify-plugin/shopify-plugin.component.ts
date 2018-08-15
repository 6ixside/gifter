
import { Component, OnInit } from '@angular/core';
import { ShopifyService } from '../shared/services/shopify.service';

@Component({
  selector: 'app-shopify-plugin',
  templateUrl: './shopify-plugin.component.html',
  styleUrls: ['./shopify-plugin.component.css']
})
export class ShopifyPluginComponent implements OnInit {

  constructor(public shopifyService: ShopifyService) { 
    this.shopifyService.listen();
  }

  ngOnInit() {
  }

}
