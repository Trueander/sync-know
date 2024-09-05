import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpEvent, HttpInterceptorFn, HttpHandlerFn
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {TokenService} from "../service/token.service";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if(token) {
    const decodedToken: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if(decodedToken && decodedToken.exp && decodedToken.exp < currentTime) {
      tokenService.clearOnLogout();
      // this.sweetAlertService.infoAlert('Sesión expirada, vuelva a iniciar sesión');

      return throwError(() => new Error('Token expired'));
    }

    const cloneRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(cloneRequest);
  }
  return next(req);
};
