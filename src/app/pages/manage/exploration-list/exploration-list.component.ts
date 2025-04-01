import {Component, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {ExplorationModel} from '../../../models/exploration.model';
import {Subject, takeUntil} from 'rxjs';
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {PaginatorState} from 'primeng/paginator';
import {ExplorationsService} from '../../../services/explorations.service';
import {EditExplorationComponent} from '../../../components/edit-exploration/edit-exploration.component';

@Component({
  selector: 'app-exploration-list',
  standalone: true,
    imports: [
      Button,
      LazyTableComponent,
      EditExplorationComponent,
    ],
  templateUrl: './exploration-list.component.html',
  styleUrl: './exploration-list.component.css'
})
export class ExplorationListComponent implements OnInit, OnDestroy {
  loading = true;
  page = 0;
  pageSize = 10;
  total = 0;
  editVisible = false;
  currentEdit?: ExplorationModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Categoria',
        field: 'category'
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
    private explorationsService: ExplorationsService,
  ) { }

  ngOnInit() {
    this.getExplorations();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getExplorations());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getExplorations() {
    this.loading = true;

    this.explorationsService.get({page: this.page, pageSize: this.pageSize}).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = false;
    });
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
          message: `Tem certeza que deseja excluir a exploração '${row.category}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.explorationsService.delete(row.id).subscribe({
              next: () => {
                this.getExplorations();
                this.messageService.add({
                  summary: 'Exploração excluída',
                  detail: `A exploração ${row.category} foi excluída com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
