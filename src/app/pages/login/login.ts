import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Loading } from '../../shared/loading/loading';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    Loading
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  errorMessage = signal<string>('');

  user: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: '',
    token: '',
    isLoggedIn: false,
    newPassword: ''
  };

  private authService = inject(AuthService);
  private router = inject(Router);


  async login() {
    this.errorMessage.set("");

    const result = await this.authService.login(this.user);

    console.log(result)

    if (result) {
      this.router.navigate(['/dashboard']);
    }
    else {
      this.errorMessage.set("Invalid email or password");
    }
  }
}

