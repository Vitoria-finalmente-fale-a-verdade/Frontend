import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {EditFormComponent} from "../edit-form/edit-form.component";
import {FloatLabel} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {ExplorationModel} from '../../models/exploration.model';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {ExplorationsService} from '../../services/explorations.service';

@Component({
  selector: 'app-edit-exploration',
  standalone: true,
    imports: [
        EditFormComponent,
        FloatLabel,
        FormsModule,
        InputText,
        ReactiveFormsModule,
    ],
  templateUrl: './edit-exploration.component.html',
  styleUrl: './edit-exploration.component.css'
})
export class EditExplorationComponent implements OnChanges {
  @Input({ required: true }) visible!: boolean;
  @Input() exploration?: ExplorationModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  editForm!: FormGroup;
  loading = false;
  edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private explorationsService: ExplorationsService,
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.exploration?.id;
    this.resetForm();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      category: [null, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      category: this.exploration?.category ?? '',
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
          this.messageService.add({summary: 'Sucesso', detail: 'Exploração atualizada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe uma exploração com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          }
          this.emitSave();
        }
      });
    } else {
      this.explorationsService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Exploração criada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe uma exploração com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao criar exploração', severity: 'error'});
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
