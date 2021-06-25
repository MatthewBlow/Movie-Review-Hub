import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService : AuthService){}

  // Check Auth Satus on initialisation
  ngOnInit(): void {
   this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
     authStatus => {
       this.isLoading = false;
     }
   );
  }


  onLogin(form : NgForm){
    // Check if email and password input is valid
    if(form.invalid){
      return;
    }
    // If valid, login user with email and password
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }

  // Unsubcribe from Auth Status Listener
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
