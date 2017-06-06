import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { 
  FormGroup,
  FormControl, 
  Validators, 
  AbstractControl} from "@angular/forms";

import { 
  shrinkAnimation, 
  turnAnimation, 
  slideUpAnimation } from '../../utils/animations';

import { AuthService } from './../services/auth.service';
import { NotificationService } from './../../shared/notification.service';
import { RoutesLogService } from './../../shared/routes-log.service';

import { User } from './../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    shrinkAnimation(200),
    turnAnimation(200),
    slideUpAnimation(200)
  ]
})
export class SignupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private routesLog: RoutesLogService) { }

  signupForm: FormGroup;
  signupErrorMessages: string[]; // Validation errors from the server
  previousRoute: string;

  ngOnInit() {
    this.signupErrorMessages = [];
    this.initForm(); // Initialize the form
    this.previousRoute = this.routesLog.getLastRoute(); //Get the previous route
  }

  /**
   * Initialize the signup form
   */
  initForm(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_-]*$'),
          Validators.minLength(4)
        ],
        this.usernameInUse.bind(this)
      ),
      'email': new FormControl(null, [
          Validators.required,
          Validators.email
        ],
        this.emailInUse.bind(this)
      ),
      'password': new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ]
      ),
      'passwordConfirm': new FormControl(null,
        Validators.required, 
        this.passwordMismatch.bind(this)
      )
    });
  }

  /**
   * Username field reference
   */
  get username(): AbstractControl {
    return this.signupForm.get('username');
  }

  /**
   * Email field reference 
   */
  get email(): AbstractControl {
    return this.signupForm.get('email');
  }

  /**
   * Password field reference
   */
  get password(): AbstractControl {
    return this.signupForm.get('password');
  }

  /**
   * Confirm password field reference
   */
  get passwordConfirm(): AbstractControl {
    return this.signupForm.get('passwordConfirm');
  }

  /**
   * Async validator
   * Check If the passwords matches
   * @param ctrl 
   */
  passwordMismatch(ctrl: FormControl): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      if(ctrl.value !== this.password.value) {
        resolve({ 'passwordMismatch': true });
      } else {
        resolve(null);
      }
    })
    return promise;
  }

  /**
   * Async validator
   * Check if the email is already registred
   * @param ctrl 
   */
  emailInUse(ctrl: FormControl): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.authService.checkEmail(ctrl.value).subscribe(
        (res: any) => {
          if(res.emailInUse) {
            resolve({'emailInUse': true});
          } else {
            resolve(null);
          }
        }
      );
    });
    return promise;
  }

  /**
   * Async validator
   * Check if the username is already registred
   * @param ctrl 
   */
  usernameInUse(ctrl: FormControl): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.authService.checkUsername(ctrl.value).subscribe(
        (res: any) => {
          if(res.usernameInUse) {
            resolve({'usernameInUse': true});
          } else {
            resolve(null);
          }
        }
      );
    });
    return promise;
  }

  /**
   * Register user
   * then login
   */
  onSubmit(): void {
    // Prepare the data to submit
    const user = new User(
      this.username.value,
      this.email.value,
      this.password.value
    );
    // Register request
    this.authService.registerUser(user).subscribe(
      (data: any) => {
        if((<string[]>data.errors).length === 0) {
          this.signupErrorMessages = [];
          this.authService.loginUser({identifier: this.username.value, password: this.password.value}).subscribe(
            (response: any) => {
              this.authService.storeToken(response.token);
              this.authService.userLoggingIn.next();
              this.notificationService.newNotification('Welcome ' + this.username.value);
              this.onReset();
              // If the user was trying to vote in a poll, but redirected to login
              // redirect him(her) back to that poll
              // else redirect to dashboard
              if(/\/polls\/(.)+/.test(this.previousRoute)) {
                this.router.navigate([this.previousRoute]);
              } else {
                this.router.navigate(['/polls/dashboard']);
              }
            }
          )
        } else {
          this.signupErrorMessages = (<string[]>data.errors).map(message => message);
        }
      }
    )
  }

  /**
   * Reset form
   */
  onReset(): void {
    this.signupForm.reset({
      'username': null,
      'email': null,
      'password': null,
      'passwordConfirm': null
    });
    this.signupErrorMessages = [];
  }

  /**
   * Signup Successeful
   */
  onSignupSuccess() {
    
  }

}
