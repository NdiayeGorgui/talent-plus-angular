import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeurComponent } from './create-employeur.component';

describe('CreateEmployeurComponent', () => {
  let component: CreateEmployeurComponent;
  let fixture: ComponentFixture<CreateEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEmployeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
