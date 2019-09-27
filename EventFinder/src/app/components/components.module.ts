import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';
import { HeaderComponent } from './header/header.component';

/* How to add a new component:
    ng g c components/[name] --export
*/

@NgModule({
  declarations: [TestComponent, HeaderComponent,],
  imports: [
    CommonModule
  ],
  exports: [TestComponent, HeaderComponent,]
})
export class ComponentsModule { }
