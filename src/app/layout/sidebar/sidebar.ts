import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout-service';
@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);

  role = this.authService.getRole();

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

}
