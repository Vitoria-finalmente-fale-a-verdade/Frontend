import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSideLayoutComponent } from './nav-side-layout.component';

describe('NavSideLayoutComponent', () => {
  let component: NavSideLayoutComponent;
  let fixture: ComponentFixture<NavSideLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSideLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSideLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
