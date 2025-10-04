import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadonneeRhStepComponent } from './metadonnee-rh-step.component';

describe('MetadonneeRhStepComponent', () => {
  let component: MetadonneeRhStepComponent;
  let fixture: ComponentFixture<MetadonneeRhStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetadonneeRhStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetadonneeRhStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
