import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakBarComponent } from './snak-bar.component';

describe('SnakBarComponent', () => {
  let component: SnakBarComponent;
  let fixture: ComponentFixture<SnakBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnakBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnakBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
