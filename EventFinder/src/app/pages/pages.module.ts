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
import { OrganizationComponent } from './organization/organization.component';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationRegisterComponent } from './organization-register/organization-register.component';
import { AboutComponent } from './about/about.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import {MatSliderModule} from '@angular/material/slider';
import { PublicOrganizationComponent } from './public-organization/public-organization.component';
import { FormsModule } from '@angular/forms';


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
    OrganizationComponent,
    OrganizationRegisterComponent,
    AboutComponent,
    PublicOrganizationComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSliderModule,
    FormsModule,
    AgmCoreModule.forRoot({ // Google maps
      apiKey: environment.google.googleApiKey
    })
  ],
  exports: [LoginComponent, PublicOrganizationComponent]
})
export class PagesModule { }
