//Modules
import { NgModule } from '@angular/core';
import { 
  Routes, 
  RouterModule, 
  PreloadAllModules } from '@angular/router';

//Components
import { HomeComponent } from './core/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  { path: 'polls', loadChildren: './polls/polls.module#PollsModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
