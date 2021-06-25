import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialog: MatDialog) {}

  // Using the Angular 'HttpInterceptor' to transform an outgoing HTTP request
  // Interceptor to catch and handle all errors that could occur

  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(
      // Using 'catchError' operator from rxjs to catch errors that occur
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occured!";
        // Assigning error message
        if(error.error.message){
          errorMessage = error.error.message;
        }
        // Open a dialog box displaying the error message
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);
      })
    );
  }
}
