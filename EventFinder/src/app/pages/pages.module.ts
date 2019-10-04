import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { EventsComponent } from './events/events.component';


/* How to add a new page:
    ng g c pages/[name]

    Remember to make a url for in routing
*/

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    FirebaseTestComponent,
    PageNotFoundComponent,
    UserComponent,
    RegisterComponent,
    EventsComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  exports: [LoginComponent]
})
export class PagesModule { }
