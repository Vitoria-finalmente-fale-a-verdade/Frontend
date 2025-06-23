import { Component } from '@angular/core';
import {SimpleCardGridComponent} from '../../../components/simple-card-grid/simple-card-grid.component';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    SimpleCardGridComponent
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.css'
})
export class ActivitiesListComponent {

}
