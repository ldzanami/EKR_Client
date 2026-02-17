import { APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { accessInterceptor } from '../interceptors/access.interceptor';
import { EncryptionService } from '../services/encryption.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([accessInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (service: EncryptionService) => () => {
        return service.getPublicKeyRSA();
      },
      deps: [EncryptionService],
      multi: true,
    }
  ]
};
