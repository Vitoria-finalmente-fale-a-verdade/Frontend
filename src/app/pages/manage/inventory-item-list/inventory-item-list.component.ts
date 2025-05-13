import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { LazyTableComponent } from '../../../components/lazy-table/lazy-table.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { InventoryItemService } from '../../../services/inventoryItem.service';
import { Subject, takeUntil } from 'rxjs';
import { InventoryItemModel } from '../../../models/inventoryItem.model';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import { LazyTableDataModel } from '../../../models/lazy-table-data.model';
import { EditInventoryItemComponent } from '../../../components/edit-inventory-item/edit-inventory-item.component';


@Component({
  selector: 'app-inventory-item-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditInventoryItemComponent
],
  templateUrl: './inventory-item-list.component.html',
  styleUrl: './inventory-item-list.component.css'
})
export class InventoryItemListComponent implements OnInit, OnDestroy {
  loading = true;
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: InventoryItemModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Nome',
        field: 'name',
        sortable: true,
      },
      {
        title: 'Descrição',
        field: 'description',
        sortable: true,
      },
      {
        title: 'Quantidade',
        field: 'currentStockLevel',
        sortable: true,
      },
      {
        title: 'Unidade',
        field: 'unitOfMeasure',
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
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private inventoryItemService: InventoryItemService,
  ) { }

  ngOnInit() {
    this.getInventoryItems();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getInventoryItems());

      this.inventoryItemService.getMovementTypes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => console.log(data));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getInventoryItems() {
    this.loading = true;

    this.inventoryItemService.get(this.paginateData).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = false;
    });
  }

  onSave() {
    this.editVisible = false;
    this.getInventoryItems();
  }

  addProperty() {
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
          message: `Tem certeza que deseja excluir o item do inventário '${row.category}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.inventoryItemService.delete(row.id).subscribe({
              next: () => {
                this.getInventoryItems();
                this.messageService.add({
                  summary: 'Item excluído',
                  detail: `O item ${row.category} foi excluído com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
