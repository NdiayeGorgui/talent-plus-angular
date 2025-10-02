import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDialogComponent } from './historique-dialog.component';

describe('HistoriqueDialogComponent', () => {
  let component: HistoriqueDialogComponent;
  let fixture: ComponentFixture<HistoriqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
