//Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const authRoutes: Routes = [
  { path: '', component: AuthComponent, children: [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }