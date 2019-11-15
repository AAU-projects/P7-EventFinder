import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { EventsComponent } from './events/events.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { PublicOrganizerComponent } from './public-organizer/public-organizer.component';

// All paths starts from root (/)
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'firebase', component: FirebaseTestComponent},
  {path: 'user', component: UserComponent, canActivate: [LoggedInGuard]},
  {path: 'organizer', component: OrganizerComponent, canActivate: [LoggedInGuard]},
  {path: 'events', component: EventsComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},
  {path: 'o/:id', component: PublicOrganizerComponent},
  {path: '**', component: PageNotFoundComponent}, // Skal ligge nederst!!!!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
