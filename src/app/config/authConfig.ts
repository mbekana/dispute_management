import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  redirectUri: window.location.origin + '/',
  clientId: 'frontend',
  scope: 'openid profile email',
  issuer: 'http://**.*.**.**:***/auth/realms/enat',
  responseType: 'code',
  showDebugInformation: true,
  requireHttps: false,
};
