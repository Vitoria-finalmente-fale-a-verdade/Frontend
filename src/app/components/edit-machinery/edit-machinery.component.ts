import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MachineryService } from '../../services/machinery.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import MachineryModel from '../../models/machinery.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { PrimeNgModule } from '../../shared/modules/prime-ng/prime-ng.module';

@Component({
  selector: 'app-edit-machinery',
  standalone: true,
  imports: [
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  templateUrl: './edit-machinery.component.html',
  styleUrl: './edit-machinery.component.css'
})
export class EditMachineryComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) visible!: boolean;
  @Input() machinery?: MachineryModel;

  @Output() onSave = new Subject<void>();
  @Output() onClose = new Subject<void>();

  editForm!: FormGroup;
  loading = false;
  edit = false;
  unsubscribe = new Subject<void>();

  today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private machineryService: MachineryService,
    private messageService: MessageService,
  ) {
    this.initForm();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.machinery?.id;
    this.resetForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      name: [null, Validators.required],
      acquisitionDate: [null, Validators.required],
      unitValue: [null, Validators.required],
      quantity: [null, Validators.required],
      lifeCycle: [null, Validators.required],
      isDepreciable: [false, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      name: this.machinery?.name ?? '',
      acquisitionDate: this.machinery?.acquisitionDate ?? new Date(),
      unitValue: this.machinery?.unitValue ?? null,
      quantity: this.machinery?.quantity ?? null,
      lifeCycle: this.machinery?.lifeCycle ?? null,
      isDepreciable: this.machinery?.isDepreciable ?? false,
    });
  }


  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.machinery) {
      this.machineryService.update(this.machinery.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Maquinário atualizado com sucesso', severity: 'success'});
          this.emitSave()
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          this.loading = false;
        }
      });
    } else {
      this.machineryService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Maquinário criado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao criar maquinário', severity: 'error'});
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
