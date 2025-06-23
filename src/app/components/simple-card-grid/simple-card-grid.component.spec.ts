import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCardGridComponent } from './simple-card-grid.component';

describe('SimpleCardGridComponent', () => {
  let component: SimpleCardGridComponent;
  let fixture: ComponentFixture<SimpleCardGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleCardGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleCardGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
