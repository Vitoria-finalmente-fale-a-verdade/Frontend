import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {AvatarModule} from 'primeng/avatar';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {ChartModule} from 'primeng/chart';
import {CustomersService} from '../../services/customers.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    SelectModule,
    FormsModule,
    ChartModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  selectedCustomer: any;

  constructor(private customersService: CustomersService) {
  }

  ngOnInit(): void {
    this.selectedCustomer = this.customersService.selectedCustomer;
    this.customersService.selectedCustomerChange.subscribe(customer => {
      this.selectedCustomer = customer;
    })
  }

  doughnutData = {
    labels: ['Insumos', 'Mão de Obra', 'Mecanização'],
    datasets: [
      {
        data: [300, 50, 100]
      },
    ]
  }

  doughnutOptions = {
    aspectRatio: 1.6
  }

  barData = {
    labels: ['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
    datasets: [
      {
        type: 'bar',
        label: 'Dataset 1',
        data: [50, 25, 12, 48, 90, 76, 42]
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        data: [21, 84, 24, 75, 37, 65, 34]
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        data: [41, 52, 24, 74, 23, 21, 32]
      }
    ]
  }

  barOptions = {
    aspectRatio: 1.6,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
    }
  }

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
}
