import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Procedure } from '../../models/procedure';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProceduresCount } from '../../models/procedures-count';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {

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

  async getProceduresCountByType(): Promise<ProceduresCount[] | null> {

    try {

      const request = this.http.get<ProceduresCount[]>(
        this.apiUrl + '/api/procedure/find-procedures-count-by-type'
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error('Error fetching patients:', error);
      return null;
    }
  }


  async get(procedure: Procedure): Promise<Procedure[]> {

    console.log(procedure)

    try {

      const request = this.http.post<Procedure[]>(
        this.apiUrl + '/api/procedure/find-by-search-criteria',
        procedure
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  async add(procedure: Procedure): Promise<Procedure | null> {

    try {

      const request = this.http.post<Procedure>(
        this.apiUrl + '/api/procedure/add',
        procedure
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(procedure: Procedure): Promise<Procedure | null> {

    try {

      const request = this.http.put<Procedure>(
        this.apiUrl + '/api/procedure/update',
        procedure
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(procedure: Procedure): Promise<boolean> {

    try {

      const request = this.http.delete<Procedure>(
        this.apiUrl + '/api/procedure/delete',
        {
          body: procedure
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
