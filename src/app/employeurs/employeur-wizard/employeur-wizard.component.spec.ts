import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeurWizardComponent } from './employeur-wizard.component';

describe('EmployeurWizardComponent', () => {
  let component: EmployeurWizardComponent;
  let fixture: ComponentFixture<EmployeurWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeurWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeurWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
