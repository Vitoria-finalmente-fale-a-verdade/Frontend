import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LazyTableDataModel} from '../../models/lazy-table-data.model';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SkeletonModule} from 'primeng/skeleton';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {CardModule} from 'primeng/card';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {FormsModule} from '@angular/forms';
import getProp from '../../shared/utils/get-prop';
import {PaginateRequestModel} from '../../models/paginate-request.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-lazy-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    SkeletonModule,
    PaginatorModule,
    CardModule,
    PrimeNgModule,
    FormsModule,
    NgOptimizedImage,
    FaIconComponent,
  ],
  templateUrl: './lazy-table.component.html',
  styleUrl: './lazy-table.component.css'
})
export class LazyTableComponent {
  @Input({ required: true }) table!: LazyTableDataModel;
  @Input({required: true}) paginateData!: PaginateRequestModel;
  @Input({ required: true }) total!: number;
  @Input() loading: boolean|any = false;

  @Output() paginateDataChange = new EventEmitter<PaginateRequestModel>();
  @Output() onPaginate = new EventEmitter<void>();
  @Output() onActionClick = new EventEmitter();
  @Output() onNavigateClick = new EventEmitter();

  onPaginateOutput(paginate: PaginateRequestModel) {
    this.paginateData = paginate;

    this.paginateDataChange.emit(paginate);
    this.onPaginate.emit();
  }

  onPageChange(event: PaginatorState) {
    this.paginateData.page = event.page ?? 0;

    this.onPaginateOutput(this.paginateData);
  }

  onSortChange(event: TableLazyLoadEvent) {
    this.paginateData.orderBy = event.sortField as string;
    this.paginateData.descending = event.sortOrder == -1;

    this.onPaginateOutput(this.paginateData);
  }

  onAction(event: MouseEvent, id: string, row: any) {
    this.onActionClick.emit({event, id, row});
  }

  onNavigate(event: MouseEvent, id: string, row: any) {
    this.onNavigateClick.emit({event, id, row});
  }

  protected readonly Array = Array;
  protected readonly Intl = Intl;
  protected readonly getProp = getProp;
}
