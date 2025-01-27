import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryPagesRoutingModule } from './entry-pages-routing.module';

import { LandingPageComponent } from './landing-page/landing-page.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    EntryPagesRoutingModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    RippleModule,
    CheckboxModule,
  ]
})
export class EntryPagesModule { }
