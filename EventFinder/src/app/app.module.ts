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
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    FontAwesomeModule // font awesome
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
