import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductModel } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimeNgModule } from '../../shared/modules/prime-ng/prime-ng.module';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnChanges{
  @Input({ required: true }) visible!: boolean;
  @Input() product?: ProductModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  editForm!: FormGroup;
  loading = false;
  edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.product?.id;
    this.resetForm();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      name: [null, Validators.required],
      unitValue: [null, Validators.required],
      quantity: [null, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      name: this.product?.name ?? '',
      unitValue: this.product?.unitValue ?? null,
      quantity: this.product?.quantity ?? null,
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.product) {
      this.productService.update(this.product.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Produto atualizado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe um produto com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          }
          this.emitSave();
        }
      });
    } else {
      this.productService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Produto criado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe um produto com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao criar produto', severity: 'error'});
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
