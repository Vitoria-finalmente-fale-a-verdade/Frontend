import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryItemModel } from '../../models/inventory-item.model';
import { MessageService } from 'primeng/api';
import { InventoryItemService } from '../../services/inventoryItem.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimeNgModule } from '../../shared/modules/prime-ng/prime-ng.module';
import EnumModel from '../../models/enum.model';

@Component({
  selector: 'app-edit-inventory-item',
  standalone: true,
  imports: [
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  templateUrl: './edit-inventory-item.component.html',
  styleUrl: './edit-inventory-item.component.css'
})
export class EditInventoryItemComponent implements OnInit, OnChanges{
  @Input({ required: true }) visible!: boolean;
  @Input() inventoryItem?: InventoryItemModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  editForm!: FormGroup;
  loading = false;
  edit = false;
  itemTypes?: EnumModel[];
  loadingItemTypes = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private inventoryItemService: InventoryItemService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getItemTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.inventoryItem?.id;
    this.resetForm();
  }

  getItemTypes() {
    this.itemTypes = [];
    this.loading = true;

    this.inventoryItemService.getItemTypes().subscribe(types => {
      this.itemTypes = types;
      this.loading = false;
    });
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      unitOfMeasure: [null, Validators.required],
      currentStockLevel: [null, Validators.required],
      itemType: [null, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      name: this.inventoryItem?.name ?? '',
      description: this.inventoryItem?.description ?? '',
      unitOfMeasure: this.inventoryItem?.unitOfMeasure ?? '',
      currentStockLevel: this.inventoryItem?.currentStockLevel ?? null,
      itemType: this.inventoryItem?.itemType ?? null,
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.inventoryItem) {
      this.inventoryItemService.update(this.inventoryItem.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Inventário atualizado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe um item no inventário com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          }
          this.emitSave();
        }
      });
    } else {
      this.inventoryItemService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Item no inventário criado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe um item no inventário com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao criar item no inventário', severity: 'error'});
          }
          this.emitSave();
        }
      });
    }
  }

  emitSave() {
    this.loading = false;
    this.resetForm();
    this.onSave.emit();
  }

  onCancel() {
    this.resetForm();
    this.onClose.emit();
  }

}
