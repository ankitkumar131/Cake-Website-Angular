import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getAuthToken();

  // Log that we're processing a request
  console.log(`[Auth Interceptor] Processing request: ${req.url}`);

  // Clone the request and add the authorization header if token exists
  if (token) {
    console.log('[Auth Interceptor] Adding token to request');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Otherwise, proceed with the original request
  console.log('[Auth Interceptor] No token available, proceeding without authentication');
  return next(req);
}; 