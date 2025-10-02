import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencesStepComponent } from './competences-step.component';

describe('CompetencesStepComponent', () => {
  let component: CompetencesStepComponent;
  let fixture: ComponentFixture<CompetencesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompetencesStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetencesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
