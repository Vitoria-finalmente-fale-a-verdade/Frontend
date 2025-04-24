import {Component, OnDestroy, OnInit} from '@angular/core';
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {PermanentCropService} from '../../../services/permanent-crop.service';
import {Button} from 'primeng/button';
import {LazyTableComponent} from '../../../components/lazy-table/lazy-table.component';
import {Subject, takeUntil} from 'rxjs';
import PermanentCropModel from '../../../models/permanent-crop.model';
import {EditPermanentCropComponent} from '../../../components/edit-permanent-crop/edit-permanent-crop.component';
import {PaginateRequestModel} from '../../../models/paginate-request.model';

@Component({
  selector: 'app-permanent-crop-list',
  standalone: true,
  imports: [
    Button,
    LazyTableComponent,
    EditPermanentCropComponent,
  ],
  templateUrl: './permanent-crop-list.component.html',
  styleUrl: './permanent-crop-list.component.css'
})
export class PermanentCropListComponent implements OnInit, OnDestroy {
  loading = true;
  paginateData = { pageSize: 10 } as PaginateRequestModel;
  total = 0;
  editVisible = false;
  currentEdit?: PermanentCropModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Exploração',
        field: 'exploration.category'
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
    private permanentCropsService: PermanentCropService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getPermanentCrops();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getPermanentCrops());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getPermanentCrops() {
    this.loading = true;

    this.permanentCropsService.get(this.paginateData).subscribe({
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

  onSave() {
    this.editVisible = false;
    this.getPermanentCrops();
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
            this.permanentCropsService.delete(row.id).subscribe({
              next: () => {
                this.getPermanentCrops();
                this.messageService.add({
                  summary: 'Cultura Permanente excluída',
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
