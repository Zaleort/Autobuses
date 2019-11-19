import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaCardComponent } from './linea-card.component';

describe('LineaCardComponent', () => {
  let component: LineaCardComponent;
  let fixture: ComponentFixture<LineaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
