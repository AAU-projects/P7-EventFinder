import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../guards/auth.guard';
import { EventsComponent } from './events/events.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


// All paths starts from root (/)
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'firebase', component: FirebaseTestComponent},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventsComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},

  {path: '**', component: PageNotFoundComponent}, // Skal ligge nederst!!!!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
