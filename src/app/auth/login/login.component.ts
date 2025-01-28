import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import {ToastModule} from 'primeng/toast';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {DividerModule} from 'primeng/divider';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
  imports: [
    CommonModule,
    ToastModule,
    CardModule,
    InputTextModule,
    DividerModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class LoginComponent implements OnInit {
  error = '';
  loginForm!: FormGroup;
  loading = false;
  returnUrl!: string;
  submitted!: boolean;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    if (this.authService.userValue) {
      // this.router.navigate(['pages/home']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    const response = this.authService.login(this.f['username'].value, this.f['password'].value);

    if (response) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Signin Successful' });
      setTimeout(() => {
        this.router.navigate(['pages/home']);
      }, 2000);

    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Signin Failed' });
    }
    this.loading = false;
    // .subscribe(() => {
    //   this.messageService.add({severity:'success', summary: 'Success', detail: 'Signin Successful'});
    //   this.router.navigate([this.returnUrl]);
    // },
    //   (error: any) => {
    //     this.error = error;
    //     this.loading = false;
    //     this.messageService.add({severity:'error', summary: 'Error', detail: 'Signin Failed'});
    //   }
    // );
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

}
