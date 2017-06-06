import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  /**
   * Service to store messages to pass to components
   */
  constructor() { }

  message = '';
  notify = new Subject();

  newNotification(msg: string) {
    this.message = msg;
    this.notify.next();
  }

}