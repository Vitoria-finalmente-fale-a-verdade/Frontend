import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UfModel} from '../models/uf.model';
import {CityModel} from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class UfsService {

  baseUrl = environment.ibgeDataUrl + 'localidades/estados/';

  constructor(private client: HttpClient) { }

  public get() {
    return this.client.get<UfModel[]>(`${this.baseUrl}`);
  }

  public getCities(uf: string) {
    return this.client.get<CityModel[]>(`${this.baseUrl}${uf}/municipios/`);
  }
}
