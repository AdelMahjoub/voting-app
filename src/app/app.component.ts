import { Router, NavigationEnd } from '@angular/router';
import { RoutesLogService } from './shared/routes-log.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private routesLog: RoutesLogService,
    private router: Router) {}

  previousRoutes = [];

  ngOnInit() {
    // Listen to routes changes and store them
    this.router.events.map(
      (e) => {
        this.previousRoutes.push(e)
        return this.previousRoutes.filter(e => e instanceof NavigationEnd);
      }
    ).subscribe(
      (routes) => {
        this.routesLog.storeRoutes(routes);
      }
    )
  }
}
