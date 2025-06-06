import { InventoryItemService } from '../../services/inventoryItem.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Subject, Subscription, takeUntil} from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivitiesService } from '../../services/activities.service';
import { MessageService } from 'primeng/api';
import { CropService } from '../../services/crop.service';
import { StockMovementModel } from '../../models/stock-movement.model';
import { ActivityModel } from '../../models/activity.model';
import { CropModel } from '../../models/crop.model';
import { PrimeNgModule } from '../../shared/modules/prime-ng/prime-ng.module';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { InventoryItemModel } from '../../models/inventory-item.model';
import {StockMovementService} from '../../services/stock-movement.service';
import EnumModel from '../../models/enum.model';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import {faMinusCircle} from '@fortawesome/free-solid-svg-icons/faMinusCircle';


@Component({
  selector: 'app-edit-stock-movement',
  standalone: true,
  imports: [
    CommonModule,
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
    FontAwesomeModule,
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
  loadingInventoryItems = false;
  loadingActivities = false;
  loadingCrops: Subscription|null = null;
  inventoryItemList: InventoryItemModel[] = [];
  activityList: ActivityModel[] = [];
  cropList: CropModel[] = [];
  unsubscribe = new Subject<void>();
  filters?: any;
  movementTypes: EnumModel[] = [];
  loadingMovementTypes = true;

  today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private cropService: CropService,
    private messageService: MessageService,
    private activitiesService: ActivitiesService,
    private inventoryItemService: InventoryItemService,
    private authService: AuthService,
    private stockMovementService: StockMovementService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.filters = history.state.filters;

    this.getMovementTypes();
    this.getActivities();
    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getActivities());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']?.currentValue) {
      this.loadingCrops?.unsubscribe();
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
    this.loadingActivities = true;
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

  onActivityChange(_: ActivityModel) {
    this.editForm.controls['cropId']?.reset();
    this.getCrops();
  }

  getMovementTypes() {
    this.stockMovementService.getMovementTypes().subscribe(data => {
      this.movementTypes = data;
      this.loadingMovementTypes = false;
    });
  }

  getCrops() {
    this.loadingCrops?.unsubscribe();
    if (!this.editForm.value.activityId)
      return;

    this.cropList = [];

    this.loadingCrops = this.cropService.searchAll({
      'activity.id': this.editForm.value.activityId
    }).subscribe({
      next: data => {
        this.cropList = data;
        this.editForm.controls['cropId']?.enable();
        this.loadingCrops = null;
      },
      error: _ => {
        this.messageService.add({
          summary: 'Erro',
          detail: 'Erro ao buscar culturas',
          severity: 'error',
        })
        this.loadingCrops = null;
      }
    })
  }

  getInventoryItems() {
    this.loadingInventoryItems = true;
    this.inventoryItemList = [];
    this.inventoryItemService.getAll().subscribe({
      next: data => {
        this.inventoryItemList = data;
        this.loadingInventoryItems = false;
      },
      error: _ => {
        this.messageService.add({
          summary: 'Erro',
          detail: 'Erro ao buscar culturas',
          severity: 'error',
        })
        this.loadingInventoryItems = false;
      }
    })
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      inventoryItemId: [null, Validators.required],
      activityId: [null, Validators.required],
      cropId: [{value: null, disabled: true}, Validators.required],
      movementType: [null, Validators.required],
      quantity: [null, Validators.required],
      movementDate: [null, Validators.required],
      unitValue: [null, Validators.required],
      notes: null,
    });
  }

  resetForm() {
    this.editForm.controls['cropId'].disable();
    this.editForm.setValue({
      inventoryItemId: this.stockMovement?.inventoryItem?.id ?? this.filters?.inventoryItem?.id ?? null,
      activityId: this.stockMovement?.activity?.id ?? null,
      cropId: this.stockMovement?.crop?.id ?? null,
      movementType: this.stockMovement?.movementType ?? null,
      quantity: this.stockMovement?.quantity ?? null,
      movementDate: this.stockMovement?.movementDate ?? null,
      unitValue: this.stockMovement?.unitValue ?? null,
      notes: this.stockMovement?.notes ?? null,
    });

    this.getInventoryItems();
    this.getCrops();
  }

  getCurrentItem(): InventoryItemModel|undefined {
    const itemId = this.editForm.controls['inventoryItemId']?.value;
    return this.inventoryItemList.find(item => item.id === itemId);
  }

  getCurrentMovementType(): EnumModel|undefined {
    const itemId = this.editForm.value.movementType;
    return this.movementTypes.find(item => item.id === itemId);
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    const type = this.editForm.controls['movementType'].value;
    if ([3,4,7].includes(type) && this.editForm.controls['quantity']?.value > this.getCurrentItem()!.currentStockLevel) {
      this.messageService.add({summary: 'Estoque insuficiente', detail: 'Não há itens suficientes no estoque\nVerifique a quantidade inserida', severity: 'error'});
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
    this.onClose.next();
  }

  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faMinusCircle = faMinusCircle;
}
