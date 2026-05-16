import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DashboardData } from '../../models/dashboard-data';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private http = inject(HttpClient);

  async get(): Promise<DashboardData | null> {

    try {

      const request = this.http.get<DashboardData>(
        'http://localhost:8080/api/dashboard/find-all'
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
