import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {inject} from "@angular/core";
import {SpinnerService} from "../services/spinner.service";

export const loadingInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const spinner = inject(SpinnerService);
  spinner.show();
  return next(req)
    .pipe(finalize(() => spinner.hide()));
};
