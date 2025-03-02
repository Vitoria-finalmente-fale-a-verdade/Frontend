import { NgModule } from '@angular/core';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {SelectModule} from 'primeng/select';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {DividerModule} from 'primeng/divider';
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {Menu} from 'primeng/menu';
import {SkeletonModule} from 'primeng/skeleton';
import {RippleModule} from 'primeng/ripple';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputMaskModule} from 'primeng/inputmask';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
  declarations: [],
  imports: [
    CardModule,
    AvatarModule,
    SelectModule,
    ToastModule,
    InputTextModule,
    DividerModule,
    ButtonModule,
    MenubarModule,
    IconFieldModule,
    InputIconModule,
    Menu,
    SkeletonModule,
    RippleModule,
  ],
  exports: [
    CardModule,
    AvatarModule,
    SelectModule,
    ToastModule,
    InputTextModule,
    DividerModule,
    ButtonModule,
    MenubarModule,
    IconFieldModule,
    InputIconModule,
    Menu,
    SkeletonModule,
    RippleModule,
    FloatLabelModule,
    InputMaskModule,
    MultiSelectModule,
  ]
})
export class PrimeNgModule { }
