import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductModel } from '../models/product.model';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<ProductModel> {

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'inventory/items/');
  }
}
