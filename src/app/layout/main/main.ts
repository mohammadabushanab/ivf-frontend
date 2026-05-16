import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { LayoutService } from '../../core/services/layout-service';
import { Loading } from '../../shared/loading/loading';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
    Loading],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  isSidebarOpen = true;

  constructor(public layoutService: LayoutService) {
    this.layoutService.sidebarOpen$.subscribe(state => {
      this.isSidebarOpen = state;
    });
  }
}
