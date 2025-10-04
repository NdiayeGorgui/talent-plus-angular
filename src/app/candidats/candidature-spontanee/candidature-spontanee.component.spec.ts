import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatureSpontaneeComponent } from './candidature-spontanee.component';

describe('CandidatureSpontaneeComponent', () => {
  let component: CandidatureSpontaneeComponent;
  let fixture: ComponentFixture<CandidatureSpontaneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatureSpontaneeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatureSpontaneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
