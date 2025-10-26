import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesApplicationsComponent } from './mes-applications.component';

describe('MesApplicationsComponent', () => {
  let component: MesApplicationsComponent;
  let fixture: ComponentFixture<MesApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MesApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
