import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {PropertyModel} from '../../models/property.model';
import {PropertiesService} from '../../services/properties.service';
import {UfModel} from '../../models/uf.model';
import {UfsService} from '../../services/ufs.service';
import {CommonModule} from '@angular/common';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {CityModel} from '../../models/city.model';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    EditFormComponent
  ],
  templateUrl: './edit-property.component.html',
  styleUrl: './edit-property.component.css'
})
export class EditPropertyComponent implements OnInit, OnChanges {
  @Input({ required: true }) visible!: boolean;
  @Input() property?: PropertyModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  editForm!: FormGroup;
  loading = false;
  edit = false;
  ufList: UfModel[] = [];
  loadingCities = false;
  cities: CityModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService,
    private messageService: MessageService,
    private ufsService: UfsService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getUfs();
  }

  getUfs() {
    this.ufsService.get().subscribe({
      next: ufs => {
        this.ufList = ufs;
      },
      error: err => {
        console.error(err);
        this.messageService.add({summary: 'Erro', detail: 'Erro ao buscar UFs', severity: 'error'});
      }
    })
  }

  getCities() {
    if (!this.editForm.value.state)
      return;

    this.cities = [];
    this.loadingCities = true;

    this.ufsService.getCities(this.editForm.value.state).subscribe({
      next: cities => {
        this.editForm.controls['city']?.enable();
        this.cities = cities;
        this.loadingCities = false;
      },
      error: err => {
        console.error(err);
        this.messageService.add({summary: 'Erro', detail: 'Erro ao buscar Municípios', severity: 'error'});
        this.loadingCities = false;
      }
    })
  }

  onChangeState() {
    this.editForm.controls['city'].reset();
    this.getCities();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.property?.id;
    this.resetForm();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      name: [null, Validators.required],
      city: [{value: null, disabled: true}, Validators.required],
      state: [null, Validators.required],
      region: [],
    });
  }

  resetForm() {
    this.editForm.controls['city'].disable();
    this.editForm.setValue({
      name: this.property?.name ?? '',
      city: this.property?.city ?? null,
      state: this.property?.state ?? null,
      region: this.property?.region ?? null,
    });

    this.getCities();
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.property) {
      this.propertiesService.update(this.property.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Propriedade atualizado com sucesso', severity: 'success'});
          this.emitSave()
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          this.loading = false;
        }
      });
    } else {
      this.propertiesService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Propriedade criada com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (_: HttpErrorResponse) => {
          this.messageService.add({summary: 'Erro', detail: 'Erro ao criar usuário', severity: 'error'});
          this.loading = false;
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
