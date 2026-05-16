import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();

  console.log("url : " + req.url);
  console.log("token :" + token);

  if (req.url.includes('/login')) {
    return next(req);
  }


  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: "Bearer " + token
    }
  });

  return next(cloned);
};
