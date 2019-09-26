import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';

/* How to add a new page:
    ng g c pages/[name]

    Remember to make a url for in routing
*/

@NgModule({
  declarations: [HomeComponent, LoginComponent, FirebaseTestComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
  ]
})
export class PagesModule { }
