import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExplorationComponent } from './edit-exploration.component';

describe('EditExplorationComponent', () => {
  let component: EditExplorationComponent;
  let fixture: ComponentFixture<EditExplorationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExplorationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExplorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
