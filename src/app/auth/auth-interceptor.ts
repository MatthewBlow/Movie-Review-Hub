import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService){}

  // Using the Angular 'HttpInterceptor' to transform an outgoing HTTP request
  // Add the auth token to the header

  intercept(req: HttpRequest<any>, next: HttpHandler){
    // Constant to hold token
    const authToken = this.authService.getToken();
    // Constant to add token to 'authorization' header
    const authRequest = req.clone({
      headers: req.headers.set("authorization", "Bearer " + authToken)
    });
    // Allow request to continue
    return next.handle(authRequest);
  }
}
