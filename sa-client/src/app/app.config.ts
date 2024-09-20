import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CurrencyPipe, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch()),
    CurrencyPipe,
    { provide: MessageService, useClass: MessageService },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'shortDate' } },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'GBP' }
  ]
};
