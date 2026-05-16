import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  async getUsersByRole(user: User): Promise<User[]> {

    try {

      let params = new HttpParams();

      if (user.role) {
        params = params.set('role', user.role);
      }

      const request = this.http.get<User[]>(
        this.apiUrl + '/api/user/find-by-role', { params }
      );

      const data = await lastValueFrom(request);

      return data;

    }
    catch (error) {
      console.error(error);
      return [];
    }
  }
}
