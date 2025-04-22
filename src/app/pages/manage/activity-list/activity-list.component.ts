import {Component, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {ActivityModel} from '../../../models/activity.model';
import {Subject, takeUntil} from 'rxjs';
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {PaginatorState} from 'primeng/paginator';
import {ActivitiesService} from '../../../services/activities.service';
import {EditActivityComponent} from '../../../components/edit-activity/edit-activity.component';

@Component({
  selector: 'app-activity-list',
  standalone: true,
    imports: [
      Button,
      LazyTableComponent,
      EditActivityComponent,
    ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent implements OnInit, OnDestroy {
  loading = true;
  page = 0;
  pageSize = 10;
  total = 0;
  editVisible = false;
  currentEdit?: ActivityModel;
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
    private activitiesService: ActivitiesService,
  ) { }

  ngOnInit() {
    this.getActivities();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getActivities());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getActivities() {
    this.loading = true;

    this.activitiesService.get({page: this.page, pageSize: this.pageSize}).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = false;
    });
  }

  onPageChange(event: PaginatorState) {
    this.page = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;

    this.getActivities();
  }

  onSave() {
    this.editVisible = false;
    this.getActivities();
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
          message: `Tem certeza que deseja excluir a atividade '${row.category}'? <br><strong>Esta ação não poderá ser desfeita</strong>`,
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
            this.activitiesService.delete(row.id).subscribe({
              next: () => {
                this.getActivities();
                this.messageService.add({
                  summary: 'Atividade excluída',
                  detail: `A atividade ${row.category} foi excluída com sucesso`,
                  severity: 'success',
                });
              }
            });
          },
        });
    }
  }
}
