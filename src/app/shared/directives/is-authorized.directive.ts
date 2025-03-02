import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Directive({
  selector: '[isAuthorized]',
  standalone: true
})
export class IsAuthorizedDirective implements OnInit {

  private roles?: string[];

  @Input()
  set isAuthorized(roles: string[] | undefined) {
    this.roles = roles;
  }

  constructor(
    private authService: AuthService,
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    if (this.canView()) {
      this._viewContainer.clear();
      this._viewContainer.createEmbeddedView(this._templateRef);
    }
  }

  canView(): boolean {
    return !this.roles?.length ||
        !!this.authService.user.roles?.find(r => this.roles?.includes(r.normalizedName));
  }
}
