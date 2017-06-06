import { 
  Component, 
  OnInit, 
  OnDestroy } from '@angular/core';

import { 
  FormGroup, 
  FormControl, 
  Validators, 
  AbstractControl } from "@angular/forms";

import { 
  Router, 
  ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { 
  trigger, 
  state, 
  transition, 
  style, 
  animate } from '@angular/animations';

import { 
  shrinkAnimation, 
  turnAnimation, 
  slideUpAnimation } from '../../utils/animations';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/notification.service';
import { RoutesLogService } from './../../shared/routes-log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    shrinkAnimation(200),
    turnAnimation(200),
    slideUpAnimation(200),
    trigger('notify', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      state('out', style({
        transform: 'translateX(100px)',
        opacity: 0
      })),
      transition('in <=> out', animate(300)),
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private routesLog: RoutesLogService) { }

  loginForm: FormGroup;            
  loginErrors: string[];            // Login validation result from the server
  previousRoute: string;            // If the user is redirected to login, redirect him(her) to this route
  message: string;                  // Message after jwt token expired
  notificationState = 'out';        // Notification state, used for animation

  loginSubscription: Subscription;  // Subscribe to authService.login Observer
  notificationSubscription: Subscription;

  ngOnInit() {
    this.loginErrors = [];
    this.initForm(); // Initialize the login form
    this.previousRoute = this.routesLog.getLastRoute(); //Get the previous route
    this.notify();
  }

  ngOnDestroy() {
    // Unsubscribe from the authService.login Observer
    if(this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  /**
   * Initialize the signup form
   */
  initForm(): void {
    this.loginForm = new FormGroup({
      'identifier': new FormControl(null, [
        Validators.required
      ]),
      'password': new FormControl(null, [
        Validators.required
      ])
    })
  }

  /**
   * Username field reference
   */
  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  /**
   * identifier field reference 
   */
  get identifier(): AbstractControl {
    return this.loginForm.get('identifier');
  }

  /**
   * Password field reference
   */
  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  /**
   * login form submit
   */
  onSubmit(): void {
    // Prepare the data to submit
    const user = {
      identifier: this.identifier.value,
      password: this.password.value
    }
    // Login request
    this.loginSubscription = this.authService.loginUser(user).subscribe(
      (response: any) => {
        if(response.hasOwnProperty('errors')) {
          this.loginErrors = response.errors.map(errorMsg => errorMsg);
        } else {
          this.loginErrors = [];
          this.authService.storeToken(response.token);
          this.authService.userLoggingIn.next();
          this.onReset();
          this.notificationService.newNotification('Welcome ' + user.identifier);
          // If the user was trying to vote in a poll, but redirected to login
          // redirect him(her) back to that poll
          // else redirect to dashboard
          if(/\/polls\/(.)+/.test(this.previousRoute)) {
            this.router.navigate([this.previousRoute]);
          } else {
            this.router.navigate(['/polls/dashboard']);
          }
        }
      } 
    )
  }

  /**
   * login form reset
   */
  onReset(): void {
    this.loginForm.reset({
      'identifier': null,
      'password': null
    });
    this.loginErrors = [];
  }

    /**
   * Update the notification message and animate
   */
  notify() {
    this.message = this.notificationService.message;
    if(this.message) {
      setTimeout(() => {
        this.notificationState = this.notificationState === 'out' ? 'in' : 'out';
      }, 500)
      setTimeout(() => {
        this.notificationState = this.notificationState === 'out' ? 'in' : 'out';
        this.notificationService.message = null;
      }, 2000)
    }
  }

}
