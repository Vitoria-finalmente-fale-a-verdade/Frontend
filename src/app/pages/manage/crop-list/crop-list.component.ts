import {Component, OnDestroy, OnInit} from '@angular/core';
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {PaginatorState} from 'primeng/paginator';
import {CropService} from '../../../services/crop.service';
import {Button} from 'primeng/button';
import {LazyTableComponent} from '../../../components/lazy-table/lazy-table.component';
import {Subject, takeUntil} from 'rxjs';
import CropModel from '../../../models/crop.model';
import {EditCropComponent} from '../../../components/edit-crop/edit-crop.component';

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
  page = 0;
  pageSize = 10;
  total = 0;
  editVisible = false;
  currentEdit?: CropModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Atividade',
        field: 'activity.category'
      },
      {
        title: 'Nome',
        field: 'name'
      },
      {
        title: 'Implantação',
        field: 'implantationDate',
        type: 'date',
        center: true
      },
      {
        title: 'Área',
        field: 'area',
        center: true,
        unit: 'ha'
      },
      {
        title: 'Valor Unitário',
        field: 'unitValue',
        type: 'currency',
        center: true
      },
      {
        title: 'Depreciável',
        field: 'isDepreciable',
        type: 'boolean',
        center: true
      },
      {
        title: 'Vida Útil',
        field: 'lifeCycle',
        center: true,
        unit: 'anos'
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
    private cropsService: CropService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getCrops();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getCrops());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCrops() {
    this.loading = true;

    this.cropsService.get({page: this.page, pageSize: this.pageSize}).subscribe({
      next: data => {
        this.tableData.data = data.items;

        this.total = data.total;
        this.loading = false;
        console.log(data);
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

  onPageChange(event: PaginatorState) {
    this.page = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;

    this.getCrops();
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
