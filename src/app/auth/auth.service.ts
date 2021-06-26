import { HttpClient } from "@angular/common/http";
import { error } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({providedIn: 'root'})
export class AuthService {
  // Variables
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userID : string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  // Return token
  getToken(){
    return this.token;
  }

  // Return authentication status
  getIsAuth(){
    return this.isAuthenticated;
  }

  // return the userID
  getUserID(){
    return this.userID;
  }

  // Return the Auth Status Listener
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  // Create a new user
  createUser(email: string, password: string){
    // Constant to hold the auth data using the auth data model
    const authData : AuthData = {email: email, password: password};
    // Send an HTTP POST request to the specified URL
    this.http
      .post(BACKEND_URL + "signup", authData)
      .subscribe(() => {
        // Change page when successful
        this.router.navigate(['/']);
      }, error => {
        // Set authStatusListener to false
        this.authStatusListener.next(false);
      });
  }

  // Login a user
  loginUser(email: string, password: string) {
    // Constant to hold the auth data using the auth data model
    const authData : AuthData = {email: email, password: password};
    // Send an HTTP POST request to the specified URL
    this.http.post<{token: string, expiresIn: number, userID : string}>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        // Assign the token from the login response to the token variable
        const token = response.token;
        this.token = token;
        // If a valid token is present, set the condtions for it
        if(token) {
          // Set expiration time
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          // Set authentication status true
          this.isAuthenticated = true;
          this.userID = response.userID;
          this.authStatusListener.next(true);
          // Set new expiration date
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          // Save all auth data using the saveAuthData() method
          this.saveAuthData(token, expirationDate, this.userID);
          console.log(expirationDate);
          this.router.navigate(['/']);
        }
      }, error => {
       // Set authStatusListener to false
       this.authStatusListener.next(false);
      });
  }

  // Method to check auth information
  autoAuthUser(){
    // Check if auth data is present
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    // Check if token has not expired
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      // If token not expired, provide auth information
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }

  // Logout a user
  logout(){
    // Bascially just removing all auth data
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userID = null;
    this.router.navigate(['/']);
  }

  // This is a method to log a user out after a specified amount of time
  private setAuthTimer(duration: number){
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Method to save Auth Data to local storage
  private saveAuthData(token: string, expirationDate: Date, userID : string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userID", userID);
  }

  // Method clear Auth Data from local storage
  private clearAuthData(){
    localStorage.removeItem("token", );
    localStorage.removeItem("expiration");
    localStorage.removeItem("userID");
  }

  // Method to retrieve Auth Data from local storage
  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userID = localStorage.getItem("userID");
    // Return if no token or expiration date is present
    if(!token || !expirationDate) {
      return;
    }
    // Otherwise return the auth data information
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userID: userID
    }
  }
}
