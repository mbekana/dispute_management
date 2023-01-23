
import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
          .pipe(
                catchError((error: HttpErrorResponse) => {
                   let errorMsg = '';
                   if (error.error instanceof ErrorEvent) {
                      console.log('This is client side error');
                      errorMsg = `Error: ${error.error.message}`;
                   } else {
                      console.log('This is server side error');
                      errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                   }
                   console.log(errorMsg);
                   return throwError(errorMsg);
                })
          )
 }
}
