import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCandidatComponent } from './create-candidat.component';

describe('CreateCandidatComponent', () => {
  let component: CreateCandidatComponent;
  let fixture: ComponentFixture<CreateCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCandidatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
