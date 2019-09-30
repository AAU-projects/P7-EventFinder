import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FirebaseTestComponent } from './firebase-test/firebase-test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../guards/auth.guard';


// All paths starts from root (/)
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'firebase', component: FirebaseTestComponent},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},

  {path: '**', component: PageNotFoundComponent}, // Skal ligge nederst!!!!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
