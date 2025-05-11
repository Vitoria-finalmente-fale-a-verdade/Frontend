import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { LazyTableComponent } from '../../../components/lazy-table/lazy-table.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductModel } from '../../../models/product.model';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import { LazyTableDataModel } from '../../../models/lazy-table-data.model';
import { EditProductComponent } from "../../../components/edit-product/edit-product.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditProductComponent
],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  loading = true;
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: ProductModel;
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
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.getProducts();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getProducts());

      this.productService.getMovementTypes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => console.log(data));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProducts() {
    this.loading = true;

    this.productService.get(this.paginateData).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = false;
    });
  }

  onSave() {
    this.editVisible = false;
    this.getProducts();
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
          message: `Tem certeza que deseja excluir o produto '${row.category}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.productService.delete(row.id).subscribe({
              next: () => {
                this.getProducts();
                this.messageService.add({
                  summary: 'Produto excluído',
                  detail: `O produto ${row.category} foi excluído com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
