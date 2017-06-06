import { style } from '@angular/animations';
import { trigger, state, animate, transition } from '@angular/animations';
import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ViewChild} from '@angular/core';

import { 
  FormGroup, 
  FormControl } from "@angular/forms";

import { 
  ActivatedRoute,
  Params } from "@angular/router";

import { Subscription } from 'rxjs/Subscription';

import { Poll } from './../poll.model';
import { PollService } from './../poll-service';
import { AuthService } from './../../auth/services/auth.service';
import { TweetService } from './../../shared/tweet.service';
import { NotificationService } from './../../shared/notification.service';

import { 
  slideUpAnimation,
  slideInAnimation,
  slideInRightAnimation } from "../../utils/animations";

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.css'],
  animations: [
    slideUpAnimation(300),
    slideInAnimation(300),
    slideInRightAnimation(300),
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
export class PollDetailsComponent implements OnInit, OnDestroy {

  poll: Poll;                       // The poll to display
  voteForm: FormGroup;

  userId: string;                   // participant id (authenticated user)
  authInvite = false;               // If true, invite the user too authenticate
  alreadyVoted = false              // If true, notify the user that he(she) has already voted
  voteSuccess = false;              // If true, notify the success of the vote
  serverValidations: string[] = []; // Array of error messages

  message = '';              // Notification message
  notificationState = 'out'; // Notification state, used for animation

  getPollSubscription: Subscription;      // Subscribe to pollService getPollById method
  routeParamsSoubscription: Subscription; // Subscribe activatedRouteParams
  voteSubscription: Subscription;         
  authSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private tweetService: TweetService) { }

  ngOnInit() {
    // Get the pollId from the route params
    // Get the poll of that id
    this.route.params.subscribe(
      (params: Params) => {
        this.getPollSubscription = this.pollService.getPollById(params.pollid).subscribe(
          (data: Poll) => {
            this.resetAlerts();
            this.poll = data;
            this.initForm();
          }
        )
      }
    )
  }

  ngOnDestroy() {
    if(this.getPollSubscription) this.getPollSubscription.unsubscribe();
    if(this.routeParamsSoubscription) this.routeParamsSoubscription.unsubscribe();
    if(this.authSubscription) this.authSubscription.unsubscribe();   
    if(this.voteSubscription) this.voteSubscription.unsubscribe();
  }

  /**
   * 
   */
  initForm(): void {
    this.voteForm = new FormGroup({
      'option': new FormControl('option')
    });
  }

  /**
   * Client validation then
   * request a vote
   */
  onVote(): void {
    this.resetAlerts();
    // Check if the user is autheticated
    this.authSubscription = this.authService.isAuthenticated().subscribe(
      (isAuth: boolean) => {
        if(!isAuth) {
          this.authInvite = true;
          return;
        } else {
          this.userId = this.authService.id;
          this.alreadyVoted = this.checkPollParticipants();
          // Abort the vote
          if(this.alreadyVoted){
            return;
          }
          // Send the vote request
          this.voteRequest();
        }
      }
    )
  }

  /**
   * Check the participants list
   * Return whether the user has already participated or not
   */
  checkPollParticipants() {
    if(this.poll.participants.indexOf(this.userId) !== -1) return true;
    return false;
  }

  /**
   * Vote request
   */
  voteRequest(): void {
    let dataToSubmit = {
      pollId: this.poll._id,
      userId: this.userId,
      optionId: this.voteForm.value.option
    }
    this.voteSubscription = this.pollService.postUserVote(dataToSubmit).subscribe(
      (response: {errors: string[]}) => {
        if(response.errors.length > 0) {
          this.serverValidations = response.errors; 
        } else {
          this.voteSuccess = true;
        }
      }
    )
  }

  /**
   * 
   */
  resetAlerts() {
    this.authInvite = false;
    this.alreadyVoted = false;
    this.voteSuccess = false;
    this.serverValidations = [];
  }

  /**
   * Copy poll url to clipboard
   */
  onCopy() {
    let input = document.createElement('input');
    input.setAttribute('display', 'none');
    document.body.appendChild(input);
    input.value = location.href;
    input.select();
    document.execCommand('copy');
    this.notificationService.newNotification('Link copied to clipboard');
    this.notify();
    return false;
  }

  /**
   * Tweet poll
   */

  onTweet() {
    this.tweetService.tweet(this.poll.title, location.href);
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
