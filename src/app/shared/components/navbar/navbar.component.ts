import {Component, OnInit, Signal} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PrimeNgModule} from '../../modules/prime-ng/prime-ng.module';
import {MenuItem} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ChangePasswordComponent} from '../../../components/change-password/change-password.component';
import {PropertyModel} from '../../../models/property.model';
import {CommonModule} from '@angular/common';
import {faRetweet} from '@fortawesome/free-solid-svg-icons/faRetweet';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faBuilding, faUser} from '@fortawesome/free-solid-svg-icons';
import {UserModel} from '../../../models/user.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons/faEyeSlash';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    ChangePasswordComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  profileMenuItems: MenuItem[] = [];
  title?: string;
  resetPasswordPopup = false;

  customer!: Signal<UserModel|null>;
  property!: Signal<PropertyModel|null>;

  constructor(
    protected authService: AuthService,
    private route: ActivatedRoute,
    protected router: Router,
  ) {
    this.customer = toSignal(this.authService.customerChange, { initialValue: this.authService.customer });
    this.property = toSignal(this.authService.propertyChange, { initialValue: this.authService.property });
  }

  ngOnInit() {
    this.title = this.route.snapshot.firstChild?.data['title'];

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.route.children.length > 0) {
          this.title = this.route.children[this.route.children.length -1].snapshot.firstChild?.data['title'];
        }
        if (!this.title) {
          this.title = this.route.snapshot.firstChild?.data['title'];
        }
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
            command: () => this.authService.logout(),
          }
        ]
      }
    ];
  }

  removeCustomer() {
    this.authService.customer = null;
  }

  protected readonly faRetweet = faRetweet;
  protected readonly faUser = faUser;
  protected readonly faBuilding = faBuilding;
  protected readonly faEyeSlash = faEyeSlash;
}
