//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PollsRoutingModule } from './polls-routing.module';

//Components
import { AllPollsComponent } from './all-polls/all-polls.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { PollsListComponent } from './polls-list/polls-list.component';
import { PollItemComponent } from './poll-item/poll-item.component';
import { PollEditComponent } from './poll-edit/poll-edit.component';
import { PollStartComponent } from './poll-start/poll-start.component';
import { PollDetailsComponent } from './poll-details/poll-details.component';

//Services
import { PollService } from './poll-service';
import { SearchPipe } from './polls-list/search.pipe';
import { SortPipe } from './polls-list/sort.pipe';
import { CapitalizePipe } from './poll-item/capitalize.pipe';
import { PollChartComponent } from './poll-chart/poll-chart.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PollsRoutingModule
  ],
  exports: [
    SearchPipe
  ],
  declarations: [
    AllPollsComponent,
    UserPollsComponent,
    PollsListComponent,
    PollItemComponent,
    PollEditComponent,
    PollStartComponent,
    PollDetailsComponent,
    SearchPipe,
    SortPipe,
    CapitalizePipe,
    PollChartComponent,
  ],
  providers: [PollService]
})
export class PollsModule { }
