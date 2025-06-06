import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CropModel} from '../models/crop.model';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CropService extends BaseService<CropModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'crop/');
  }
}
