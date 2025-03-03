import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PrimeNgModule} from '../../modules/prime-ng/prime-ng.module';
import {MenuItem} from 'primeng/api';
import {SelectCustomerComponent} from '../../../components/select-customer/select-customer.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {IsAuthorizedDirective} from '../../directives/is-authorized.directive';
import {Roles} from '../../../models/role.model';
import {ChangePasswordComponent} from '../../../components/change-password/change-password.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PrimeNgModule, SelectCustomerComponent, FormsModule, IsAuthorizedDirective, ChangePasswordComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  profileMenuItems: MenuItem[] = [];
  title?: string;
  resetPasswordPopup = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.title = this.route.snapshot.firstChild?.data['title'];

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.title = this.route.snapshot.firstChild?.data['title'];
      }
    })

    this.profileMenuItems = [
      {
        label: [this.authService.user.firstName, this.authService.user.lastName].join(' '),
        items: [
          {
            label: 'Redefinir senha',
            icon: 'pi pi-lock',
            command: () => this.resetPasswordPopup = true
          },
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: this.authService.logoutReload,
          }
        ]
      }
    ];
  }

  protected readonly Roles = Roles;
}
