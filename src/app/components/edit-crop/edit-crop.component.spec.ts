import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCropComponent } from './edit-crop.component';

describe('EditCultureComponent', () => {
  let component: EditCropComponent;
  let fixture: ComponentFixture<EditCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
