import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencesStepComponent } from './experiences-step.component';

describe('ExperiencesStepComponent', () => {
  let component: ExperiencesStepComponent;
  let fixture: ComponentFixture<ExperiencesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExperiencesStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperiencesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
