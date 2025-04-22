import {Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {CropService} from '../../services/crop.service';
import {Subject, takeUntil} from 'rxjs';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import CropModel from '../../models/crop.model';
import {ActivityModel} from '../../models/activity.model';
import {ActivitiesService} from '../../services/activities.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-edit-crop',
  standalone: true,
  imports: [
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  templateUrl: './edit-crop.component.html',
  styleUrl: './edit-crop.component.css'
})
export class EditCropComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) visible!: boolean;
  @Input() crop?: CropModel;

  @Output() onSave = new Subject<void>();
  @Output() onClose = new Subject<void>();

  editForm!: FormGroup;
  loading = false;
  edit = false;
  loadingActivities = true;
  activityList: ActivityModel[] = [];
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

    this.edit = !!this.crop?.id;
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
      name: [null, Validators.required],
      activityId: [null, Validators.required],
      implantationDate: [null, Validators.required],
      area: [null, Validators.required],
      unitValue: [null, Validators.required],
      lifeCycle: [null, Validators.required],
      isDepreciable: [false, Validators.required],
    });
  }

  resetForm() {
    this.editForm.setValue({
      name: this.crop?.name ?? '',
      activityId: this.crop?.activity?.id ?? '',
      implantationDate: this.crop?.implantationDate ?? new Date(),
      area: this.crop?.area ?? null,
      unitValue: this.crop?.unitValue ?? null,
      lifeCycle: this.crop?.lifeCycle ?? null,
      isDepreciable: this.crop?.isDepreciable ?? false,
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.crop) {
      this.cropService.update(this.crop.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Cultura atualizada com sucesso', severity: 'success'});
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
          this.messageService.add({summary: 'Sucesso', detail: 'Cultura criada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao criar cultura', severity: 'error'});
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
