import { IsAuthorizedDirective } from './is-authorized.directive';
import {AuthService} from '../../services/auth.service';
import {inject, TemplateRef, ViewContainerRef} from '@angular/core';

describe('IsAuthorizedDirective', () => {
  it('should create an instance', () => {
    const directive = new IsAuthorizedDirective(inject(AuthService), inject(TemplateRef), inject(ViewContainerRef));
    expect(directive).toBeTruthy();
  });
});
