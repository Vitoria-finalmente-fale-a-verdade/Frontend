import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule,
    DialogModule
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css'
})
export class EditFormComponent {
  @Input() loading = false;
  @Input() title = 'Editar';

  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  @Input({ required: true }) visible!: boolean;

  onClose() {
    this.onCancel.emit();
  }

  onSubmit() {
    this.onSave.emit();
  }
}
