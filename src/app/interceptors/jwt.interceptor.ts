import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.token;

  const dupReq = req.clone({
    headers: req.headers.set('authorization', token ? 'Bearer ' + token : '')
  });

  return next(dupReq);
};
