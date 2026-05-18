import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @ViewChild('messageTemplate')
  messageModal!: TemplateRef<any>;

  @ViewChild('changePasswordTemplate')
  changePasswordModal!: TemplateRef<any>;

  currentModalRef!: NgbModalRef;

  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(NgbModal);


  isNavbarOpend: boolean = true;

  messageText: string = "";

  confirmedPassword: string = "";

  userForChangePassword: User = this.newUser();
  currentUser = this.authService.getUser();
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openChangePasswordModal() {
    this.open(this.changePasswordModal, 'lg');
  }

  async changePassword() {
    this.userForChangePassword.email = this.authService.getUser()?.email || '';

    if (this.userForChangePassword.newPassword != this.confirmedPassword) {
      this.messageText = "New password and confirm password do not match";
    }
    else {
      const result = await this.authService.changePassword(this.userForChangePassword);

      if (result) {
        this.messageText = "Your Request has been submitted successfully";
        this.closeModal();
      }
      else {
        this.messageText = "The current password you entered is incorrect";
      }
    }

    this.open(this.messageModal, 'lg')
  }

  open(content: TemplateRef<any>, size: string) {
    this.currentModalRef = this.modalService.open(content, {
      size: size,
      ariaLabelledBy: 'modal-basic-title'
    });
  }

  closeModal() {
    this.currentModalRef.close();
  }

  newUser(): User {
    return {
      id: '',
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
      token: '',
      isLoggedIn: false,
      newPassword: ''
    }
  }

}
