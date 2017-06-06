import { Component, Input } from '@angular/core';

import { Poll } from './../poll.model';
import { slideInAnimation } from "../../utils/animations";

@Component({
  selector: 'app-poll-item',
  templateUrl: './poll-item.component.html',
  styleUrls: ['./poll-item.component.css'],
  animations: [
    slideInAnimation(200)
  ]
})
export class PollItemComponent {
  
  @Input() poll: Poll;
  @Input() index: number;

  constructor() { }

}
