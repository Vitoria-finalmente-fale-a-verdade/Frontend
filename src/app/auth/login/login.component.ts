import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import {CommonModule} from '@angular/common';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class LoginComponent implements OnInit {
  error = '';
  loginForm!: FormGroup;
  loading = false;
  submitted!: boolean;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) { }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    const response = this.authService.login(this.f['username'].value, this.f['password'].value);

    if (response) {
      setTimeout(() => {
        this.router.navigate(['']);
      }, 2000);

    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Nome de usuário ou senha inválidos' });
      this.loading = false;
    }
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

}
