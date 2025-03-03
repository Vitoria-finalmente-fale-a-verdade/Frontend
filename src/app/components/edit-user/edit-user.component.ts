import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {UserModel} from '../../models/user.model';
import {UsersService} from '../../services/users.service';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {RoleModel} from '../../models/role.model';
import {RolesService} from '../../services/roles.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    EditFormComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit, OnChanges {
  @Input({ required: true }) visible!: boolean;
  @Input() user?: UserModel;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  roleList?: RoleModel[];
  editForm!: FormGroup;
  loading = false;
  edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private rolesService: RolesService,
  ) { }

  ngOnInit() {
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['visible']) {
      return;
    }

    this.edit = !!this.user?.id;

    this.editForm = this.formBuilder.group({
      username: [this.user?.username, Validators.required],
      firstName: [this.user?.firstName, Validators.required],
      lastName: [this.user?.lastName, Validators.required],
      phoneNumber: [this.user?.phoneNumber],
      roles: [this.user?.roles.map(r => r.id), Validators.required],
    });
  }

  getRoles() {
    this.rolesService.getAll().subscribe({
      next: response => {
        this.roleList = response;
      }, error: () => {
        this.messageService.add({summary: 'Erro', detail: 'Erro ao buscar permissões', severity: 'error'});
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    this.loading = true;
    if (this.user) {
      this.usersService.update(this.user.id, this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Usuário atualizado com sucesso', severity: 'success'});
          this.emitSave()
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Atenção', detail: 'Este username já está sendo utilizado', severity: 'warn'});
          } else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao salvar alterações', severity: 'error'});
          }
          this.loading = false;
        }
      });
    } else {
      this.usersService.create(this.editForm.value).subscribe({
        next: () => {
          this.messageService.add({summary: 'Sucesso', detail: 'Usuário atualizado com sucesso', severity: 'success'});
          this.emitSave();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.messageService.add({summary: 'Atenção', detail: 'Este username já está sendo utilizado', severity: 'warn'});
          } else {
            this.messageService.add({summary: 'Erro', detail: 'Erro ao criar usuário', severity: 'error'});
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
