import { Component, inject, Input } from '@angular/core';
import { LoaderService } from '../../core/services/loader-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  loaderService = inject(LoaderService);
}
