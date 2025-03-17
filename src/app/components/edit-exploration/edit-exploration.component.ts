import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Input, Output } from '@angular/core';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { PrimeNgModule } from '../../shared/modules/prime-ng/prime-ng.module';
import { ExplorationModel } from './../../models/exploration.model';
import { ExplorationsService } from './../../services/explorations.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-exploration',
  standalone: true,
  imports: [
    EditFormComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  templateUrl: './edit-exploration.component.html',
  styleUrl: './edit-exploration.component.css'
})
export class EditExplorationComponent implements OnInit, OnChanges {
  @Input({ required: true }) visible!: boolean;
  @Input() exploration?: ExplorationModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  editForm!: FormGroup;
  loading = false;
  edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private explorationsService: ExplorationsService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.exploration?.id;

    this.editForm = this.formBuilder.group({
      name: [this.exploration?.name, Validators.required],
      property: [this.exploration?.property, Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.exploration) {
      this.explorationsService.update(this.exploration.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Exploração atualizado com sucesso', severity: 'success'});
          this.emitSave()
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Atenção', detail: 'Este nome já está sendo utilizado', severity: 'warn'});
          } else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          }
          this.loading = false;
        }
      });
    } else {
      this.explorationsService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Exploração atualizado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Atenção', detail: 'Este nome já está sendo utilizado', severity: 'warn'});
          } else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao criar exploração', severity: 'error'});
          }
          this.loading = false;
        }
      });
    }
  }

  emitSave() {
    this.loading = false;
    this.editForm.reset();
    this.onSave.emit();
  }

  onCancel() {
    this.editForm.reset();
    this.onClose.emit();
  }
}

