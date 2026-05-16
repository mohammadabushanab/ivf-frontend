import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  async generateQrDataUrl(text: string, size: number): Promise<string> {
    try {
      const data = await QRCode.toDataURL(text, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return data;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}