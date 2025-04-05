import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentCropListComponent } from './permanent-crop-list.component';

describe('CultureListComponent', () => {
  let component: PermanentCropListComponent;
  let fixture: ComponentFixture<PermanentCropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermanentCropListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermanentCropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
