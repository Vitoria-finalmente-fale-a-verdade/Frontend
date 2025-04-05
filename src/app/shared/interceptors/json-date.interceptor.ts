import {HttpEvent, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs';

export const jsonDateInterceptor: HttpInterceptorFn = (req, next) => {
  const _isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z?$/

  const isIsoDateString = (value: any): boolean => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string'){
      return _isoDateFormat.test(value);
    }    return false;
  }

  const convert = (body: any) => {
    if (body === null || body === undefined) {
      return body;
    }
    if (typeof body !== 'object') {
      return body;
    }
    for (const key of Object.keys(body)) {
      const value = body[key];
      if (isIsoDateString(value)) {
        body[key] = new Date(value);
      } else if (typeof value === 'object') {
        convert(value);
      }
    }
  }

  return next(req).pipe(map( (val: HttpEvent<any>) => {
    if (val instanceof HttpResponse){
      const body = val.body;
      convert(body);
    }
    return val;
  }));
};
