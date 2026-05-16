import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DashboardData } from '../../models/dashboard-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  async get(): Promise<DashboardData | null> {

    try {

      const request = this.http.get<DashboardData>(
        this.apiUrl + '/api/dashboard/find-all'
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error('Error fetching patients:', error);
      return null;
    }
  }
}
