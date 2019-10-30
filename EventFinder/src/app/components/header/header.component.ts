import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [

      state('in', style({opacity: 1})),

      transition(':enter', [
        style({opacity: 0}),
        animate(600)
      ]),

      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})

export class HeaderComponent {

  constructor(
    public auth: AuthService,
    public notification: NotificationService) {
    auth.isUserObs.subscribe();
   }
}
