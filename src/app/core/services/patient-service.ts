import { inject, Injectable, signal } from '@angular/core';
import { Patient } from '../../models/patient';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  async getTotal(): Promise<number> {

    try {

      const request = this.http.get<number>(
        this.apiUrl + '/api/patient/find-total'
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return 0;
    }
  }

  async get(patient: Patient): Promise<Patient[]> {

    try {

      const request = this.http.post<Patient[]>(
        this.apiUrl + '/api/patient/find-by-search-criteria',
        patient
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  async add(patient: Patient): Promise<boolean> {

    try {

      const request = this.http.post<Patient>(
        this.apiUrl + '/api/patient/add',
        patient
      );

      const data = await lastValueFrom(request);

      return true;

    }
    catch (error) {
      console.error(error);
      return false;
    }
  }

  async update(patient: Patient): Promise<Patient | null> {

    try {

      const request = this.http.put<Patient>(
        this.apiUrl + '/api/patient/update',
        patient
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(patient: Patient): Promise<boolean> {

    try {

      const request = this.http.delete<Patient>(
        this.apiUrl + '/api/patient/delete',
        {
          body: patient
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

