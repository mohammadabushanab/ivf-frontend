import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  private requestCount = 0;

  isLoading = signal(false);

  show() {

    this.requestCount++;

    this.isLoading.set(true);

    console.log("show")
  }

  hide() {

    console.log("hide")
    this.requestCount--;

    if (this.requestCount <= 0) {

      this.requestCount = 0;

      this.isLoading.set(false);
    }
  }
}
