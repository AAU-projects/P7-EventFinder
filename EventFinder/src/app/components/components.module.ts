import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { TwoStateButtonComponent } from './two-state-button/two-state-button.component';
import { FormsModule } from '@angular/forms';

/* How to add a new component:
    ng g c components/[name] --export
*/

@NgModule({
  declarations: [TestComponent, HeaderComponent, TwoStateButtonComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [TestComponent, HeaderComponent, TwoStateButtonComponent],
})
export class ComponentsModule {}

