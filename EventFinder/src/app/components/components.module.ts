import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { TwoStateButtonComponent } from './two-state-button/two-state-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserInfoComponent } from './user-info/user-info.component';
import { NavbarUserDropdownComponent } from './navbar-user-dropdown/navbar-user-dropdown.component';
import { OrganizerInfoComponent } from './organizer-info/organizer-info.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { EventFormComponent } from './event-form/event-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';
import { TagSelectionComponent } from './tag-selection/tag-selection.component';

/* How to add a new component:
    ng g c components/[name] --export
*/

@NgModule({
  declarations: [
    TestComponent,
    HeaderComponent,
    TwoStateButtonComponent,
    UserInfoComponent,
    NavbarUserDropdownComponent,
    OrganizerInfoComponent,
    EventFormComponent,
    ImageCropperComponent,
    TagSelectionComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'header': 1 }, { 'header': 2 }]],
      },
      placeholder: 'Write description here...'
    })],
  exports: [
    TestComponent,
    HeaderComponent,
    TwoStateButtonComponent,
    UserInfoComponent,
    NavbarUserDropdownComponent,
    OrganizerInfoComponent,
    EventFormComponent,
    ImageCropperComponent,
    TagSelectionComponent
  ],
})
export class ComponentsModule {}

