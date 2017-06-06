import { Injectable } from '@angular/core';

@Injectable()
export class TweetService {

  url: string;

  constructor() {
    this.url = 'https://twitter.com/intent/tweet?text=';
  }

  tweet(title: string, link: string) {
    window.open(`${this.url}Check out this poll ! [${title}]: ${link}`);
  }

}