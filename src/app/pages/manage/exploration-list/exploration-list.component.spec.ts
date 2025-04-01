import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationListComponent } from './exploration-list.component';

describe('ExplorationListComponent', () => {
  let component: ExplorationListComponent;
  let fixture: ComponentFixture<ExplorationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
