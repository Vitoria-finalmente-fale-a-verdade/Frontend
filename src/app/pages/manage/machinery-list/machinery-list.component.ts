import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { LazyTableComponent } from '../../../components/lazy-table/lazy-table.component';
import { EditMachineryComponent } from '../../../components/edit-machinery/edit-machinery.component';
import { Subject, takeUntil } from 'rxjs';
import MachineryModel from '../../../models/machinery.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { LazyTableDataModel } from '../../../models/lazy-table-data.model';
import { MachineryService } from '../../../services/machinery.service';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';

@Component({
  selector: 'app-machinery-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditMachineryComponent
  ],
  templateUrl: './machinery-list.component.html',
  styleUrl: './machinery-list.component.css'
})
export class MachineryListComponent implements OnInit, OnDestroy {
  loading = true;
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: MachineryModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Exploração',
        field: 'exploration.category'
      },
      {
        title: 'Descrição',
        field: 'description',
        sortable: true,
      },
      {
        title: 'Compra',
        field: 'acquisitionDate',
        type: 'date',
        center: true,
        sortable: true,
      },
      {
        title: 'Valor',
        field: 'acquisitionValue',
        type: 'currency',
        center: true,
        sortable: true,
      },
      {
        title: 'Depreciável',
        field: 'isDepreciable',
        type: 'boolean',
        center: true,
        sortable: true,
      },
      {
        title: 'Vida Útil',
        field: 'serviceLife',
        center: true,
        unit: 'anos',
        sortable: true,
      },
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
    private machineryService: MachineryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getMachinery();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getMachinery());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getMachinery() {
    this.loading = true;

    this.machineryService.get(this.paginateData).subscribe({
      next: data => {
        this.tableData.data = data.items;

        this.total = data.total;
        this.loading = false;
        console.log(data);
      },
      error: () => {
        this.messageService.add({
          summary: 'Erro',
          detail: `Erro ao buscar maquinários`,
          severity: 'error',
        });

        this.loading = false;
      }
    });
  }

  onSave() {
    this.editVisible = false;
    this.getMachinery();
  }

  addMachinery(){
    this.editVisible = true;
  }
  onEditCancel() {
    this.editVisible = false;
    this.currentEdit = undefined;
  }

  onActionClick(_: MouseEvent, id: string, row: any) {
    switch (id) {
      case 'edit':
        this.currentEdit = row;
        this.editVisible = true;
        break;
      case 'delete':
        this.confirmationService.confirm({
          header: 'Cuidado!',
          message: `Tem certeza que deseja excluir a maquinário '${row.name}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.machineryService.delete(row.id).subscribe({
              next: () => {
                this.getMachinery();
                this.messageService.add({
                  summary: 'Maquinário Permanente excluído',
                  detail: `O maquinário ${row.name} foi excluído com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
