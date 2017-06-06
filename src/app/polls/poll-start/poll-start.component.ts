import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll-start',
  templateUrl: './poll-start.component.html',
  styleUrls: ['./poll-start.component.css']
})
export class PollStartComponent implements OnInit { 

  constructor() { }

  onDashboard = false;

  dashboardMessage = 'Manage your polls.';
  welcomeMessage = 'Select a poll to participate';

  ngOnInit() {
    if(location.pathname.indexOf('dashboard') !== -1) {
      this.onDashboard = true;
    } else {
      this.onDashboard = false;
    }
  }

}
