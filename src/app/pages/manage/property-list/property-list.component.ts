import {Component, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PaginatorState} from 'primeng/paginator';
import {PropertiesService} from '../../../services/properties.service';
import {EditPropertyComponent} from '../../../components/edit-property/edit-property.component';
import {PropertyModel} from '../../../models/property.model';
import {AuthService} from '../../../services/auth.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditPropertyComponent
  ],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent implements OnInit, OnDestroy {
  loading = true;
  page = 0;
  pageSize = 10;
  total = 0;
  editVisible = false;
  currentEdit?: PropertyModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Nome',
        field: 'name'
      },
      {
        title: 'UF',
        field: 'state'
      },
      {
        title: 'Município',
        field: 'city'
      },
      {
        title: 'Região',
        field: 'region'
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
    private propertiesService: PropertiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getProperties();
    this.authService.customerChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getProperties());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProperties() {
    this.loading = true;

    this.propertiesService.get({page: this.page, pageSize: this.pageSize}).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = false;
    });
  }

  onPageChange(event: PaginatorState) {
    this.page = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;

    this.getProperties();
  }

  onSave() {
    this.editVisible = false;
    this.getProperties();
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
          message: `Tem certeza que deseja excluir a propriedade '${row.name}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.propertiesService.delete(row.id).subscribe({
              next: () => {
                this.getProperties();
                this.messageService.add({
                  summary: 'Propriedade excluída',
                  detail: `A propriedade ${row.name} foi excluída com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
