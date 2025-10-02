import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatWizardComponent } from './candidat-wizard.component';

describe('CandidatWizardComponent', () => {
  let component: CandidatWizardComponent;
  let fixture: ComponentFixture<CandidatWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
