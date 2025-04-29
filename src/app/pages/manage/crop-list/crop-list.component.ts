import {Component, OnDestroy, OnInit} from '@angular/core';
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {CropService} from '../../../services/crop.service';
import {Button} from 'primeng/button';
import {LazyTableComponent} from '../../../components/lazy-table/lazy-table.component';
import {Observable, Subject, takeUntil} from 'rxjs';
import CropModel from '../../../models/crop.model';
import {EditCropComponent} from '../../../components/edit-crop/edit-crop.component';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import {PaginateResponseModel} from '../../../models/paginate-response.model';

@Component({
  selector: 'app-crop-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditCropComponent,
  ],
  templateUrl: './crop-list.component.html',
  styleUrl: './crop-list.component.css'
})
export class CropListComponent implements OnInit, OnDestroy {
  loading = true;
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: CropModel;
  unsubscribe = new Subject<void>();
  filters?: any;

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Atividade',
        field: 'activity.category',
        sortable: true,
      },
      {
        title: 'Nome',
        field: 'name',
        sortable: true,
      },
      {
        title: 'Implantação',
        field: 'implantationDate',
        type: 'date',
        center: true,
        sortable: true,
      },
      {
        title: 'Área',
        field: 'area',
        center: true,
        unit: 'ha',
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
    preSort: {
      field: 'implantationDate',
    },
    data: []
  };

  constructor(
    private cropsService: CropService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getCrops());

    this.filters = history.state.filters;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCrops() {
    this.loading = true;
    let query: Observable<PaginateResponseModel<CropModel>>;
    if (this.filters) {
       query = this.cropsService.search(this.paginateData, this.filters);
    } else {
      query = this.cropsService.get(this.paginateData);
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
          detail: `Erro ao buscar culturas`,
          severity: 'error',
        });

        this.loading = false;
      }
    });
  }

  onSave() {
    this.editVisible = false;
    this.getCrops();
  }

  addCulture() {
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
          message: `Tem certeza que deseja excluir a cultura '${row.name}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.cropsService.delete(row.id).subscribe({
              next: () => {
                this.getCrops();
                this.messageService.add({
                  summary: 'Cultura excluída',
                  detail: `A cultura ${row.name} foi excluída com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
