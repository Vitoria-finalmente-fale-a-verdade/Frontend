import {Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {PermanentCropService} from '../../services/permanent-crop.service';
import {Subject, takeUntil} from 'rxjs';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import PermanentCropModel from '../../models/permanent-crop.model';
import {ActivityModel} from '../../models/activity.model';
import {ActivitiesService} from '../../services/activities.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-edit-permanent-crop',
  standalone: true,
  imports: [
    EditFormComponent,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  templateUrl: './edit-permanent-crop.component.html',
  styleUrl: './edit-permanent-crop.component.css'
})
export class EditPermanentCropComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) visible!: boolean;
  @Input() permanentCrop?: PermanentCropModel;

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
    private permanentCropService: PermanentCropService,
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

    this.edit = !!this.permanentCrop?.id;
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
      name: this.permanentCrop?.name ?? '',
      activityId: this.permanentCrop?.activity?.id ?? '',
      implantationDate: this.permanentCrop?.implantationDate ?? new Date(),
      area: this.permanentCrop?.area ?? null,
      unitValue: this.permanentCrop?.unitValue ?? null,
      lifeCycle: this.permanentCrop?.lifeCycle ?? null,
      isDepreciable: this.permanentCrop?.isDepreciable ?? false,
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.permanentCrop) {
      this.permanentCropService.update(this.permanentCrop.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Cultura Permanente atualizada com sucesso', severity: 'success'});
          this.emitSave()
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          this.loading = false;
        }
      });
    } else {
      this.permanentCropService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Cultura Permanente criada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao criar cultura permanente', severity: 'error'});
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
