import { Component, OnInit, Input, HostBinding, ElementRef } from '@angular/core';

@Component({
  selector: 'app-two-state-button',
  templateUrl: './two-state-button.component.html',
  styleUrls: ['./two-state-button.component.scss'],
})

export class TwoStateButtonComponent implements OnInit {
  @Input() width: string;
  @Input() options: {optionOne: string, optionTwo: string};
  @Input() actions: {actionOne: any, actionTwo: any};

  optionTwo: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.setProperty('--mywidth', this.width);
  }

  onClick() {
    if (this.optionTwo) {
      this.actions.actionTwo();
    } else {
      this.actions.actionOne();
    }
  }
}
