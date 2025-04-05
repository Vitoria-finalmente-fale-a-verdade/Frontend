import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPermanentCropComponent } from './edit-permanent-crop.component';

describe('EditCultureComponent', () => {
  let component: EditPermanentCropComponent;
  let fixture: ComponentFixture<EditPermanentCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPermanentCropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPermanentCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
