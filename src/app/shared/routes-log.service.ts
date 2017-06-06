import { Injectable } from '@angular/core';
import { Observer } from "rxjs/Observer";

@Injectable()
export class RoutesLogService {

  /**
   * Service to store all the visited routes
   * 
   */

  previousRoute = '';
  previousRoutes = [];

  constructor() { }

  storeRoutes(routes: any[]): void {
    this.previousRoutes = routes.map(obj => obj.url);
    this.previousRoute = this.previousRoutes[this.previousRoutes.length - 1];
  }

  getLastRoute(): string {
    return this.previousRoute;
  }

}