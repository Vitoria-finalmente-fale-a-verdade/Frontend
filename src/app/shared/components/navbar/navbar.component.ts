import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PrimeNgModule} from '../../modules/prime-ng/prime-ng.module';
import {MenuItem} from 'primeng/api';
import {SelectCustomerComponent} from '../../../components/select-customer/select-customer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {IsAuthorizedDirective} from '../../directives/is-authorized.directive';
import {Roles} from '../../../models/role.model';
import {ChangePasswordComponent} from '../../../components/change-password/change-password.component';
import {PropertyModel} from '../../../models/property.model';
import {PropertiesService} from '../../../services/properties.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PrimeNgModule, SelectCustomerComponent, FormsModule, IsAuthorizedDirective, ChangePasswordComponent, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  profileMenuItems: MenuItem[] = [];
  title?: string;
  resetPasswordPopup = false;
  selectedProperty?: PropertyModel;
  properties: PropertyModel[] = [];
  loadingProperties = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: PropertiesService,
  ) {
  }

  ngOnInit() {
    this.propertiesService.changeProperties.subscribe(() => this.getProperties());
    this.authService.customerChange.subscribe(() => this.getProperties());

    if (this.authService.property)
      this.selectedProperty = this.authService.property;

    this.getProperties();
    this.title = this.route.snapshot.firstChild?.data['title'];

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.route.children.length > 0) {
          this.title = this.route.children[this.route.children.length -1].snapshot.firstChild?.data['title'];
        } else {
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

  onChangeProperty(property: PropertyModel) {
    this.authService.property = property;
  }

  getProperties() {
    this.loadingProperties = true;
    this.propertiesService.getAll().subscribe({
      next: properties => {
        this.loadingProperties = false;
        this.properties = properties;
        if (!properties?.length)
          return;

        if (this.selectedProperty) {
          this.selectedProperty = properties.find(property => property.id == this.selectedProperty?.id) ?? properties[0];
        } else {
          this.selectedProperty = properties[0];
        }
        this.onChangeProperty(this.selectedProperty);
      },
      error: error => {
        this.loadingProperties = false;
        console.error(error);
      }
    });
  }

  protected readonly Roles = Roles;
}
