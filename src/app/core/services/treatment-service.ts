import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Treatment } from '../../models/treatment';

@Injectable({
  providedIn: 'root',
})
export class TreatmentService {
 private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);


  async get(treatment: Treatment): Promise<Treatment[]> {

    try {

      const request = this.http.post<Treatment[]>(
        this.apiUrl + '/api/treatment/find-by-search-criteria',
        treatment
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  async add(treatment: Treatment): Promise<Treatment | null> {

    try {

      const request = this.http.post<Treatment>(
        this.apiUrl + '/api/treatment/add',
        treatment
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(treatment: Treatment): Promise<Treatment | null> {

    try {

      const request = this.http.put<Treatment>(
        this.apiUrl + '/api/treatment/update',
        treatment
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(treatment: Treatment): Promise<boolean> {

    try {

      const request = this.http.delete<Treatment>(
        this.apiUrl + '/api/treatment/delete',
        {
          body: treatment
        }
      );

      const data = await lastValueFrom(request);

      return true;

    }
    catch (error) {
      console.error(error);
      return false;
    }
  }

}
