//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { AppRoutingModule } from './../app-routing.module';

//Components
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

//Services
import { AuthService } from './../auth/services/auth.service';
import { CanDeactivateGuard } from './../auth/services/auth-deactivate-guard';
import { AuthGuardService } from './../auth/services/auth-guard.service';
import { NotificationService } from './../shared/notification.service';
import { RoutesLogService } from './../shared/routes-log.service';
import { TweetService } from './../shared/tweet.service';
import { ApiService } from './../shared/api.service';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AppRoutingModule
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    CanDeactivateGuard,
    NotificationService,
    RoutesLogService,
    TweetService,
    ApiService
  ],
})
export class CoreModule { }
