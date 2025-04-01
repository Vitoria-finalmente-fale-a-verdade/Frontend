import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LazyTableDataModel} from '../../models/lazy-table-data.model';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {SkeletonModule} from 'primeng/skeleton';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {CardModule} from 'primeng/card';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {FormsModule} from '@angular/forms';
import getProp from '../../shared/utils/get-prop';

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
  ],
  templateUrl: './lazy-table.component.html',
  styleUrl: './lazy-table.component.css'
})
export class LazyTableComponent {
  @Input({ required: true }) table!: LazyTableDataModel;
  @Input() pageSize = 10;
  @Input({ required: true }) total!: number;
  @Input() loading = false;

  @Output() onPageChange = new EventEmitter();
  @Output() onActionClick = new EventEmitter();

  onChange(event: PaginatorState) {
    this.onPageChange.emit(event);
  }

  onAction(event: MouseEvent, id: string, row: any) {
    this.onActionClick.emit({event, id, row});
  }

  protected readonly Array = Array;
  protected readonly Intl = Intl;
  protected readonly getProp = getProp;
}
