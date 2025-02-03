import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PrimeNgModule} from '../../modules/prime-ng/prime-ng.module';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  profileMenuItems: MenuItem[] = [];

  ngOnInit() {
    this.profileMenuItems = [
      {
        label: [this.authService.user.firstName, this.authService.user.lastName].join(' '),
        items: [
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: this.authService.logout,
          }
        ]
      }
    ];
  }
}
