import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Procedure } from '../../models/procedure';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);


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
