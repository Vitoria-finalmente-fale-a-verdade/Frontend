import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrimeNgModule} from '../../shared/modules/prime-ng/prime-ng.module';
import {DataViewModule} from 'primeng/dataview';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-simple-card-grid',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    CardModule,
    DataViewModule,
  ],
  templateUrl: './simple-card-grid.component.html',
  styleUrl: './simple-card-grid.component.css'
})
export class SimpleCardGridComponent {
  data = [
    {
      title: 'Comprar mudas',
      description: 'Compra de mudas ou sementes'
    },
    {
      title: 'Comprar insumos',
      description: 'Compra de fertilizantes, iseticida, herbicidas, etc.'
    },
    {
      title: 'Preparar solo',
      description: 'Registrar preparação de solo para plantio'
    },
    {
      title: 'Irrigar',
      description: 'Registrar realização de irrigação'
    },
    {
      title: 'Plantar',
      description: 'Registrar plantio'
    },
    {
      title: 'Aplicar inseticida',
      description: 'Registrar aplicação de inseticida'
    },
    {
      title: 'Aplicar herbicida',
      description: 'Registrar aplicação de herbicida'
    },
    {
      title: 'Adubar',
      description: 'Registrar adubação do solo'
    },
    {
      title: 'Colher',
      description: 'Registrar colheita'
    }
  ];
}
