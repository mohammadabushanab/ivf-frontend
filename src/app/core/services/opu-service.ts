import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Treatment } from '../../models/treatment';
import { OPU } from '../../models/opu';

@Injectable({
  providedIn: 'root',
})
export class OPUService {
 private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);


  async get(opu: OPU): Promise<OPU[]> {

    try {

      const request = this.http.post<OPU[]>(
        this.apiUrl + '/api/opu/find-by-search-criteria',
        opu
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return [];
    }
  }

  async add(opu: OPU): Promise<OPU | null> {

    try {

      const request = this.http.post<OPU>(
        this.apiUrl + '/api/opu/add',
        opu
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(opu: OPU): Promise<OPU | null> {

    try {

      const request = this.http.put<OPU>(
        this.apiUrl + '/api/opu/update',
        opu
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(opu: OPU): Promise<boolean> {

    try {

      const request = this.http.delete<OPU>(
        this.apiUrl + '/api/opu/delete',
        {
          body: opu
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
