
import { 
  Component, 
  OnInit, 
  OnDestroy } from '@angular/core';

import { 
  ActivatedRoute, 
  Data } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { 
  trigger, 
  state, 
  transition, 
  style, 
  animate } from '@angular/animations';

import { Poll } from './../poll.model';
import { PollService } from './../poll-service';
import { AuthService } from './../../auth/services/auth.service';
import { NotificationService } from "../../shared/notification.service";

@Component({
  selector: 'app-user-polls',
  templateUrl: './user-polls.component.html',
  styleUrls: ['./user-polls.component.css'],
  animations: [
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
export class UserPollsComponent implements OnInit, OnDestroy {

  polls: Poll[];             // User polls
  userId: string;            // Unique user id (authenticated user)
  message = '';              // Notification message
  notificationState = 'out'; // Notification state, used for animation

  updateSubscription: Subscription;       // Listen to updates
  getPollsSubscription: Subscription;     // Listen to getPolls Observable from the pollsService
  notificationSubscription: Subscription;

  constructor(
    private pollService: PollService,
    private authService: AuthService, 
    private notificationService: NotificationService) { }

  ngOnInit() {

    this.userId = this.authService.id;

    this.notify();

    this.updatePolls();

    // Update the polls
    this.updateSubscription = this.pollService.pollsUpdated.subscribe(
      () => {
        this.updatePolls();
      }
    )

    // Get latest notification
    this.notificationSubscription = this.notificationService.notify.subscribe(
      () => {
        this.notify();
      }
    )

  }

  ngOnDestroy() {
    if(this.updateSubscription) this.updateSubscription.unsubscribe();
    if(this.getPollsSubscription) this.getPollsSubscription.unsubscribe();
  }

  /**
   * Update the list of polls after each add, update, remove actions from the edit component
   */
  updatePolls(): void {
    this.getPollsSubscription = this.pollService.getUserPolls(this.userId).subscribe(
      (polls: Poll[]) => {
        this.polls = polls;
      } 
    )
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