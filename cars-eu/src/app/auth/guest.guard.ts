import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean | UrlTree {
    if (!!localStorage.getItem('id')) {
      return true;
    }
    return this.router.createUrlTree(['user/login']);
  }
}
