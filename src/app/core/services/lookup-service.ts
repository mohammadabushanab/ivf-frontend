import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProcedureType } from '../../models/procedure-type';
import { PrintConfigurations } from '../../models/print-configurations';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  async getProcedureTypes(): Promise<ProcedureType[]> {

    try {

      const request = this.http.get<ProcedureType[]>(
        this.apiUrl + '/api/lookup/find-all-procedure-types'
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  }

  async getPrintConfigurations(): Promise<PrintConfigurations | null> {

    try {

      const request = this.http.get<PrintConfigurations>(
        this.apiUrl + '/api/lookup/find-print-configurations'
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
