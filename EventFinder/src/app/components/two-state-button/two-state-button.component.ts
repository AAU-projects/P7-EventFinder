import { Component, OnInit, Input, HostBinding, ElementRef } from '@angular/core';
import { MethodCall } from '@angular/compiler';
import { UserTypes } from 'src/app/models/user.types.enum';

@Component({
  selector: 'app-two-state-button',
  templateUrl: './two-state-button.component.html',
  styleUrls: ['./two-state-button.component.scss'],
})
export class TwoStateButtonComponent implements OnInit {
  @Input() width: string;
  @Input() height: string;
  @Input() options: {optionOne: string, optionTwo: string};
  @Input() actions: {actionOne: any, actionTwo: any};

  optionTwo: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.setProperty('--mywidth', this.width);
    this.elementRef.nativeElement.style.setProperty('--myheight', this.height);
  }

  onClick() {
    if (this.optionTwo) {
      this.actions.actionTwo();
    } else {
      this.actions.actionOne();
    }
  }

}
