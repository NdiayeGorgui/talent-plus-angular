import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeurDetailsComponent } from './employeur-details.component';

describe('EmployeurDetailsComponent', () => {
  let component: EmployeurDetailsComponent;
  let fixture: ComponentFixture<EmployeurDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeurDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeurDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
