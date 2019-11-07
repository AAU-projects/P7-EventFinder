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
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';


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
    EventsComponent,
    ForgotpasswordComponent,
    OrganizerComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({ // Google maps
      apiKey: 'AIzaSyAxJpRUrMbG264kgpMZNhk916zvqP1K08U'
    })
  ],
  exports: [LoginComponent]
})
export class PagesModule { }
