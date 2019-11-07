import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

// Firebase stuff
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { AgmCoreModule } from '@agm/core';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Stripe
import { StripeCheckoutModule } from 'ng-stripe-checkout';

@NgModule({
  declarations: [   // Components that the app uses
    AppComponent
  ],
  imports: [      // Modules that are used in the app
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    PagesModule,
    ComponentsModule,
    FontAwesomeModule, // font awesome
    AgmCoreModule.forRoot({ // Google maps
      apiKey: 'AIzaSyAxJpRUrMbG264kgpMZNhk916zvqP1K08U'
    }),
    StripeCheckoutModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  exports: [AgmCoreModule]
})
export class AppModule {
}
