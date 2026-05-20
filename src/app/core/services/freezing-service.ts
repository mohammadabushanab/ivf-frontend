import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Freezing } from '../../models/Freezing';

@Injectable({
  providedIn: 'root',
})
export class FreezingService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

    async getBySearchCriteria(freezing:Freezing): Promise<Freezing[] | null> {

    try {

      const request = this.http.post<Freezing[]>(
        this.apiUrl + '/api/freezing/find-by-search-criteria',
        freezing
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error('Error fetching patients:', error);
      return null;
    }
  }

  async getTotalByType(freezing:Freezing): Promise<number> {

    try {

      const request = this.http.post<number>(
        this.apiUrl + '/api/freezing/find-total-by-type',
        freezing
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error('Error fetching patients:', error);
      return 0;
    }
  }
}
