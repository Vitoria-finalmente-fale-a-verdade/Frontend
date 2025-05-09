import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivitiesService } from '../../services/activities.service';
import { MessageService } from 'primeng/api';
import { CropService } from '../../services/crop.service';
import { StockMovementModel } from '../../models/stock-movement.model';
import { ActivityModel } from '../../models/activity.model';
import { CropModel } from '../../models/crop.model';
import { PrimeNgModule } from '../../shared/modules/prime-ng/prime-ng.module';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { ProductModel } from '../../models/product.model';


@Component({
  selector: 'app-edit-stock-movement',
  standalone: true,
  imports: [
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  templateUrl: './edit-stock-movement.component.html',
  styleUrl: './edit-stock-movement.component.css'
})
export class EditStockMovementComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) visible!: boolean;
  @Input() stockMovement?: StockMovementModel;

  @Output() onSave = new Subject<void>();
  @Output() onClose = new Subject<void>();

  editForm!: FormGroup;
  loading = false;
  edit = false;
  loadingActivities = true;
  productList: ProductModel[] = [];
  activityList: ActivityModel[] = [];
  cropList: CropModel[] = [];
  unsubscribe = new Subject<void>();

  today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private cropService: CropService,
    private messageService: MessageService,
    private activitiesService: ActivitiesService,
    private authService: AuthService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getActivities();

    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getActivities());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.stockMovement?.id;
    this.resetForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getActivities() {
    this.activitiesService.getAll().subscribe({
      next: data => {
        this.activityList = data;
        this.loadingActivities = false;
      },
      error: _ => {
        this.messageService.add({
          summary: 'Erro',
          detail: 'Erro ao buscar explorações',
          severity: 'error',
        })
        this.loadingActivities = false;
      }
    })
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      productId: [null, Validators.required],
      activityId: [null, Validators.required],
      cropId: [null, Validators.required],
      movementType: [null, Validators.required],
      quantity: [null, Validators.required],
      movementDate: [null, Validators.required],
      unitValue: [null, Validators.required],
      notes: null,

    });
  }

  resetForm() {
    this.editForm.setValue({
      productId: this.stockMovement?.product?.id ?? '',
      activityId: this.stockMovement?.activity?.id ?? '',
      cropId: this.stockMovement?.crop?.id ?? '',
      movementType: this.stockMovement?.movement_type ?? '',
      quantity: this.stockMovement?.quantity ?? '',
      movementDate: this.stockMovement?.movement_date ?? new Date(),
      unitValue: this.stockMovement?.unit_value ?? null,
      notes: this.stockMovement?.notes ?? null,
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.stockMovement) {
      this.cropService.update(this.stockMovement.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Movimentação atualizada com sucesso', severity: 'success'});
          this.emitSave()
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          this.loading = false;
        }
      });
    } else {
      this.cropService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Movimentação criada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao criar movimentação', severity: 'error'});
          this.loading = false;
        }
      });
    }
  }

  emitSave() {
    this.loading = false;
    this.resetForm();
    this.onSave.next();
  }

  onCancel() {
    this.resetForm();
    this.onClose.next();
  }
}
