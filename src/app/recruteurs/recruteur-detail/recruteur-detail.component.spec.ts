import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteurDetailComponent } from './recruteur-detail.component';

describe('RecruteurDetailComponent', () => {
  let component: RecruteurDetailComponent;
  let fixture: ComponentFixture<RecruteurDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecruteurDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruteurDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
