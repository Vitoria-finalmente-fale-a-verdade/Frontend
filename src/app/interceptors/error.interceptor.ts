import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, EMPTY} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {MessageService} from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.log(err.status);
      if (err.status !== 401 && err.status !== 403) {
        throw err;
      }

      messageService.add({severity: 'warn', summary: 'Não autorizado', detail: 'Entre novamente para continuar'});
      authService.logout();

      return EMPTY;
    })
  );
};
