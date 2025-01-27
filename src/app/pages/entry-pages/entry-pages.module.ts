import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryPagesRoutingModule } from './entry-pages-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { Button } from 'primeng/button';


@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    Button,
    CommonModule,
    EntryPagesRoutingModule
  ]
})
export class EntryPagesModule { }
