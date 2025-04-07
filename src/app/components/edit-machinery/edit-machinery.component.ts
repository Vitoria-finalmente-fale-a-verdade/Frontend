import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MachineryService } from '../../services/machinery.service';
import { MessageService } from 'primeng/api';
import { ExplorationsService } from '../../services/explorations.service';
import { AuthService } from '../../services/auth.service';
import { ExplorationModel } from '../../models/exploration.model';
import { Subject, takeUntil } from 'rxjs';
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
  loadingExplorations = true;
  explorationList: ExplorationModel[] = [];
  unsubscribe = new Subject<void>();

  today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private machineryService: MachineryService,
    private messageService: MessageService,
    private explorationsService: ExplorationsService,
    private authService: AuthService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getExplorations();

    this.authService.propertyChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.getExplorations());
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

  getExplorations() {
    this.explorationsService.getAll().subscribe({
      next: data => {
        this.explorationList = data;
        this.loadingExplorations = false;
      },
      error: _ => {
        this.messageService.add({
          summary: 'Erro',
          detail: 'Erro ao buscar explorações',
          severity: 'error',
        })
        this.loadingExplorations = false;
      }
    })
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      description: [null, Validators.required],
      explorationId: [null, Validators.required],
      acquisitionDate: [null, Validators.required],
      acquisitionValue: [null, Validators.required],
      serviceLife: [null, Validators.required],
      isDepreciable: [false, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      description: this.machinery?.description ?? '',
      explorationId: this.machinery?.exploration?.id ?? '',
      acquisitionDate: this.machinery?.acquisitionDate ?? new Date(),
      acquisitionValue: this.machinery?.acquisitionValue ?? null,
      serviceLife: this.machinery?.serviceLife ?? null,
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
