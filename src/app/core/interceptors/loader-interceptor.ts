import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader-service';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  const isBackendRequest = req.url.startsWith(environment.apiUrl);

  if (!isBackendRequest) {
    return next(req);
  }

  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
