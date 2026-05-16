import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProcedureType } from '../../models/procedure-type';
import { PrintConfigurations } from '../../models/print-configurations';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  
private http = inject(HttpClient);

async getProcedureTypes(): Promise<ProcedureType[]> {  

    try {
      
      const request = this.http.get<ProcedureType[]>(
        'http://localhost:8080/api/lookup/find-all-procedure-types'
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  }

  async getPrintConfigurations(): Promise<PrintConfigurations  | null> {  

    try {
      
      const request = this.http.get<PrintConfigurations>(
        'http://localhost:8080/api/lookup/find-print-configurations'
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
