import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryPagesRoutingModule } from './entry-pages-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';


@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    EntryPagesRoutingModule
  ]
})
export class EntryPagesModule { }
