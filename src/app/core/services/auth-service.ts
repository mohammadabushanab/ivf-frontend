import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  async login(user: User): Promise<boolean> {

    try {
      const request = this.http.post<User>("http://localhost:8080/api/auth/login", user);

      const data = await lastValueFrom(request);

      if (data != null && data.token != null) {
        localStorage.setItem('user', JSON.stringify(data));
        return true;

      }

      return false;
    }
    catch (error) {
      console.error('error:', error);
      return false;
    }
  }

    async changePassword(user: User): Promise<boolean> {

    try {
      const request = this.http.post<User>("http://localhost:8080/api/auth/change-password", user);

      const data = await lastValueFrom(request);

      if (data != null) {
        return true;

      }

      return false;
    }
    catch (error) {
      console.error('error:', error);
      return false;
    }
  }

  getUser(): User | null {

    const userJson = localStorage.getItem('user');

    if (!userJson) {
      return null;
    }

    return JSON.parse(userJson);
  }

  getRole(): string {
    return this.getUser()?.role || '';
  }

  getToken(): string {

    return this.getUser()?.token || '';
  }

  hasToken(): boolean {

    return Boolean(this.getToken());
  }

  logout(): void {

    localStorage.removeItem('user');
  }


}
