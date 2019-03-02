/// <reference types = "chrome"/>
import { Injectable } from '@angular/core';
import Socket from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  public socket = Socket;

  constructor(){
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("message from: " + sender);

      if(request.type == "GIFTER_MESSAGE"){
        sendResponse({res: "received"});
      }
    });
  }

  public listen() {
    /*const sock = this.socket('http://localhost:4200');

    console.log('opening socket');
    sock.open();

    sock.on('connection', function() {
      console.log("Socket connected");
    });*/
  }
}
