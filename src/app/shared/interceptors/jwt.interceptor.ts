import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.token;
  const customer = authService.customer;
  const property = authService.property;

  let headers = req.headers;

  if (property)
    headers = headers.set('X-Property', property.id);
  if (customer)
    headers = headers.set('X-Customer', customer.id);

  const dupReq = req.clone({
    headers: headers,
    withCredentials: true,
  });

  return next(dupReq);
};
