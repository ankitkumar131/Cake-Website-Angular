import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // Check if the user is logged in and has admin role
      if (user && user.role === 'admin') {
        return true;
      }
      
      // Redirect to login page if not logged in or not an admin
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      
      return false;
    })
  );
}; 