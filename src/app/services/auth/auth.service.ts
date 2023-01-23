
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private authService: OAuthService) { }

  getUsername() {
    const claims = this.authService.getIdentityClaims();
    if (claims) {
      return null;
    }
    return  (claims as any).given_name;
  }

  public getToken() {
    return localStorage.getItem('access_token');
  }

  getTokenDetails() {
    return jwtDecode(<any>this.getToken());
  }

  getUserRoles() {
    return ((<any>this.getTokenDetails()).realm_access).roles;
  }

  getEmployeeId()
  {
    return (<any>this.getTokenDetails()).employeeID;
  }
}