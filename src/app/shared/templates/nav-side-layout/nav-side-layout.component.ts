import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-nav-side-layout',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,SidebarComponent],
  templateUrl: './nav-side-layout.component.html',
  styleUrl: './nav-side-layout.component.css'
})
export class NavSideLayoutComponent {

}
