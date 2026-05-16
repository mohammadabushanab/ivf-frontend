import { inject, Injectable, signal } from '@angular/core';
import { Patient } from '../../models/patient';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private http = inject(HttpClient);


  async get(patient: Patient): Promise<Patient[]> {

    try {

      const request = this.http.post<Patient[]>(
        'http://localhost:8080/api/patient/find-by-search-criteria',
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
        'http://localhost:8080/api/patient/add',
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
        'http://localhost:8080/api/patient/update',
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
        'http://localhost:8080/api/patient/delete',
        {
          body:patient
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

