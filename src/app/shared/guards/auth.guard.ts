import {ActivatedRouteSnapshot, CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';

export const authGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']).then();
  }

  const roles = childRoute.data['roles'];

  if (!roles || !roles.length) {
    return true;
  }

  if (!authService.user.roles.find(r => roles.includes(r.normalizedName))) {
    router.navigate(['/']).then();
  }

  return true;
};
