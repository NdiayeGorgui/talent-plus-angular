import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteursListComponent } from './recruteurs-list.component';

describe('RecruteursListComponent', () => {
  let component: RecruteursListComponent;
  let fixture: ComponentFixture<RecruteursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecruteursListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruteursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
