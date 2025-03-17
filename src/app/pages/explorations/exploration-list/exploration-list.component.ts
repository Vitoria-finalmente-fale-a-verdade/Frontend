import { Component } from '@angular/core';
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import { ButtonModule } from 'primeng/button';
import { EditUserComponent } from '../../../components/edit-user/edit-user.component';
import { DialogModule } from 'primeng/dialog';
import { PaginatorState } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExplorationModel } from '../../../models/exploration.model';
import { EditExplorationComponent } from '../../../components/edit-exploration/edit-exploration.component';
import { ExplorationsService } from '../../../services/explorations.service';


@Component({
  selector: 'app-exploration-list',
  standalone: true,
  imports: [
    LazyTableComponent,
    DialogModule,
    EditExplorationComponent,
    ButtonModule
  ],
  templateUrl: './exploration-list.component.html',
  styleUrl: './exploration-list.component.css'
})
export class ExplorationListComponent {

  loading = true;
  page = 0;
  pageSize = 10;
  total = 0;
  editVisible = false;
  currentEdit?: ExplorationModel;

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Nome',
        field: 'name'
      },
      {
        title: 'Propriedade',
        field: 'property'
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
    private explorationsSerivce: ExplorationsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.getExplorations();
  }

  getExplorations() {
    this.loading = true;

    this.explorationsSerivce.get({page: this.page, pageSize: this.pageSize}).subscribe(data => {
      this.tableData.data = data.items.map(exploration => {
        let item: any;
        item = exploration;
        item.name = exploration.name;

        return item;
      });

      this.total = data.total;
      this.loading = false;
    });
  }

  addExploration() {
    this.editVisible = true;
  }

  onPageChange(event: PaginatorState) {
    this.page = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;

    this.getExplorations();
  }

  onSave() {
    this.editVisible = false;
    this.getExplorations();
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
            this.explorationsSerivce.delete(row.id).subscribe({
              next: () => {
                this.getExplorations();
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
}
