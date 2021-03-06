import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { EventsComponent } from './events/events.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { OrganizationComponent } from './organization/organization.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { OrganizationRegisterComponent } from './organization-register/organization-register.component';
import { AboutComponent } from './about/about.component';
import { PublicOrganizationComponent } from './public-organization/public-organization.component';

// All paths starts from root (/)
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'firebase', component: FirebaseTestComponent},
  {path: 'org-register', component: OrganizationRegisterComponent},
  {path: 'user', component: UserComponent},
  {path: 'organization', component: OrganizationComponent},
  {path: 'events', component: EventsComponent},
  {path: 'events/search/:searchterm', component: EventsComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},
  {path: 'o/:id', component: PublicOrganizationComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', component: PageNotFoundComponent}, // Skal ligge nederst!!!!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
