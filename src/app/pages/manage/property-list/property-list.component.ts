import {Component, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {LazyTableComponent} from "../../../components/lazy-table/lazy-table.component";
import {LazyTableDataModel} from '../../../models/lazy-table-data.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PropertiesService} from '../../../services/properties.service';
import {EditPropertyComponent} from '../../../components/edit-property/edit-property.component';
import {PropertyModel} from '../../../models/property.model';
import {AuthService} from '../../../services/auth.service';
import {Subject, Subscription, takeUntil} from 'rxjs';
import getDefaultPaginateRequest from '../../../shared/utils/get-default-paginate-request';
import {faLeaf, faTractor} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

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
  loading: Subscription|null = new Subscription();
  paginateData = getDefaultPaginateRequest();
  total = 0;
  editVisible = false;
  currentEdit?: PropertyModel;
  unsubscribe = new Subject<void>();

  tableData: LazyTableDataModel = {
    headers: [
      {
        title: 'Nome',
        field: 'name',
        sortable: true,
      },
      {
        title: 'UF',
        field: 'state',
        sortable: true,
      },
      {
        title: 'Município',
        field: 'city',
        sortable: true,
      },
      {
        title: 'Região',
        field: 'region',
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
        id: 'machinery',
        icon: faTractor,
        tooltip: 'Maquinários',
      },
      {
        id: 'crops',
        icon: faLeaf,
        tooltip: 'Culturas',
      },
    ],
    data: []
  };

  constructor(
    private propertiesService: PropertiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.customerChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getProperties());
  }

  ngOnDestroy() {
    this.loading?.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProperties() {
    this.loading?.unsubscribe();

    this.loading = this.propertiesService.get(this.paginateData).subscribe(data => {
      this.tableData.data = data.items;

      this.total = data.total;
      this.loading = null;
    });
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

  onNavigateClick(_: MouseEvent, id: string, property: PropertyModel) {
    this.authService.property = property;

    switch (id) {
      case 'machinery':
        this.router.navigate(['/manage/machinery']).then();
        break;

      case 'crops':
        this.router.navigate(['/manage/crops']).then();
        break;
    }
  }
}
