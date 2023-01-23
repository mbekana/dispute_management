import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (localStorage.getItem('access_token')) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer '+ localStorage.getItem('access_token')        }
      })
    }
    return next.handle(req)

  }


}


