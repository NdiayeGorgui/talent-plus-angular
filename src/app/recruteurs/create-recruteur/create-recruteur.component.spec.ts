import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecruteurComponent } from './create-recruteur.component';

describe('CreateRecruteurComponent', () => {
  let component: CreateRecruteurComponent;
  let fixture: ComponentFixture<CreateRecruteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRecruteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
