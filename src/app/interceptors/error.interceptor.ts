import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, EMPTY} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (router.url === '/login' || (err.status !== 401 && err.status !== 403)) {
        throw err;
      }

      messageService.add({severity: 'warn', summary: 'Não autorizado', detail: 'Entre novamente para continuar'});
      authService.logout();

      return EMPTY;
    })
  );
};
