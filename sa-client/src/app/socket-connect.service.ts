import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { Client, Frame, Message } from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

@Injectable({
  providedIn: 'root'
})
export class SocketConnectService {

  constructor() {
    // this.connect();
  }

  connect(): void {
    let ws: WebSocket = new SockJS('http://localhost:8081/websocket');
    const client: Client = Stomp.over(ws);
    const connectCallback = (_: Frame | undefined): void => {
      client.subscribe('/reports', (message: Message): void => {
        if (message.body) {
          const body: { name: string, bytes: string } = JSON.parse(message.body);
          const blob: Blob = new Blob([atob(body.bytes)], { type: 'data:application/octet-stream;base64' });
          const a: HTMLAnchorElement = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${body.name}.csv`;
          a.click();
        }
      });
    };
    const errorCallback = (error: Frame | string) => console.error('Something went wrong on socket', error);
    client.connect({ login: null, host: null }, connectCallback, errorCallback);
  }
}
