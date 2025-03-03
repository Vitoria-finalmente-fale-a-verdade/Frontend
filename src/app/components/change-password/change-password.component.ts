import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {FloatLabel} from 'primeng/floatlabel';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    EditFormComponent,
    FloatLabel,
    PasswordModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnChanges {
  @Input({ required: true }) visible!: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  form!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['visible']) {
      return;
    }

    this.form = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({summary: 'Formulário incompleto', detail: 'Preencha todos os campos para salvar', severity: 'warn'});
      return;
    }

    if (this.form.value.newPassword != this.form.value.confirmPassword) {
      this.messageService.add({summary: 'Confirme as senhas', detail: 'A senha nova e confirmação devem ser iguais', severity: 'warn'});
      return;
    }

    this.loading = true;
    this.authService.changePassword(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.visibleChange.emit(false);
        this.messageService.add({summary: 'Sucesso', detail: 'Senha alterada com sucesso', severity: 'success'});
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status == 401) {
          this.messageService.add({summary: 'Tente novamente', detail: 'Sua antiga senha está incorreta', severity: 'warn'});
          return;
        }
        this.messageService.add({summary: 'Erro', detail: 'Não foi possível alterar sua senha', severity: 'error'});
      }
    })
  }

  onCancel() {
    this.visibleChange.emit(false);
  }
}
