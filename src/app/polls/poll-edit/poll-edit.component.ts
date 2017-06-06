import { 
  Component, 
  OnInit, 
  OnDestroy } from '@angular/core';

import { 
  FormGroup, 
  FormArray, 
  AbstractControl, 
  FormControl, 
  Validators } from '@angular/forms';

import { Params } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { Poll } from './../poll.model';
import { PollService } from './../poll-service';
import { AuthService } from './../../auth/services/auth.service';
import { CanComponentDeactivate } from './../../auth/services/auth-deactivate-guard';
import { NotificationService } from './../../shared/notification.service';
import { TweetService } from '../../shared/tweet.service';

import { 
  shrinkAnimation, 
  slideInAnimation, 
  slideUpAnimation,
  slideInRightAnimation } from "../../utils/animations";

@Component({
  selector: 'app-poll-edit',
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.css'],
  animations: [
    shrinkAnimation(200),
    slideInAnimation(300),
    slideUpAnimation(300),
    slideInRightAnimation(300)
  ]
})
export class PollEditComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private pollService: PollService,
    private notificationService: NotificationService,
    private tweetService: TweetService) { }

  poll: Poll;                         // Poll that correspond to the route param :pollid
  userId: string;                     // Unique id of the current user, gotten from auth service
  pollForm: FormGroup;                // Form to add a new poll or edit an existing one
  formLegend: string;                 // Changes depends on edit or add mode
  serverValidationMessages: string[]; // Array of error messages from the server 
  formSaved = false;                  // For the canDiactivate check

  // Observers Subscritions
  routeParamsSubscription: Subscription;
  getPollSubscription: Subscription;
  validateTitleSubscription: Subscription;
  crudSubscription: Subscription;
  authSubscription: Subscription;

  ngOnInit() {
    this.initForm();                   // Initialize the form
    this.userId = this.authService.id; // Get the user id
    // Subscribe to the route params
    // if there is a :pollid param fill the form to edit
    // else the form stay blank
    this.routeParamsSubscription = this.route.params.subscribe(
      (params: Params) => {
        if(params['pollid']) {
          this.getPollSubscription = this.pollService.getPollById(params['pollid']).subscribe(
            (poll: Poll) => {
              this.poll = poll;
              this.formLegend = 'edit poll';
              // Fill the form with the poll data
              this.updateForm();
            }
          )
        } else {
          this.formLegend = 'new poll';
        }
      }
    )
  }

  ngOnDestroy() {
    if(this.getPollSubscription) this.getPollSubscription.unsubscribe();
    if(this.routeParamsSubscription) this.routeParamsSubscription.unsubscribe();
    if(this.validateTitleSubscription) this.validateTitleSubscription.unsubscribe();
    if(this.crudSubscription) this.crudSubscription.unsubscribe();
    if(this.authSubscription) this.authSubscription.unsubscribe();
  }

  /**
   * Initialize the form
   * Blank form
   */
  initForm(): void {
    let title = '';
    let options = new FormArray([]);
    // At least two option fields in the form
    for(let i = 0; i < 2; i++) {
      options.push(new FormGroup({
        'label': new FormControl('', Validators.required
        )
      }));
    }
    this.pollForm = new FormGroup({
      'title': new FormControl('', Validators.required, this.titleValidation.bind(this)),
      'options': options
    })
  }

  /**
   * Fill the form with the poll data to edit
   * 
   */
  updateForm(): void {
    let title = this.poll.title;
    let options = new FormArray([]);
    this.poll.options.forEach(option => {
      options.push(new FormGroup({
        'label': new FormControl(option.label, Validators.required)
      }))
    });
    this.pollForm = new FormGroup({
      'title': new FormControl(title, Validators.required, this.titleValidation.bind(this)),
      'options': options
    })
  }

  /**
   * Return the form's title field
   */
  get title(): AbstractControl {
    return this.pollForm.get('title');
  }

  /**
   * Return the form's options field
   */
  get options(): AbstractControl {
    return this.pollForm.get('options');
  }

 /**
  * Async Validator
  * Check if the title is already used
  * @param ctrl 
  */
  titleValidation(ctrl: AbstractControl): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.validateTitleSubscription = this.pollService.validateTitle(this.poll ? this.poll['_id'] : null, ctrl.value).subscribe(
        (response) => {
          if(response.exist) {
            resolve({'titleExits': true});
          } else {
            resolve(null);
          }
        }
      )
    });
    return promise;
  }

  /**
   * Remove an option from the form
   */
  onRemoveOption(index: number): void {
    (<FormArray>this.options).removeAt(index);
  }

  /**
   * Add an option to the form
   */
  onAddOption(): void {
    (<FormArray>this.options).push(new FormGroup({
      'label': new FormControl('', Validators.required)
    }));
  }

  /**
   * Reset to default
   */
  onReset(): void {
    this.initForm();
    if(this.poll) {
      this.updateForm();
    }
    this.serverValidationMessages = [];
    this.formSaved = false;
  }

  /**
   * Cancel edition
   */
   onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
   }

  /**
   * Submit a new poll or an updated one
   */
  onSubmit(): void {
    // Submit new Poll or update
    // Check if the user is still authenticated
    // Redirect or proceed 
    this.authSubscription = this.authService.isAuthenticated().subscribe(
      (isAuth: boolean) => {
        if(!isAuth) {
          this.formSaved = true; // to bypass the canDeactivate guard, since the jwt disappeared from the localStorage
          this.notificationService.newNotification('Session expired, please login');
          return this.router.navigate(['/auth/login']);
        } else {
          this.userId = this.authService.id;
          if(!this.poll) {
            this.addPollRequest();
          } else {
            this.updatePollRequest();
          }
        }
      }
    )
  }

  /**
   * Delete a poll
   */
  onDelete(): void {
    let decision = confirm('No second thought ?');
    if(decision) {
      // Check if the user is still authenticated
      // Redirect or proceed 
      this.authSubscription = this.authService.isAuthenticated().subscribe(
        (isAuth: boolean) => {
          if(!isAuth) {
            this.formSaved = true; // to bypass the canDeactivate guard, since the jwt disappeared from the localStorage
            this.notificationService.newNotification('Session expired, please login');
            return this.router.navigate(['/auth/login']);
          } else {
            this.userId = this.authService.id;
            this.removePollRequest();
          }
        }
      )
    }
  }  
  /**
   * Add a new poll and navigate back one level
   * Update error messages if server validation fails
   */
  addPollRequest(): void {
    let dataToSubmit = {
      userId: this.userId,                   // Attach the userId to the data to submit
      title: this.pollForm.value.title,
      options: this.pollForm.value.options
    }
    this.crudSubscription = this.pollService.addPoll(dataToSubmit).subscribe(
      (response: {errors: string[]}) => {
        let errors = response.errors;
        if(errors.length > 0) {
          this.serverValidationMessages = errors;
        } else {
          this.formSaved = true;
          this.pollService.pollsUpdated.next();
          this.notificationService.newNotification('New poll added !');
          this.router.navigate(['../'], {relativeTo: this.route});
        } 
      }
    )
  }

  /**
   * Update a poll and navigate back one level
   * Update error messages if server validation fails
  */
  updatePollRequest(): void {
    // Update Poll
    let dataToSubmit = {
      userId: this.userId,                 // Attach the user id to the data to submit
      pollId: this.poll._id,               // Attach the poll id to update
      title: this.pollForm.value.title,
      options: this.pollForm.value.options
    }
    this.crudSubscription = this.pollService.updatePoll(dataToSubmit).subscribe(
      (response: {errors: string[]}) => {
        let errors = response.errors;
        if(errors.length > 0) {
          this.serverValidationMessages = errors;
        } else {
          this.formSaved = true;
          this.pollService.pollsUpdated.next();
          this.notificationService.newNotification('Poll Updated !');
          this.router.navigate(['../'], {relativeTo: this.route});
        } 
      }
    )
  }

  /**
   * Remove a poll and navigate back one level
   * Update error messages if server validation fails
   */
  removePollRequest(): void {
    if(this.poll) {
      this.pollService.removePoll({userId: this.userId, pollId: this.poll._id}).subscribe(
        (response: {errors: string[]}) => {
          let errors = response.errors;
          if(errors.length > 0) {
            this.serverValidationMessages = errors;
          } else {
            this.formSaved = true;
            this.pollService.pollsUpdated.next();
            this.notificationService.newNotification('Poll deleted !');
            this.router.navigate(['../'], {relativeTo: this.route});
          } 
        }
      )
    }
  }

 // Copy poll url to clipboard
  onCopy() {
    let input = document.createElement('input');
    document.body.appendChild(input);
    input.value = location.href;
    input.select();
    document.execCommand('copy');
    this.notificationService.newNotification('Link copied to clipboard');
    document.body.removeChild(input);
    return false;
  }

    /**
   * Tweet poll
   */

  onTweet() {
    this.tweetService.tweet(this.poll.title, location.href);
  }


   /**
    * CandDeactivateGuard
    */
  canDeactivate() {
    if(this.formSaved) {
      return true;
    }
    let changes = 0;
    let formData = this.pollForm.value;
    if(this.poll) {
      if(formData.title !== this.poll.title) {
        changes++;
      }
      if(this.poll.options.length !== formData.options.length) {
         changes++;
      }
      else {
        this.poll.options.forEach((option, index) => {
          if(option.label !== formData.options[index].label) changes++;
        });
      }
    } else {
      if(formData.title !== '') {
        changes++;
      }
      formData.options.forEach(option => {
        if(option.label !== '') {
          changes++;
        }
      });
    }
    if(changes > 0) {
      return confirm('Discard changes and leave ?');
    }
    return true;
  }
}
