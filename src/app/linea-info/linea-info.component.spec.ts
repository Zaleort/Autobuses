import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaInfoComponent } from './linea-info.component';

describe('LineaInfoComponent', () => {
  let component: LineaInfoComponent;
  let fixture: ComponentFixture<LineaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
