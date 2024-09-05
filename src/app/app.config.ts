import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./auth/interceptor/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
