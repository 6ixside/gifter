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
    const sock = this.socket('http://localhost:3000');
    sock.on('connection', function() {
      console.log("Socket connected");
    });

    sock.on('error', function() {
        
    });

    sock.on('message', function(msg) {
      console.log(msg);
    });

    sock.on('disconnect', function() {
      console.log("Socket disconnected");
    });
  }
}
