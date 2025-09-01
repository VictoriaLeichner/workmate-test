import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRole = route.data['role'] as string | undefined;
    if (!expectedRole) return true;
    const role = this.auth.getRole();
    if (role === expectedRole) return true;
    return this.router.parseUrl('/products');
  }
}
