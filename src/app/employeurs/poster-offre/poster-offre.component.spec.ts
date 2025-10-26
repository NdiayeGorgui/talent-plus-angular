import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterOffreComponent } from './poster-offre.component';

describe('PosterOffreComponent', () => {
  let component: PosterOffreComponent;
  let fixture: ComponentFixture<PosterOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosterOffreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
