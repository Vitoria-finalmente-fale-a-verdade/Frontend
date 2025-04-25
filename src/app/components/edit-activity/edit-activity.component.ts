import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {EditFormComponent} from "../edit-form/edit-form.component";
import {FloatLabel} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {ActivityModel} from '../../models/activity.model';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivitiesService} from '../../services/activities.service';

@Component({
  selector: 'app-edit-activity',
  standalone: true,
    imports: [
        EditFormComponent,
        FloatLabel,
        FormsModule,
        InputText,
        ReactiveFormsModule,
    ],
  templateUrl: './edit-activity.component.html',
  styleUrl: './edit-activity.component.css'
})
export class EditActivityComponent implements OnChanges {
  @Input({ required: true }) visible!: boolean;
  @Input() activity?: ActivityModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  editForm!: FormGroup;
  loading = false;
  edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private activitiesService: ActivitiesService,
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.activity?.id;
    this.resetForm();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      category: [null, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      category: this.activity?.category ?? '',
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.activity) {
      this.activitiesService.update(this.activity.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Atividade atualizada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe uma atividade com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          }
          this.emitSave();
        }
      });
    } else {
      this.activitiesService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Atividade criada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Erro', detail: 'Já existe uma atividade com essa categoria', severity: 'error'});
          }
          else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao criar atividade', severity: 'error'});
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
