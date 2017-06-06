import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { 
  Router, 
  RouteConfigLoadStart, 
  ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { User } from './../models/user.model';

@Injectable()

export class AuthService {

  jwtToken: string;               // JsonWebToken
  id: string;                     // unique User id
  userLoggingIn = new Subject();  // Notify some components when user login
  userLoggingOut = new Subject(); // Notify some component when user logout

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute) { }

  /**
   * Register User
   * On success return an empty array {errors: []}
   * On error return an array of error messages {errors: [...msg]}
   * @param user 
   */
  registerUser(user: User): Observable<Response> {
    const headers = {
      'Content-Type': 'application/JSON'
    }
    return this.http.post('api/auth/register', user, headers)
      .map((response: Response) => {
        return response.json()
      });
  }

  /**
   * Login User
   * On success return a jwt token {token: string}
   * On error return an array of error messages {errors: [...msg]}
   * @param user 
   */
  loginUser(user: {identifier: string, password: string}): Observable<Response> {
    const headers = {
      'Content-Type': 'application/JSON',
    }
    return this.http.post('api/auth/login', user, headers)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * Logout user
   * Clear localStorage 
   * Redirect to home page
   */
  loggoutUser() {
    this.clearStorage();
    this.userLoggingOut.next();
    this.router.navigate(['']);
  }

  /**
   * Store jwt token to localStorage
   * @param token 
   */
  storeToken(token: string): void {
    this.jwtToken = token;
    localStorage.setItem('token', this.jwtToken);
  }

  /**
   * Get jwt token from localStorage
   */
  getTokenFromStorage() {
    this.jwtToken = localStorage.getItem('token');
  }

  /**
   * Clear the localStorage
   */
  clearStorage() {
    localStorage.clear();
  }

  /**
   * Check if the user is authenticated
   * Used by CanActivateGuard
   * Post the stored jwt or null to verify it
   * Success response { valid: true, id: string }, store the user id and return true
   * Fail resposne _body: "false", return false 
   */
  isAuthenticated(): Observable<boolean> {
    const headers = {
      'Content-Type': 'application/JSON',
    }
    this.getTokenFromStorage();
    return this.http.post('/api/auth/verify-token', {token: this.jwtToken}, headers)
      .map((response: Response) => {
        let data = response.json();
        if(!data || !data.valid) {
          return false;
        } else {
          this.id = data.id;
          return true;
        }
      });
  }


  /**
   * When the user is registring
   * Check if the email already exist
   * @param email 
   */
  checkEmail(email: string): Observable<Response> {
    const headers = {
      'Content-Type': 'application/JSON'
    }
    return this.http.post('api/auth/check-email', {email: email}, headers)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * When the user is registring
   * Check if the username already exist
   * @param username 
   */
  checkUsername(username: string): Observable<Response> {
    const headers = {
      'Content-Type': 'application/JSON'
    }
    return this.http.post('api/auth/check-username', {username: username}, headers)
      .map((response: Response) => {
        return response.json();
      });
  }

}