import { type ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Configuration } from './api';
import { environment } from '../environments/environment';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideHotToastConfig(),
    {
      provide: Configuration,
      useFactory: () => {
        return new Configuration({
          basePath: environment.BASE_URL,
          // credentials: { 'bearer': () => }
        })
      },
    }
  ]
};
