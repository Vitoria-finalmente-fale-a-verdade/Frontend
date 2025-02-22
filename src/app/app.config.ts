import {ApplicationConfig, ErrorHandler, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { MyTheme } from './theme';
import {GlobalErrorHandlerService} from './services/global-error-handler.service';
import {MessageService} from 'primeng/api';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {errorInterceptor} from './interceptors/error.interceptor';
import {jwtInterceptor} from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
          preset: MyTheme,
          options: {
            darkModeSelector: '.dark-mode'
          }
        }
    }),
    provideHttpClient(
      withInterceptors([errorInterceptor, jwtInterceptor])
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    MessageService
  ]
};
