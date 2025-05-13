import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {PropertyModel} from '../models/property.model';
import {Subject, tap} from 'rxjs';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService extends BaseService<PropertyModel> {
  changeProperties = new Subject<void>();

  constructor(client: HttpClient) {
    super(client, environment.baseUrl + 'properties/');
  }

  public override create(property: PropertyModel) {
    return super.create(property).pipe(
      tap({
        next: _ => {
          this.changeProperties.next();
        }
      })
    );
  }

  public override update(id: string, property: PropertyModel) {
    return super.update(id, property).pipe(
      tap({
        next: _ => {
          this.changeProperties.next();
        }
      })
    );
  }

  public override delete(id: string) {
    return super.delete(id).pipe(
      tap({
        next: _ => {
          this.changeProperties.next();
        }
      })
    );
  }
}
