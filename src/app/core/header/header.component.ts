
import { Subscription } from 'rxjs/Subscription';

import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef } from '@angular/core';

import { 
  trigger, 
  state, 
  style, 
  transition, 
  animate } from '@angular/animations';

import { AuthService } from './../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        height: '150px',
      })),
      state('close', style({
        height: '1px',
      })),
      transition('open<=>close', animate(200))
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;

  authSubscription: Subscription;
  loginSubscription: Subscription;
  logoutSubscription: Subscription;

  @ViewChild('collapse') collapseMenu: ElementRef;
  collapseMenuState = 'close';

  constructor(
    private authService: AuthService) { }

  ngOnInit() {

    // Check if the user is authenticated with a valid jwt token
    this.authSubscription = this.authService.isAuthenticated().subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
      }
    )

    // Be notified when the user signin to update the nav links
    this.loginSubscription = this.authService.userLoggingIn.subscribe(
      () => {
        this.isAuthenticated = true;
      }
    )
    // Be notified when the user logout to update the nav links
    this.logoutSubscription = this.authService.userLoggingOut.subscribe(
      () => {
        this.isAuthenticated = false;
      }
    )

  }

  ngOnDestroy() {
    if(this.authSubscription) this.authSubscription.unsubscribe();
    if(this.loginSubscription) this.loginSubscription.unsubscribe();
    if(this.logoutSubscription) this.logoutSubscription.unsubscribe();
  }

  /**
   * logout user
   */
  onLogout() {
    this.authService.loggoutUser();
  }

  openMenu() {
  //   let open = (<HTMLDivElement>this.collapseMenu.nativeElement).classList.contains('in');
  //   if(open) {
  //     (<HTMLDivElement>this.collapseMenu.nativeElement).classList.remove('in');
  //     this.collapseMenuState = 'close';
  //   } else {
  //     (<HTMLDivElement>this.collapseMenu.nativeElement).classList.add('in');
      
  //   }
  this.collapseMenuState = this.collapseMenuState === 'open' ? 'close' : 'open';

  }

  
}
