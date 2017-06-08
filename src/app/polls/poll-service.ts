import { ApiService } from './../shared/api.service';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from './../auth/services/auth.service';
import { Poll } from './poll.model';

@Injectable()
export class PollService {

  pollsUpdated = new Subject();
  
  baseUrl: string;

  constructor(
    private http: Http,
    private authService: AuthService,
    private apiService: ApiService) { 
     this.baseUrl = this.apiService.endPoint;
    }

  /**
   * 
   */
  getPolls(): Observable<Poll[]> {
    return this.http.get(this.baseUrl + 'api/polls')
      .map((response: Response) => {
        return response.json().polls
      })
  }

  /**
   * 
   * @param pollId 
   */
  getPollById(pollId: string): Observable<Poll> {
    return this.http.get(`${this.baseUrl}api/polls?pollid=${pollId}`)
      .map((response: Response) => {
        return response.json().poll
      }); 
  }

  /**
   * 
   * @param userId 
   */
  getUserPolls(userId: string): Observable<Poll[]> {
    const headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.authService.jwtToken}` 
    }
    return this.http.get(`${this.baseUrl}api/polls/dashboard?userid=${userId}`, headers)
      .map((response: Response) => {
        return response.json().polls
      }); 
  }

  /**
   * 
   * @param pollId 
   * @param title 
   */
  validateTitle(pollId: string, title: string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.authService.jwtToken}` 
    }
    return this.http.post(this.baseUrl + 'api/polls/dashboard/check-title', {pollId, title}, headers)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * 
   * @param pollData 
   */
  addPoll(pollData: {userId: string, title: string, options: string[]}): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.authService.jwtToken}` 
    }
    return this.http.post(this.baseUrl + 'api/dashboard/new', pollData, headers)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * 
   * @param pollData 
   */
  updatePoll(pollData: {userId: string, pollId: string, title: string, options: string[]}): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.authService.jwtToken}` 
    }
    return this.http.put(this.baseUrl + 'api/dashboard/update', pollData, headers)
      .map((response: Response) => {
        return response.json();
      });
  }

  /**
   * 
   * 
   * @param pollData 
   */
  removePoll(pollData: { userId: string, pollId: string }): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.authService.jwtToken}` 
    }
    return this.http.put(this.baseUrl + 'api/dashboard/remove', pollData, headers)
      .map((response: Response) => {
        return response.json();
      });
  }
  /**
   * Send a user participation
   * @param voteData 
   */
  postUserVote(voteData: {userId: string, pollId: string, optionId: string}): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.authService.jwtToken}` 
    }
    return this.http.post(this.baseUrl + 'api/polls/participate', voteData, headers)
      .map((response: Response) => {
        return response.json();
      }); 
  }
  
}