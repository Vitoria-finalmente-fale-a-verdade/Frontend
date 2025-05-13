import { ProductService } from '../../services/product.service';
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
import {StockMovementService} from '../../services/stock-movement.service';


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
  loadingProducts = true;
  loadingActivities = true;
  loadingCrops = true;
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
    private productService: ProductService,
    private authService: AuthService,
    private stockMovementService: StockMovementService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getActivities();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getActivities());
    this.getCrops();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getCrops());
    this.getProducts();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getProducts());
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

  getCrops() {
    this.cropService.getAll().subscribe({
      next: data => {
        this.cropList = data;
        this.loadingCrops = false;
      },
      error: _ => {
        this.messageService.add({
          summary: 'Erro',
          detail: 'Erro ao buscar culturas',
          severity: 'error',
        })
        this.loadingCrops = false;
      }
    })
  }

  getProducts() {
    this.productService.getAll().subscribe({
      next: data => {
        this.productList = data;
        this.loadingProducts = false;
      },
      error: _ => {
        this.messageService.add({
          summary: 'Erro',
          detail: 'Erro ao buscar culturas',
          severity: 'error',
        })
        this.loadingProducts = false;
      }
    })
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      inventoryItemId: [null, Validators.required],
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
      inventoryItemId: this.stockMovement?.inventoryItemId ?? '',
      activityId: this.stockMovement?.activityId ?? '',
      cropId: this.stockMovement?.cropId ?? '',
      movementType: this.stockMovement?.movementType ?? '',
      quantity: this.stockMovement?.quantity ?? '',
      movementDate: this.stockMovement?.movementDate ?? new Date(),
      unitValue: this.stockMovement?.unitValue ?? null,
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
      this.stockMovementService.update(this.stockMovement.id, this.editForm.value).subscribe({
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
      this.stockMovementService.create(this.editForm.value).subscribe({
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
