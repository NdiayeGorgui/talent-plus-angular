import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecrutementsListComponent } from './recrutements-list.component';

describe('RecrutementsListComponent', () => {
  let component: RecrutementsListComponent;
  let fixture: ComponentFixture<RecrutementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecrutementsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecrutementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
