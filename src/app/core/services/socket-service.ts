import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { environment } from '../../../environments/environment';
import { Treatment } from '../../models/treatment';
import { OPU } from '../../models/opu';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private client!: Client;

  connect(onTreatmentUpdated?: (treatment: Treatment) => void,onOpuUpdated?: (opu: OPU) => void) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');

      if (onTreatmentUpdated) {
        this.client.subscribe('/topic/treatments', message => {
          const treatment: Treatment = JSON.parse(message.body);
          onTreatmentUpdated(treatment);
        });
      }

      if (onOpuUpdated) {
        this.client.subscribe('/topic/opus', message => {
          const opu: OPU = JSON.parse(message.body);
          onOpuUpdated(opu);
        });
      }
    };

    this.client.activate();
  }

  disconnect() {
    this.client?.deactivate();
  }
}