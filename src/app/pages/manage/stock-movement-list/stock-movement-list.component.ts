import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockMovementModel } from '../../../models/stock-movement.model';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import {Observable, Subject, takeUntil} from 'rxjs';
import { LazyTableDataModel } from '../../../models/lazy-table-data.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { StockMovementService } from '../../../services/stock-movement.service';
import { Button } from 'primeng/button';
import { LazyTableComponent } from '../../../components/lazy-table/lazy-table.component';
import { EditStockMovementComponent } from '../../../components/edit-stock-movement/edit-stock-movement.component';
import {PaginateResponseModel} from '../../../models/paginate-response.model';

@Component({
  selector: 'app-stock-movement-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditStockMovementComponent,
  ],
  templateUrl: './stock-movement-list.component.html',
  styleUrl: './stock-movement-list.component.css'
})
export class StockMovementListComponent implements OnInit, OnDestroy {
  loading = true;
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: StockMovementModel;
  unsubscribe = new Subject<void>();
  filters?: any;

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Item',
        field: 'inventoryItem.name'
      },
      {
        title: 'Atividade',
        field: 'activity.category'
      },
      {
        title: 'Cultura',
        field: 'crop.name'
      },
      {
        title: 'Data',
        field: 'movementDate',
        type: 'date',
        center: true,
        sortable: true,
      },
      {
        title: 'Quantidade',
        field: 'quantity',
        center: true,
        sortable: true,
      },
      {
        title: 'Unidade',
        field: 'inventoryItemUnit',
        center: true,
        sortable: true,
      },
      {
        title: 'Notas',
        field: 'notes',
        center: true,
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
    private stockMovementService: StockMovementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }


  ngOnInit() {
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getStockMovements());

    this.filters = history.state.filters;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getStockMovements() {
    this.loading = true;

    let query: Observable<PaginateResponseModel<StockMovementModel>>;
    if (this.filters) {
      query = this.stockMovementService.search(this.paginateData, this.filters);
    } else {
      query = this.stockMovementService.get(this.paginateData);
    }

    query.subscribe({
      next: data => {
        this.tableData.data = data.items;

        this.total = data.total;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          summary: 'Erro',
          detail: `Erro ao buscar movimentação`,
          severity: 'error',
        });

        this.loading = false;
      }
    });
  }

  onSave() {
    this.editVisible = false;
    this.getStockMovements();
  }

  addStockMovement() {
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
          message: `Tem certeza que deseja excluir a movimentação '${row.name}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.stockMovementService.delete(row.id).subscribe({
              next: () => {
                this.getStockMovements();
                this.messageService.add({
                  summary: 'Movimentação excluída',
                  detail: `A movimentação ${row.name} foi excluída com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
