import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivityModel} from '../models/activity.model';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseService<ActivityModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'activities/');
  }
}
