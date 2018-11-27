/// <reference types = "chrome"/>
import { Injectable } from '@angular/core';
import Socket from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  public socket = Socket;

  constructor() { }

  public listen() {
    /*const sock = this.socket('http://localhost:4200');

    console.log('opening socket');
    sock.open();

    sock.on('connection', function() {
      console.log("Socket connected");
    });*/
  }
}
