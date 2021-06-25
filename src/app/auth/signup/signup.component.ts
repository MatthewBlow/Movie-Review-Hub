import { error } from "@angular/compiler/src/util";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  // Check Auth Satus on initialisation
  ngOnInit(): void {
   this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
     authStatus => {
       this.isLoading = false;
     }
   );
  }

  onSignup(form : NgForm){
    // Check if email and password input is valid
    if (form.invalid){
      return;
    }
    // If valid, create a new user with the email and password input
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  // Unsubcribe from Auth Status Listener
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
