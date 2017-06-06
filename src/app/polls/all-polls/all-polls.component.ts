import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Poll } from './../poll.model';
import { PollService } from './../poll-service';

@Component({
  selector: 'app-all-polls',
  templateUrl: './all-polls.component.html',
  styleUrls: ['./all-polls.component.css']
})
export class AllPollsComponent implements OnInit, OnDestroy {

  polls: Poll[];

  getPollsSubscription: Subscription;

  constructor(private pollService: PollService) { }

  ngOnInit() {
    // Get all polls
    this.getPollsSubscription = this.pollService.getPolls().subscribe(
      (polls: Poll[]) => {
        this.polls = polls;
      } 
    )
  }

  ngOnDestroy() {
    if(this.getPollsSubscription) this.getPollsSubscription.unsubscribe();
  }

}
