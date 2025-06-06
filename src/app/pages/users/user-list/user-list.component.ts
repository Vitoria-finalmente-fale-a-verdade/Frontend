import {Component, OnDestroy} from '@angular/core';
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {UsersService} from '../../../services/users.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {EditUserComponent} from '../../../components/edit-user/edit-user.component';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {UserModel} from '../../../models/user.model';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import {Subscription} from 'rxjs';
import {faBuilding} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    LazyTableComponent,
    DialogModule,
    EditUserComponent,
    ButtonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnDestroy{
  loading: Subscription|null = new Subscription();
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: UserModel;

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Nome',
        field: 'firstName',
        sortable: true,
      },
      {
        title: 'Sobrenome',
        field: 'lastName',
        sortable: true,
      },
      {
        title: 'Username',
        field: 'username',
        sortable: true,
      },
      {
        title: 'Permissões',
        field: 'permissions'
      },
      {
        title: 'Celular',
        field: 'phoneMasked'
      }
    ],
    actions: [
      {
        id: 'edit',
        icon: 'pi-pencil',
        severity: 'info',
      },
      {
        id: 'delete',
        icon: 'pi-trash',
        severity: 'danger'
      }
    ],
    navigators: [
      {
        id: 'properties',
        icon: faBuilding,
        tooltip: 'Propriedades'
      },
    ],
    data: []
  };

  constructor(
    private usersSerivce: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnDestroy() {
    this.loading?.unsubscribe();
  }

  getUsers() {
    this.loading?.unsubscribe();

    this.loading = this.usersSerivce.get(this.paginateData).subscribe(data => {
      this.tableData.data = data.items.map(user => {
        let item: any;
        item = user;
        item.permissions = user.roles.map(r => r.name).join(', ');
        item.phoneMasked = user.phoneNumber?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

        return item;
      });

      this.total = data.total;
      this.loading = null;
    });
  }

  onSave() {
    this.editVisible = false;
    this.getUsers();
  }

  addUser() {
    this.editVisible = true;
  }

  onEditCancel() {
    this.editVisible = false;
    this.currentEdit = undefined;
  }

  onActionClick(event: MouseEvent, id: string, row: any) {
    switch (id) {
      case 'edit':
        this.currentEdit = row;
        this.editVisible = true;
        break;
      case 'delete':
        this.confirmationService.confirm({
          header: 'Cuidado!',
          message: `Tem certeza que deseja excluir o usuário '${row.name}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
          acceptButtonProps: {
            label: 'Excluir',
            severity: 'danger',
          },
          rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
          },
          accept: () => {
            this.usersSerivce.delete(row.id).subscribe({
              next: () => {
                this.getUsers();
                this.messageService.add({
                  summary: 'Usuário excluído',
                  detail: `O usuário ${row.name} foi excluído com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }

  onNavigateClick(_: MouseEvent, id: string, user: UserModel) {
    this.authService.customer = user;

    switch (id) {
      case 'properties':
        this.router.navigate(['/manage/properties']).then();
        break;
    }
  }
}
