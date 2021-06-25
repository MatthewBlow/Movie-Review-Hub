import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(private authService : AuthService, private router: Router){}

  // Using the Angular 'CanActivate' interface to guard routes and decided if a user can continue the navigation
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = this.authService.getIsAuth();
    // If auth status is invalid, redirect to the login page
    if(!isAuth){
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }

}
