//Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { PollStartComponent } from './poll-start/poll-start.component';
import { PollEditComponent } from './poll-edit/poll-edit.component';
import { PollItemComponent } from './poll-item/poll-item.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { AllPollsComponent } from './all-polls/all-polls.component';
import { PollDetailsComponent } from './poll-details/poll-details.component';
import { PollChartComponent } from './poll-chart/poll-chart.component';


// Services
import { AuthGuardService } from './../auth/services/auth-guard.service';
import { CanDeactivateGuard } from './../auth/services/auth-deactivate-guard';

const pollsRoutes: Routes = [
  { path: 'dashboard', component: UserPollsComponent, canActivate: [AuthGuardService], children: [
    { path: '', component: PollStartComponent },
    { path: 'new', component: PollEditComponent, canDeactivate: [CanDeactivateGuard] },
    { path: ':pollid', component: PollEditComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'chart/:pollid', component: PollChartComponent },
  ] }, 
  { path: '', component: AllPollsComponent, children: [
    { path: ':pollid', component: PollDetailsComponent },
    { path: 'chart/:pollid', component: PollChartComponent },
    { path: '', component: PollStartComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(pollsRoutes)],
  exports: [RouterModule],
})
export class PollsRoutingModule { }