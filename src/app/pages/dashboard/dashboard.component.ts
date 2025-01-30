import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, SelectModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedOptions = {
    analysis: 'Custo',
    culture: 'Gado',
    group: 'Corte'
  };

  selectList = [
    {
      options: [
        'Custo',
        'Opção 2',
        'Opção 3'
      ],
      controlName: 'analysis' as keyof typeof this.selectedOptions,
      title: 'Análise'
    },
    {
      options: [
        'Gado',
        'Opção 2',
        'Opção 3'
      ],
      controlName: 'culture' as keyof typeof this.selectedOptions,
      title: 'Cultura'
    },
    {
      options: [
        'Corte',
        'Opção 2',
        'Opção 3'
      ],
      controlName: 'group' as keyof typeof this.selectedOptions,
      title: 'Grupo'
    },
  ];

  cards = [
    {
      title: 'Mão de obra',
      value: 370950.9,
      icon: 'users',
      color: 'green-400'
    },
    {
      title: 'Mecanização',
      value: 180372.88,
      icon: 'cog',
      color: 'blue-400'
    },
    {
      title: 'Insumos',
      value: 91246.63,
      icon: 'globe',
      color: 'purple-400'
    }
  ];
  protected readonly Array = Array;
}
