import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockMovementComponent } from './edit-stock-movement.component';

describe('EditStockMovementComponent', () => {
  let component: EditStockMovementComponent;
  let fixture: ComponentFixture<EditStockMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStockMovementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStockMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
