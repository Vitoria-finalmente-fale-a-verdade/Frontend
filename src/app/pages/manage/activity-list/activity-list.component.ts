import {Component, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {ActivityModel} from '../../../models/activity.model';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {ActivitiesService} from '../../../services/activities.service';
import {EditActivityComponent} from '../../../components/edit-activity/edit-activity.component';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import {faLeaf} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

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
  loading: Subscription|null = new Subscription();
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: ActivityModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Categoria',
        field: 'category',
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
    navigators: [
      {
        id: 'crop',
        icon: faLeaf,
        tooltip: 'Culturas',
      },
    ],
    data: []
  };

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private activitiesService: ActivitiesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getActivities());
  }

  ngOnDestroy() {
    this.loading?.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getActivities() {
    this.loading?.unsubscribe();

    this.loading = this.activitiesService.get(this.paginateData).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = null;
    });
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

  onNavigateClick(_: MouseEvent, id: string, activity: ActivityModel) {
    switch (id) {
      case 'crop':
        this.router.navigate(['/manage/crops'], {
          state: {
            filters: {
              'activity': activity
            },
          }
        }).then();
        break;
    }
  }
}
