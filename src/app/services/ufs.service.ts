import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {UfModel} from '../models/uf.model';
import {CityModel} from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class UfsService {

  baseUrl = environment.ibgeDataUrl + 'localidades/estados/';
  client: HttpClient;
  constructor(handler: HttpBackend) {
    this.client = new HttpClient(handler);
  }

  public get() {
    return this.client.get<UfModel[]>(`${this.baseUrl}`);
  }

  public getCities(uf: string) {
    return this.client.get<CityModel[]>(`${this.baseUrl}${uf}/municipios/`);
  }
}
