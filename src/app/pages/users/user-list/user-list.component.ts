import {Component, OnInit} from '@angular/core';
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {UsersService} from '../../../services/users.service';
import {PaginatorState} from 'primeng/paginator';
import {ConfirmationService, MessageService} from 'primeng/api';
import {EditUserComponent} from '../../../components/edit-user/edit-user.component';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {RolesService} from '../../../services/roles.service';
import {UserModel} from '../../../models/user.model';
import {RoleModel} from '../../../models/role.model';

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
export class UserListComponent implements OnInit {
  loading = true;
  page = 0;
  pageSize = 10;
  total = 0;
  editVisible = false;
  currentEdit?: UserModel;
  roleList?: RoleModel[];

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Nome',
        field: 'name'
      },
      {
        title: 'Username',
        field: 'username'
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
    data: []
  };

  constructor(
    private usersSerivce: UsersService,
    private rolesService: RolesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }

  getRoles() {
    this.rolesService.getAll().subscribe({
      next: response => {
        this.roleList = response;
      }, error: () => {
        this.messageService.add({summary: 'Erro', detail: 'Erro ao buscar permissões', severity: 'error'});
      }
    });
  }

  getUsers() {
    this.loading = true;

    this.usersSerivce.get({page: this.page, pageSize: this.pageSize}).subscribe(data => {
      this.tableData.data = data.items.map(user => {
        let item: any;
        item = user;
        item.name = user.firstName + ' ' + user.lastName;
        item.permissions = user.roles.map(r => r.name).join(', ');
        item.phoneMasked = user.phoneNumber?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

        return item;
      });

      this.total = data.total;
      this.loading = false;
    });
  }

  onPageChange(event: PaginatorState) {
    this.page = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;

    this.getUsers();
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
          }
        });
    }
  }
}
