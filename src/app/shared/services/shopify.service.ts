/// <reference types = "chrome"/>
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {

  constructor() { }

  public listen() {
    //Open up the extension to external messages to be sent from shopify plugin
    chrome.runtime.onMessageExternal.addListener(
      function(message, sender, sendResponse) {
        if(message)
          console.log(message);
      });
  }
}
