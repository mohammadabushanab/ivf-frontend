import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard-service';
import { DashboardData } from '../../models/dashboard-data';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  dashboardData = signal<DashboardData | null>(null);

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  
  currentUser = this.authService.getUser();

  async ngOnInit(): Promise<void> {
    const data = await this.dashboardService.get();
    this.dashboardData.set(data);
  }
}
